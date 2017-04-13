import { stringify } from '../util'
import { getInstanceName } from './index'

const internalRE = /^(?:pre-)?hook:/

export function initEventsBackend (Angular, bridge)
{
    let recording = true

    bridge.on('events:toggle-recording', enabled => {
        recording = enabled
    })

    bridge.on('event:triggered', function(){
        console.log(arguments)
    })

    function logEvent ($scope, type, eventName, payload) 
    {
        if(typeof eventName === 'string' && !internalRE.test(eventName)) {
            bridge.send('event:triggered', stringify({
                eventName,
                type,
                payload,
                timestamp: Date.now()
            }))
        }
    }

    Angular.$logEvent = logEvent

}