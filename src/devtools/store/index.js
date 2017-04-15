import angular from 'angular'
import flux from 'flux'

import store from './store'

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