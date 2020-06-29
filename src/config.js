require('dotenv').config()
// eslint-disable-next-line import/no-commonjs
const config = require('config')

console.log('config', JSON.stringify(config, null, 2))

export default config
