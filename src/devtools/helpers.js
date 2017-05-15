

export const mapState = function (store) {
    return store.states
}

export const mapHandlers = function (namespace, handlers) 
{
    var _handlers = {}
    Object.keys(handlers).forEach(
        (handler) => {
            _handlers[`${namespace}/${handler}`] = `${namespace}_${handlers[handler]}`
        }
    )

    return _handlers
}

export const mapActions =  function (namespace, actions) 
{
    var _actions = {}
    Object.keys(actions).forEach(
        (action) => {
            _actions[`${namespace}_${action}`] = actions[action]
        }
    )

    return _actions
}

export const mapGetters = function(store){
    var getters = {}

    Object.keys(store.getters).forEach(
        (key) => {
            Object.defineProperty(getters, key, {
                get: () => store.getters[key],
                enumerable: true
            })
        }
    )

    return getters

}

export const mergeGetters = function (...args) {
    // get destination
    var dest = args[0]

    // get getters
    var getters = [].slice.call(args, 1)

    getters.forEach(function(getter)
    {
        Object.getOwnPropertyNames(getter).forEach( key =>  {
            // Copy descriptor
            var descriptor = Object.getOwnPropertyDescriptor(getter, key)
            Object.defineProperty(dest, key, descriptor)
        })
    })

    return dest

}