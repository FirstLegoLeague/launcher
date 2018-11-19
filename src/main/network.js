
const os = require('os')

const { logger } = require('./logs')

const networkInterfaces = Object.entries(os.networkInterfaces())
  .map(([name, interfaces]) => [name, interfaces.filter(i => i.family === 'IPv4')])
  .filter(([name, interfaces]) => interfaces.length)
  .map(([name, interfaces]) => ({ [name]: interfaces }))
  .reduce((obj, entry) => Object.assign(obj, entry), {})

logger.debug(os.networkInterfaces())
logger.debug(networkInterfaces)

exports.networkInterfaces = () => networkInterfaces

exports.getIp = networkInterface => {
  networkInterface = networkInterface || Object.keys(networkInterfaces)[0]

  return networkInterfaces[networkInterface][0].address
}
