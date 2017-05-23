import * as angular from 'angular'
import App from './App.ng'
import store from './store'
import { parse } from '../util'

window.jQuery = require('jquery')
window.$ = jQuery

Object.defineProperty(angular, '$$rootScope', {
    get () {
        return this.element(
            document.querySelector('.ng-scope')
        ).data('$scope')
    }
})

let app = null

export function initDevTools (shell) 
{
    initApp(shell)
    shell.onReload(() => {
        if(app) {
            document.getElementById('container').injector = null
            
            angular.$$rootScope.$destroy()
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

            bridge.on('modules:flush', payload => {
                flux.dispatch('modules/FLUSH', parse(payload))
            })

        }])

        .filter('formatTime', function(){
            return (timestamp) => {
                return (new Date(timestamp)).toString().match(/\d\d:\d\d:\d\d/)[0] 
            }
        })

        .directive('ngTransclude', function(){
            return {
                priority: 1,
                link: function($scope, $el, $attrs, $ctrl, $transclude) {
                    var slotName = $attrs.name;

                    if (slotName) {

              
                         //console.log( $transclude() )

                        var children = $el.children();
                        for (var i = 0; i < children.length; i++) {
                            var child = angular.element(children[i]);
                            var slot = child.attr('slot');
                            if (slot === slotName) {
                                $el.replaceWith(child)
                            } else {
                                child.remove()
                            }

                        }
                    }

                }
            };
        });

        angular.bootstrap(
            document.getElementById('container'), [name]
        )
    })
}

