

export const mapState = function (store) {
    return store.states
}

export const mapHandlers = function (store) 
{
    var handlers = {}
    Object.keys(store.handlers).forEach(
        (handler) => {
            handlers[`${store.module}/${handler}`] = store.handlers[handler]
        }
    )

    return handlers
}

export const mapActions =  function (store) {
    return store.actions
}

export const mapExports = function (store) {
    return store.exports
}

export const mapGetters = function(store){
    var getters = {}

    console.log(store)

    Object.keys(store.getters).forEach(
        (key) => {
            Object.defineProperty(getters, key, {
                get: () => store.getters[key],
                enumerable: true
            })
        }
    )

    console.log('getters => ', getters)

    return getters

}