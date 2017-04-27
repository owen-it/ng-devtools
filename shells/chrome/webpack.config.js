var path = require('path')
var webpack = require('webpack')
var alias = require('../alias')

var bubleOptions = {
    target: process.env.NODE_ENV === 'production' ? null : { chrome: 52 },
    objectAssign: 'Object.assign'
}

module.exports = {
    entry: {
        hook: './src/hook.js',
        //devtools: './src/devtools.js',
        background: './src/background.js',
        bootstrap: './src/bootstrap.js',
        'devtools-background': './src/devtools-background.js',
        //backend: './src/backend.js',
        //proxy: './src/proxy.js',
        detector: './src/detector.js'
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].js'
    },
    resolve: { alias },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'buble-loader',
                exclude: /node_modules/,
                options: bubleOptions
            },
            {
                test: /\.ng$/,
                loader: 'ng-loader',
                options: {
                    preserveWhitespace: false,
                    buble: bubleOptions
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
    devtool: process.env.NODE_ENV !== 'production'
        ? '#inline-source-map' : false
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}