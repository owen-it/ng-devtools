var devtools = window.__NG_DEVTOOLS_GLOBAL_HOOK__

angular.$logEvent = function(){}
angular.module('ng').config(['$provide', function($provide) {
    $provide.decorator("$rootScope", function($delegate) {
        var $scope = $delegate.constructor;
        var origBroadcast = $scope.prototype.$broadcast;
        var origEmit = $scope.prototype.$emit;

        $scope.prototype.$broadcast = function(...args) {
            angular.$logEvent(this, '$broadcast', args[0], args.slice(1))

            return origBroadcast.apply(this, arguments);
        };

        $scope.prototype.$emit = function(...args) {
            angular.$logEvent(this, '$emit', args[0], args.slice(1))

            return origEmit.apply(this, arguments);
        };

        return $delegate;
    });
}]).run(function () {

    devtools.emit('init', angular)

});

