
const os = require('os')

const { logger } = require('./logs')

const networkInterfaces = Object.entries(os.networkInterfaces())
  .map(([name, interfaces]) => [name, interfaces.filter(i => i.family === 'IPv4')])
  .filter(([name, interfaces]) => interfaces.length)
  .map(([name, interfaces]) => ({ [name]: interfaces }))
  .reduce((obj, entry) => Object.assign(obj, entry), {})

let warnedForOfflineMode = false

exports.networkInterfaces = () => networkInterfaces

exports.getIp = networkInterface => {
  networkInterface = networkInterface || Object.keys(networkInterfaces)[0]

  if (networkInterfaces[networkInterface]) {
    return networkInterfaces[networkInterface][0].address
  } else {
    if (!warnedForOfflineMode) {
      logger.warn(os.networkInterfaces())
      logger.warn(networkInterfaces)
      logger.warn('Running in offline mode')
      warnedForOfflineMode = true
    }
    return '127.0.0.1'
  }
}
