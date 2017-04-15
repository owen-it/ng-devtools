import * as angular from 'angular'
import App from './App.ng'
import store from './store'
import { parse } from '../util'

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

        var name = 'devtools'

        bridge.once('ready', version => {
            // ...
        })

        app = angular.module(name, [store])
        
        app.component('app', App)

        app.run(['flux', 'store', function(flux, store){

            bridge.once('ready', version => {
                flux.dispatch('SHOW_MESSAGE', { 
                    message: `Ready. Detected Angular ${version}.` 
                })

                bridge.send('events:toggle-recording', store.events.enabled)
            })

            bridge.on('event:triggered', payload => {
                flux.dispatch('events/RECEIVE_EVENT', parse(payload))

                if(store.tab !== 'events') {
                    flux.dispatch('events/INCREASE_NEW_EVENT_COUNT')
                }
            })


        }])

        .filter('formatTime', function(){
            return (timestamp) => {
                return (new Date(timestamp)).toString().match(/\d\d:\d\d:\d\d/)[0] 
            }
        })

        angular.bootstrap(
            document.getElementById('container'), [name]
        )
    })
}