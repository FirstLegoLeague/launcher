
const os = require('os')

const { logger } = require('./logs')

const LOCALHOST_IP = '127.0.0.1'

const networkInterfaces = Object.entries(os.networkInterfaces())
  .map(([name, interfaces]) => [name, interfaces.filter(i => i.family === 'IPv4')])
  .filter(([name, interfaces]) => interfaces.length)
  .map(([name, interfaces]) => ({ [name]: interfaces }))
  .reduce((obj, entry) => Object.assign(obj, entry), {})

if (Object.keys(networkInterfaces).length === 0) {
  logger.warn('Offline Mode!!!')
  networkInterfaces.Loopback = [{ address: LOCALHOST_IP }]
}

exports.networkInterfacesNames = () => Object.keys(networkInterfaces)

exports.getIp = networkInterfaceName => {
  if (networkInterfaces[networkInterfaceName]) {
    return networkInterfaces[networkInterfaceName][0].address
  } else {
    throw new Error(`Unknown Network Interface: ${networkInterfaceName}`)
  }
}
