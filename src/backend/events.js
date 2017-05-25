import { stringify } from '../util'
import { getInstanceName } from './index'

const privateRE = /^\$(.*)/

export function initEventsBackend (Angular, bridge)
{
    let recording = true
    let privateEnabled = false

    bridge.on('events:toggle-recording', enabled => {
        recording = enabled
    })

    bridge.on('events:toggle-private', privateEnabled => {
        privateEnabled = privateEnabled
    })
    
    // wrap event
    function wrapEvent ($scope, type, eventName, payload) 
    {
        if( typeof eventName === 'string' )
        {
            if (recording && ((privateRE.test(eventName) && privateEnabled) || !privateRE.test(eventName))) {
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