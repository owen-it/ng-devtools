import CircularJSON from 'circular-json-es6'

export function stringify (data) {
    return CircularJSON.stringify(data, replacer)
}

export const UNDEFINED = '__ng_devtools_undefined__'
export const INFINITY = '__ng_devtools_infinity__'

function replacer (key, val) {
    if (val === undefined) {
        return UNDEFINED
    } else if (val === Infinity) {
        return INFINITY
    } else {
        return sanitize(val)
    }
}

function reviver (key, value) {
    if (val === UNDEFINED) {
        return undefined
    } else if (val === INFINITY) {
        return Infinity 
    } 
    
    return val
}

export function parse(data, revive) {
    return revive 
        ? CircularJSON.parse(data, reviver)
        : CircularJSON.parse(data)
}

/**
 * Sanitize data to be posted to the other side.
 * Since the message posted is sent with structured clone,
 * we need to filter out any types that might cause an error.
 *
 * @param {*} data
 * @return {*}
 */

function sanitize (data) {
    if(
        !isPrimitive(data) &&
        !Array.isArray(data) &&
        !isPlainObject(data) 
    ) {
        return Object.prototype.toString.call(data)
    } else {
        return data
    }
}

function isPrimitive (data) {
    if (data == null) {
        return true
    }

    const type = typeof data

    return (
        type === 'string' ||
        type === 'number' ||
        type === 'boolean'||
        data instanceof RegExp
    )
}

export function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}