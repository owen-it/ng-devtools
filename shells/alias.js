// because it is shared with all shells
const resolve = require('path').resolve

module.exports = {
    src: resolve(__dirname, '../src'),
    views: resolve(__dirname, '../src/devtolls/views'),
    components: resolve(__dirname, '../src/devtools/components')
}