/**
 * This is the bootstrap script, which is called when the page is active.
 * We check to see Angular presence on the page. If yes,  create the wrapEvent
 * function to dispach events; othewise poll for 10 seconds.
 * 
 * @param {Window} window
 */

export function initBootstrap (window) {
    
    let wraped = false
    let checkCount = 0

    const checkWrapInterval = setInterval (wrapEvent, 1000)

    function wrapEvent () {
        if (!window.angular || wraped || checkCount++ > 10) return

        const root = document.querySelector('.ng-scope')
        const rootScope = angular.element(root).data('$scope')
        const devtools = window.__NG_DEVTOOLS_GLOBAL_HOOK__

         // add wrap event function
        angular.$wrapEvent = angular.noop

        // define $rootElement
        Object.defineProperty(angular, '$$rootElement', {
            get () {
                return this.element(
                    document.querySelector('.ng-scope')
                )
            }
        })
        
        function wrap (method) {
            const original = rootScope.__proto__[method]

            if (original && (original.name !== 'kindnapped')) {
                rootScope.__proto__[method] = function kindnapped (...args) {
                    // event result
                    const result = original.apply(this, args)

                    // wrap events
                    angular.$wrapEvent(this, method, args[0], args.slice(1))

                    return result
                }
            }
        }

       if (rootScope) {
           wrap('$emit')
           wrap('$broadcast')
       }

       // init hooks
       devtools.emit('init', angular)

       // clear check wrap
       clearInterval(checkWrapInterval)
       wraped = true
    }
}