// This is the backend that is injected into the page that a Angular 
// app lives in when the Angular Devtools panel is activated.
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

const instanceMap = window.__NG__DEVTOOLS_INSTANCE_MAP__ = new Map()

let bridge
let isLegacy = false

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
            //flush()
        }
    })

    bridge.log('backend ready.')
    bridge.send('ready', hook.Angular.version.full)
    console.log('[ng-devtools] Ready. Detected Angular v' + hook.Angular.version.full)
}