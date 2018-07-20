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
        default: 'info',
        values: ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
      },
      {
        name: 'netConnection',
        display: 'Network Connection',
        type: 'values',
        values: Object.keys(os.networkInterfaces())
      }
    ]
  }]
}
