import * as angular from 'angular'

import counter from './Counter.ng'

var devtools = window.__NG_DEVTOOLS_GLOBAL_HOOK__

console.log(devtools)

angular.module('app', []).components({ counter })

angular.bootstrap(document.body, ['app'])

devtools.emit('init', angular)
