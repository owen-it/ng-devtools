var devtools = window.__NG_DEVTOOLS_GLOBAL_HOOK__

import * as angular from 'angular'

angular.$logEvent = function(){}
angular.module('ng').config(['$provide', function($provide) {
    $provide.decorator("$rootScope", function($delegate) {
        var $scope = $delegate.constructor;
        var origBroadcast = $scope.prototype.$broadcast;
        var origEmit = $scope.prototype.$emit;

        $scope.prototype.$broadcast = function(...args) {
            angular.$logEvent($scope, '$broadcast', args[0], args.slice(1))

            return origBroadcast.apply(this, arguments);
        };

        $scope.prototype.$emit = function(...args) {
            angular.$logEvent($scope, '$emit', args[0], args.slice(1))
            
            return origEmit.apply(this, arguments);
        };

        return $delegate;
    });
}]);

console.log(angular)

devtools.emit('init', angular)

import counter from './Counter.ng'

angular.module('app.count', []).components({ counter });
angular.module('app', ['app.count'])
angular.bootstrap(document.body, ['app'])

