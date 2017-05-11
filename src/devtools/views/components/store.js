
export default {
    module: 'components',
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

        }
    }
}