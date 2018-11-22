
const os = require('os')

const { logger } = require('./logs')

const networkInterfaces = Object.entries(os.networkInterfaces())
  .map(([name, interfaces]) => [name, interfaces.filter(i => i.family === 'IPv4')])
  .filter(([name, interfaces]) => interfaces.length)
  .map(([name, interfaces]) => ({ [name]: interfaces }))
  .reduce((obj, entry) => Object.assign(obj, entry), {})

exports.networkInterfaces = () => networkInterfaces

exports.getIp = networkInterface => {
  networkInterface = networkInterface || Object.keys(networkInterfaces)[0]

  logger.info(`Network interfaces: ${networkInterfaces} Active: ${networkInterfaces[networkInterface]}`)

  if (networkInterfaces[networkInterface]) {
    return networkInterfaces[networkInterface][0].address
  } else {
    logger.warn('Running in offline mode')
    return '127.0.0.1'
  }
}
