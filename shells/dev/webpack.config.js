var path = require('path')
var webpack = require('webpack')
var alias = require('../alias')
var FriendlyErrosPlugin = require('friendly-errors-webpack-plugin')

var bubleOptions = {
    target: { chrome: 52 },
    objectAssign: 'Object.assign'
}

module.exports = {
    entry: {
        devtools: './src/devtools.js',
        backend: './src/backend.js',
        hook: './src/hook.js',
        target: './target/index.js' 
    },
    output: {
        path: __dirname + '/build',
        publicPatch: '/build/',
        filename: '[name].js'
    },
    resolve: {
        alias: Object.assign({}, alias, {
            /* new alias */
        })
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader:  'buble-loader',
                exclude: /node_modules/,
                options: bubleOptions
            },
            {
                test: /\.ng$/,
                loader: 'ng-loader',
                options: {
                    preserveWhitespace: false
                }
            },
            {
                test: /\.(png|woff2)$/,
                loader: 'url-loader?limit=0'
            }
        ]
    },
    performance: {
        hints: false
    },
    devtool: '#cheap-module-eval-source-map',
    devserver: {
        quiet: true
    },
    plugins: [
        new FriendlyErrosPlugin()
    ]
}