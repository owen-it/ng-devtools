
export default {
    module: 'modules',
    state: {
        filter: '',
        selected: null,
        inspectedInstance: {},
        inspectedIndex: 0,
        instances: []
    },
    handlers: {
        'FLUSH': 'flush',
        'INSPECT': 'inspect',
        'UPDATE_FILTER': 'filter',
        'INSPECT': 'inspect'
    },
    actions: {
        flush (payload) 
        {
            this.state.set(['modules', 'instances'], payload.instances)
            this.state.set(['modules', 'inspectedIndex'], 0)
        },
        inspect (payload) 
        {
            this.state.set(['modules', 'inspectedIndex'], payload)
        },
        filter (payload) 
        {
            this.state.set(['modules', 'filter'], payload)
            
        }
    },
    getters: {
        get modules () {
            return this.state.get('modules')
        },
        get filteredModules () {
            var modules = this.state.get('modules')

            // filter modules
            var filtered = modules.instances.filter(
                mod => mod.name.indexOf(
                    modules.filter
                ) > -1
            )

            // define selected module
            this.state.set(
                ['modules', 'inspectedIndex'], 
                modules.instances.indexOf(filtered[0])
            )

            return filtered
        },
        get inspectedModule () {
            var index = this.state.get('modules').inspectedIndex

            return this.state.get('modules').instances[index]
        }
    }
}