// this script is injected into every page.

/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag. That's why we have
 * to inline the whole event emitter implementation here.
 *
 * @param {Window} window
 */
export function installHook(window) {
    let listeners = {}

    const hook = {
        Angular: null,

        on(event, fn) {
            event = '$' + event
            ; (listeners[event] || (listeners[event] = [])).push(fn)
        },

        once(event, fn) {
            event = '$' + event
            function on() {
                this.off(event, on)
                fn.apply(this, arguments)
            }
            ; (listeners[event] || (listeners[event] = [])).push(on)
        },

        off(event, fn) {
            event = '$' + event
            if(!arguments.length){
                listeners = {}
            } else {
                const cbs = listeners[event]

                if (cbs) {
                    if(!fn) {
                        listeners[event] = null
                    } else {
                        for(let i = 0, l = cbs.length; i < l; i++){
                            const cb = cbs[i]
                            if(cb === fn || cb.fn === fn){
                                cbs.splice(i, 1)
                                break
                            }
                        }
                    }
                }
            }
        },

        emit (event) {
            event = '$' + event
            let cbs = listeners[event]

            if (cbs) {
                // get args without event name
                const args = [].slice.call(arguments, 1)

                // copy callbacks
                cbs = cbs.slice() 

                for (let i = 0, l = cbs.length; i < l; i ++) {
                    cbs[i].apply(this, args)
                }
            }
        }
    }

    hook.once('init', Angular => {
        hook.Angular = Angular

        console.log(hook.Angular)
    })

    Object.defineProperty(window, '__NG_DEVTOOLS_GLOBAL_HOOK__', {
        get () {
            return hook
        }
    })
}