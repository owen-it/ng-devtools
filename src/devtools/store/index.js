import angular from 'angular'
import flux from 'flux'

import storage from '@/storage'
import events from 'views/events/store'
import store from './store'

import { mapGetters } from '@/helpers'

const ENABLED_KEY = 'EVENTS_ENABLED'
const enabled = storage.get(ENABLED_KEY)

console.log(store)

angular.module('store', ['flux'])

.store('store', function(){
    return {
        initialize: function(){
            this.state = this.immutable({
                ...store.state
            })
        },
        handlers: { ...store.handlers },

        exports: store.getters,

        ...store.actions
    }
})

export default 'store'