const fs = require('fs')
const {resolve} = require('path')

const logPath = resolve(__dirname, '..', 'log')

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

module.exports = logPath
