// This is the bootstrap script, which is called when the page is active.
// We check to see Angular presence on the page. If yes,  create the wrapEvent
// functino to dispach events; othewise poll for 10 seconds.

function bootstrap (window) {
    
    let wraped = false
    let checkCount = 0

    const checkWrapInterval = setInterval (wrapEvent, 1000)

    function wrapEvent () {
        if (wraped || checkCount++ > 10) return

        if (!window.angular || wraped) return

         // add wrap event function
        angular.$wrapEvent = angular.noop

        const root = document.querySelector('.ng-scope')
        const rootScope = angular.element(root).data('$scope')
        const devtools = window.__NG_DEVTOOLS_GLOBAL_HOOK__
        
        function wrap (method) {
            const original = rootScope.__proto__[method]

            if (original && (original.name !== 'kindnapped')) {
                rootScope.__proto__[method] = function kindnapped () {
                    const result = original.apply(rootScope, arguments)

                    // wrap events
                    angular.$wrapEvent.apply(rootScope, arguments)

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

// inject the bootstrap angular
const script = document.createElement('script')
script.textContent = `;(${bootstrap.toString()})(window)`
document.documentElement.appendChild(script)
script.parentNode.removeChild(script)