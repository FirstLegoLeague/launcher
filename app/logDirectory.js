const fs = require('fs')
const {join} = require('path')

const logPath = join(__dirname, '..', 'log')

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

module.exports = logPath
