// because it is shared with all shells
const resolve = require('path').resolve

module.exports = {
    src: resolve(__dirname, '../scr'),
    views: resolve(__dirname, '../src/devtolls/views'),
    components: resolve(__dirname, '../src/devtools/components')
}