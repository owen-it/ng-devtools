import { mapState, mapHandlers , mapActions, mergeGetters } from '@/helpers'

import events  from 'views/events/store'
import modules from 'views/modules/store'

export default {
    state: {
        message: '', // top message
        tab: 'modules', // default tab

        events: events.state,
        modules: modules.state
    },
    handlers: {
        'SHOW_MESSAGE': 'showMessage',
        'SWITCH_TAB': 'swithTab',

        ...mapHandlers('events', events.handlers),
        ...mapHandlers('modules', modules.handlers)
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

        ...mapActions('events', events.actions),
        ...mapActions('modules', modules.actions)
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

        events.getters,
        modules.getters
        
    )
        
}
