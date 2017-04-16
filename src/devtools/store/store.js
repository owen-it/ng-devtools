import { mapState, mapHandlers , mapActions, mergeGetters } from '@/helpers'

import events from 'views/events/store'

export default {
    state: {
        message: '',
        tab: 'events',
        events: events.state
    },
    handlers: {
        'SHOW_MESSAGE': 'showMessage',
        'SWITCH_TAB': 'swithTab',

        ...mapHandlers('events', events.handlers)
    },
    actions: {
        showMessage (payload) 
        {
            this.state.set(['message'], payload.message)
        },

        swithTab (payload) 
        {
            this.state.set(['tab'], payload)
        },

        ...mapActions(events.actions)
    },
    getters: mergeGetters(
        {
            get message() {
                return this.state.get('message')
            },

            get tab() {
                return this.state.get('tab')
            },

            get state () {
                return this.state.get()
            }
        }, 
        events.getters 
    )
        
}
