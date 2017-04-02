import { EventEmitter } from 'events'

export default class Bridge extends EventEmitter 
{
    constructor(wall)
    {
        super()
        this.setMaxListeners(Infinity)
        this.wall = wall
        wall.listen( message => {
            if(typeof message === 'string'){
                this.emit(message)
            } else {
                this.emit(message.event, message.payload)
            }
        })
    }

    /**
     * Send an event
     * 
     * @param {string} event 
     * @param {*} payload 
     */
    send(event, payload)
    {
        this.wall.send({
            event, 
            payload
        })
    }

    /**
     * Log a message
     * 
     * @param {string} message 
     */
    log(message)
    {
        this.send('log', message)
    }
}