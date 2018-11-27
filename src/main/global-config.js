'use strict'

const { getIp, networkInterfacesNames } = require('./network')

exports.globalModuleConfig = {
  name: '$global',
  config: [{
    fields: [
      {
        name: 'netConnection',
        display: 'Network Connection',
        type: 'values',
        values: networkInterfacesNames(),
        texts: networkInterfacesNames()
          .map(name => ({ [name]: `${name} (${getIp(name)})` }))
          .reduce((obj, entry) => Object.assign(obj, entry), {}),
        default: networkInterfacesNames()[0]
      },
      {
        name: 'logLevel',
        display: 'Log Level',
        type: 'values',
        default: 'INFO',
        values: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
      }
    ]
  }]
}
