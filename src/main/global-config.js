'use strict'

const { getIp, networkInterfaces } = require('./network')

exports.globalModuleConfig = {
  name: '$global',
  config: [{
    fields: [
      {
        name: 'logLevel',
        display: 'Log Level',
        type: 'values',
        default: 'INFO',
        values: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
      },
      {
        name: 'netConnection',
        display: 'Network Connection',
        type: 'values',
        values: Object.keys(networkInterfaces()),
        texts: Object.entries(networkInterfaces())
          .map(([name, entries]) => ({ [name]: `${name} (${getIp(name)})` }))
          .reduce((obj, entry) => Object.assign(obj, entry), {})
      }
    ]
  }]
}
