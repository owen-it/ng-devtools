
export default {
    module: 'modules',
    state: {
        selected: null,
        inspectedInstance: {},
        instances: []
    },
    handlers: {
        'FLUSH': 'flush'
    },
    actions: {
        flush (payload) {
            console.log('modules/FLUSH', payload)
        }
    }
}