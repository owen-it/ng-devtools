import CircularJSON from 'circular-json-es6'

export function stringify (data) {
    return CircularJSON.stringify(data, replacer)
}

const UNDEFINED = '__ng_devtools_undefined__'
const INFINITY = '__ng_devtools_infinity__'

function replacer (key, val) {
    if (val === undefined) {
        return UNDEFINED
    } else if (val === Infinity) {
        return INFINITY
    } else {
        return sanitize(val)
    }
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

function isPlainObject (obg) {
    return Object.prototype.toString.call(obj) === '[Object Object]'
}