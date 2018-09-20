'use strict'

const os = require('os')

const { getIp } = require('./helpers')

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
          .map(([name, entries]) => ({ [name]: `${name} (${getIp(name)})` }))
          .reduce((obj, entry) => Object.assign(obj, entry), {})
      }
    ]
  }]
}
