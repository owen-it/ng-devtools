import * as angular from 'angular'
import main from './main.ng'

window.jQuery = require('jquery')
window.$ = jQuery

angular.errorHandle = (h, e) => {
    return h('pre', {
        style: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: '12px',
            padding: '10px'
        }
    })
}

let app = null

export function initDevTools (shell) 
{
    initApp(shell)
    shell.onReload(() => 
    {
        if(app) {
            //angular.element(document).injector().get('$rootScope')
            //angular.injector(['app'])

            console.log('devtools -> app.$destory ')
        }

        bridge.removeAllListeners()
        initApp(shell)
    })

}

function initApp(shell)
{
    shell.connect(bridge => {
        window.bridge = bridge

        var name = 'app'

        bridge.once('ready', version => {
            // ...
        })

        app = angular.module(name, []).components({ main })

        angular.bootstrap(
            document.getElementById(name), [name]
        )
    })
}