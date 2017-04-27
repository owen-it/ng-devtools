import { stringify } from '../util'
import { getInstanceName } from './index'

const internalRE = /^(?:pre-)?hook:/

export function initEventsBackend (Angular, bridge)
{
    let recording = true

    bridge.on('events:toggle-recording', enabled => {
        recording = enabled
    })
    
    // wrap event
    function wrapEvent ($scope, type, eventName, payload) 
    {
        if(typeof eventName === 'string' && !internalRE.test(eventName)) {
            if (recording) {
                bridge.send('event:triggered', stringify({
                    eventName,
                    type,
                    payload,
                    componentName: ($scope.$ctrl || $scope).constructor.name || null,
                    timestamp: Date.now()
                }))
            }
        }
    }

    Angular.$wrapEvent = wrapEvent

}