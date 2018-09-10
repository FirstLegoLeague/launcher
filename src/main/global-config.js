'use strict'

const os = require('os')

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
        values: Object.keys(os.networkInterfaces()),
        texts: Object.entries(os.networkInterfaces())
          .map(([name, entries]) => ({ name, address: entries.find(networkInterfaceEntry => networkInterfaceEntry.family === 'IPv4').address }))
          .reduce((obj, { name, address }) => Object.assign(obj, { [name]: `${name} (${address})` }), {})
      }
    ]
  }]
}
