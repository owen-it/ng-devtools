// because it is shared with all shells
const resolve = require('path').resolve

module.exports = {
    '@': resolve(__dirname, '../src/devtools'),
    src: resolve(__dirname, '../src'),
    views: resolve(__dirname, '../src/devtools/views'),
    components: resolve(__dirname, '../src/devtools/components')
}