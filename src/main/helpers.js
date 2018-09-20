
const os = require('os')

exports.getIp = networkInterface => {
  const networkInterfaces = os.networkInterfaces()

  return networkInterfaces[networkInterface || Object.keys(networkInterfaces)[0]]
    .sort(i => i.family)[0].address
}
