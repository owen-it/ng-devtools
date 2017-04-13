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
const propModes = ['default', 'sync', 'once']

const instanceMap = window.__NG_DEVTOOLS_INSTANCE_MAP__ = new Map()

let bridge
let isLegacy = false
let filter = ''
let captureCount = 0

export function initBackend (_bridge) {
    bridge = _bridge

    if(hook.Angular){
        isLegacy = hook.Angular.version.minor && 
        hook.Angular.version.minor < 5

        connect()
    } else {
        hook.once('init', connect)
    }
}

function connect() {
    hook.currentTab = 'components'
    bridge.on('switch-tab', tab => {
        hook.currentTab = tab
        if(tab === 'components'){
            flush()
        }
    })

    // events
    initEventsBackend(hook.Angular, bridge)

    bridge.log('backend ready.')
    bridge.send('ready', hook.Angular.version.full)
    console.log('[ng-devtools] Ready. Detected Angular v' + hook.Angular.version.full)
}

function flush () {
    let start
    let isProduction = process.env.NODE_ENV === 'production'

    if (!isProduction) {
        captureCount = 0
        start = window.performance.now()
    }

    const payload = stringify({
        inspectIntance: '',
        instaces: []
    })

    if (!isProduction) {
        console.log(`[flush] serialized ${captureCount} instances, took ${window.performance.now() - start}ms`)
    }

    bridge.send('flush', payload)
}

/**
 * Get the appropriate display name for an instance.
 *
 * @param {Angular} instance
 * @return {String}
 */

export function getInscanceName (instance) 
{
    
}

export function getRootScope (instance) 
{
    return instance.injector(['ng']).get('$rootScope')
}