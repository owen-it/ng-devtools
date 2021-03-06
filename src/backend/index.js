// This is the backend that is injected into the page that a Angular 
// app lives in when the Angular Devtools panel is activated.
import { initEventsBackend } from './events'
import { stringify } from '../util'
import path from 'path'

// Use a custom basename functions instead of the shimed version
// because it doesn't work on Windows
function basename (filename, ext ) {
    return path.basename(
        filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'),
        ext
    )
}

// hook should have been injected before this executes.
const hook = window.__NG_DEVTOOLS_GLOBAL_HOOK__
const rootInstances = []
const moduleInstances = []
const propModes = ['default', 'sync', 'once']

const instanceMap = window.__NG_DEVTOOLS_INSTANCE_MAP__ = new Map()

let currentInspectedId
let bridge
let isLegacy = false
let moduleFilter = ''
let captureCount = 0

export function initBackend (_bridge) {
    bridge = _bridge

    if(hook.Angular){
        isLegacy = hook.Angular.version.minor && 
        hook.Angular.version.minor < 6

        connect()
    } else {
        hook.once('init', connect)
    }
}

function connect() {
    hook.currentTab = 'modules'
    bridge.on('switch-tab', tab => {
        hook.currentTab = tab
        if(tab === 'modules'){
            flush()
        }
    })

    bridge.on('console', target => console.log( target ))
    bridge.on('refresh', scan)

    // filter module instances
    bridge.on('filter-module-instances', _filter => {
        moduleFilter = _filter.toLowerCase()

        flush()
    })

    // events
    initEventsBackend(hook.Angular, bridge)

    // models
    // initModelsBackend(hook.Angular, bridge)

    bridge.log('backend ready.')
    bridge.send('ready', hook.Angular.version.full)
    console.log('[ng-devtools] Ready. Detected Angular v' + hook.Angular.version.full)
    
    scan()
}


function scan ()
{
    rootInstances.length = 0
    moduleInstances.length = 0

    let $injector = hook.Angular.$$rootElement.injector()

    Object.keys($injector.modules).forEach(name => {
        moduleInstances.push($injector.modules[name])
    })

    flush()
}

/**
 * Get the detailed information of an inspected instance
 * 
 * @param {Number} id
 */
function getInstanceDetails (id)
{
    const instance = instanceMap.get(id)

    if (!instance) {
        return {}
    } else {
        return {
            id: id,
            name: getInstanceName(instance)
        }
    }
}


function flush () {
    let start
    let isProduction = process.env.NODE_ENV === 'production'

    if (!isProduction) {
        captureCount = 0
        start = window.performance.now()
    }

    const payload = stringify({
        inspectIntance: getInstanceDetails(currentInspectedId),
        instances: []
    })

    if (!isProduction) {
        console.log(`[flush] serialized ${captureCount} instances, took ${window.performance.now() - start}ms`)
    }

    bridge.send('flush', payload)

    // get instances of modules
    bridge.send('modules:flush', stringify({
        instances: findQualifiedModulesFromList(moduleInstances)
    }))
}

/**
 * Iterate through an arrya of instaces and flatten in into
 * array of qualified intances.
 * 
 * @param {Array} instances
 * @return {Array}
 */
function findQualifiedModulesFromList (instances) 
{
    return !moduleFilter 
        ? instances.map(capture) 
        // TODO: apply filter after
        : Array.prototype.concat([], instances.map(capture))
}

function walk (node, fn) 
{
    if (node.childNodes) {
        for (let i = 0, l = node.childNodes.length; i < l; i++) {
            const child = node.childNodes[i]
            const stop = fn(child)

            if (!stop) {
                walk(child, fn)
            }
        }
    }

    if (node.shadowRoot) {
        walk(node.shadowRoot, fn)
    }
}

/**
 * Get the apropriate display name for an instance
 */
export function getInstanceName (instance) 
{
    const name = (instance.$ctrl || instance).constructor.name

    if (name) {
        return name
    }

    return !instance.$root ? 'Root' : 'Anonymous Module'
}

/**
 * Interate through an array of instances an flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 * 
 * @param {Array} instances
 * @return {Array}
 */
function findQualifiedChildrenFromList (instances) 
{
    instances = instances.filter(
        child => !child.$$destroyed
    )

    return !filter 
        ? instances.map(capture)
        : [] // not implemented
}


/**
 * Capture the meta information of an instance (recursive)
 * 
 * @param {$scope} instance 
 * @return {Object}
 */
function capture (instance, _, list)
{
    if (process.env.NODE_ENV !== 'production') {
        captureCount++
    }

    const ret = {
        name: instance.name,
        values: getInjected(instance, 'value'),
        constants: getInjected(instance, 'constant'),
        info: instance.info(),
        requires: instance.requires,
        components: getInjected(instance, 'directive')
    }

    console.log( 'inspect => ', instance, ret )

    return ret
}

/**
 * Get type of value injected
 * 
 * @param {Object} instance
 * @param {String} type
 * @return {Array}
 */
function getInjected (instance, type) 
{
    let ret = {}

    instance._invokeQueue.filter(q => {
        return q[1] === type && q[2].length === 2
    }).forEach(value => {
        ret[value[2][0]] = value[2][1]
    })

    return ret
}

/**
 * Mark an instance as captured an store it in the instace map
 * 
 * @param {Object} instance 
 */
function mark (instance) 
{
    if (!instanceMap.has(instance.$id)) {
        instanceMap.set(instance.$id, instance)

        instance.$on('hook:beforeDestroy', function () {
            instanceMap.delete(instance.$id)
        })
    }
}

  /**
   * Counts all the direct and indirect child scopes of the current scope.
   *
   * The current scope is excluded from the count. The count includes all isolate child scopes.
   *
   * @returns {number} Total number of child scopes.
   */
  function countChildScopes() {
    var count = 0; // exclude the current scope
    var pendingChildHeads = [this.$$childHead];
    var currentScope;

    while (pendingChildHeads.length) {
      currentScope = pendingChildHeads.shift();

      while (currentScope) {
        count += 1;
        pendingChildHeads.push(currentScope.$$childHead);
        currentScope = currentScope.$$nextSibling;
      }
    }

    return count;
  }


  /**
   * Counts all the watchers of direct and indirect child scopes of the current scope.
   *
   * The watchers of the current scope are included in the count and so are all the watchers of
   * isolate child scopes.
   *
   * @returns {number} Total number of watchers.
   */
  function countWatchers() {
    var count = this.$$watchers ? this.$$watchers.length : 0; // include the current scope
    var pendingChildHeads = [this.$$childHead];
    var currentScope;

    while (pendingChildHeads.length) {
      currentScope = pendingChildHeads.shift();

      while (currentScope) {
        count += currentScope.$$watchers ? currentScope.$$watchers.length : 0;
        pendingChildHeads.push(currentScope.$$childHead);
        currentScope = currentScope.$$nextSibling;
      }
    }

    return count;
  }
