
const os = require('os')

const networkInterfaces = Object.entries(os.networkInterfaces())
  .map(([name, interfaces]) => [name, interfaces.filter(i => i.family === 'IPv4')])
  .filter(([name, interfaces]) => interfaces.length)
  .map(([name, interfaces]) => ({ [name]: interfaces }))
  .reduce((obj, entry) => Object.assign(obj, entry), {})

exports.networkInterfaces = () => networkInterfaces

exports.getIp = networkInterface => {
  networkInterface = networkInterfaces[networkInterface] ? networkInterface : Object.keys(networkInterfaces)[0]
  if (!networkInterface) {
    return '127.0.0.1'
  }
  return networkInterfaces[networkInterface][0].address
}
