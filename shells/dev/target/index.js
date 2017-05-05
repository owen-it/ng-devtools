import * as angular from 'angular'
import './bootstrap'

import counter from './Counter.ng'
import events from './Events.ng'

angular.module('app.count', []).components({ counter, events });
angular.module('app', ['app.count'])
angular.bootstrap(document.body, ['app'])
