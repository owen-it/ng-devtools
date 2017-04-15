import storage from '@/storage'

export default {
    module: 'events',
    state: {
        enabled: false,
        newEventCount: 0,

    },
    handlers: {
        'TOGGLE': 'eventsToggle',
        'INCREASE_NEW_EVENT_COUNT': 'eventsIncreaseCount'
    },
    actions: {
        eventsToggle () 
        {
            storage.set(ENABLED_KEY, this.state.events = !this.state.events)

            this.state.set(['events', 'enabled'], this.state.events)
        },

        eventsIncreaseCount ()
        {
            var newEventCount = this.state.get('events').newEventCount

            this.state.set(['events', 'newEventCount'], ++newEventCount )
        }
    },
    getters: {
        get events() {
            return this.state.get('events')
        },
        get filteredEvents () {
            return []
        }
    }
}