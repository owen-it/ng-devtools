import storage from '@/storage'

const ENABLED_KEY = 'EVENTS_ENABLED'
let enabled = storage.get(ENABLED_KEY)

export default {
    module: 'events',
    state: {
        enabled: enabled,
        newEventCount: 0,
        inspectedIndex: -1,
        filter: '',
        list: []
    },
    handlers: {
        'TOGGLE': 'toggle',
        'INSPECT': 'inspect',
        'RESET': 'reset',
        'RECEIVE_EVENT': 'receive',
        'UPDATE_FILTER': 'filter',
        'INCREASE_NEW_EVENT_COUNT': 'increaseCount',
        'RESET_NEW_EVENT_COUNT': 'resetCount'
    },
    actions: {
        toggle () 
        {
            storage.set(
                ENABLED_KEY, 
                enabled = !enabled
            )

            this.state.set(['events', 'enabled'], enabled)

            bridge.send('events:toggle-recording', enabled)
        },

        filter (payload) 
        {
            this.state.set(['events', 'filter'], payload)
        },

        reset ()
        {
            this.state.set(['events', 'list'], [])
            this.state.set(['events', 'inspectedIndex'], -1)
        },

        inspect (payload) 
        {
            this.state.set(['events', 'inspectedIndex'], payload)
        },

        receive (payload) 
        {
            this.state.push(['events', 'list'], payload)

            var events = this.state.get('events')
            if (!events.filter) {
                this.state.set(['events', 'inspectedIndex'], events.list.length -1)
            }
        },

        increaseCount ()
        {
            var newEventCount = this.state.get('events').newEventCount

            this.state.set(['events', 'newEventCount'], ++newEventCount )
        },

        resetCount () 
        {
            this.state.set(['events', 'newEventCount'], 0 )
        }
    },
    getters: {
        get events () {
            return this.state.get('events')
        },
        get filteredEvents () {
            var events = this.state.get('events')

            // filter events
            return events.list.filter(
                e => e.eventName.indexOf(
                    events.filter
                ) > -1
            )
        },
        get inspectEvent () {
            var index = this.state.get('events').inspectedIndex

            return this.state.get('events').list[index]
        }
    }
}