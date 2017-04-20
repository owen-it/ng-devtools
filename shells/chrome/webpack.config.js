var path = require('path')
var webpack = require('webpack')
var alias = require('../alias')

var bubleOptions = {
    target: process.env.NODE_ENV === 'production' ? null : { chrome: 52 },
    objectAssign: 'Object.assign'
}

module.exports = {
    entry: {
        hook: './src/hook.js'
    }
}