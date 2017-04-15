import { mapState, mapHandlers , mapActions, mapGetters } from '@/helpers'

import events from 'views/events/store'

export default {
    state: {
        message: '',
        tab: 'modules',
        events: events.state
    },
    handlers: {
        'SHOW_MESSAGE': 'showMessage',

        ...mapHandlers(events)
    },
    actions: {
        showMessage (payload) {
            this.state.set(['message'], payload.message)
        },

        ...mapActions(events)
    },
    getters: Object.assign({}, {
        get message() {
            return this.state.get('message')
        },
        get events () {
            return this.state.get('events')
        }
    })
        
}
