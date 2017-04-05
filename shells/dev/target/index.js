import * as angular from 'angular'
import counter from './Counter.ng'

angular.module('app', []).components({ counter })

angular.bootstrap(document.body, ['app'])