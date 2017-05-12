import * as angular from 'angular'

import counter from './Counter.ng'
import events from './Events.ng'

angular.module('app.count', [])
.components({ counter, events })
.value('counter', { total: 54 });


angular.module('app', ['app.count'])
.info({version: angular.version })
.constant('APP_NAME', 'Angular DevTools')
.constant('APP_VERSION', '0.0.1')

angular.bootstrap(document.body, ['app'])
