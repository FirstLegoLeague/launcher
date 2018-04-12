'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const Promise = require('bluebird')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)

const MHUB_EXECUTABLE_PATH = path.resolve('./internals/mhub/bin/mhub-server')
const MHUB_FILE_TEMPLATE = path.join(__dirname, 'mhub-config.ejs')
const MHUB_FILE_PATH = path.resolve('./tmp/$mhub.config.json')

function generateCaddyFileContent (configFile) {
  return ejs.renderFileAsync(MHUB_FILE_TEMPLATE, {})
    .then(content => fs.writeFileAsync(configFile, content))
}

class Mhub {
  constructor (serviceManager, logStream) {
    this.mhubScript = MHUB_EXECUTABLE_PATH
    this.configFile = MHUB_FILE_PATH
    this.serviceManager = serviceManager
    this.logStream = logStream
  }

  start () {
    return this.serviceManager.startService({
      init: () => generateCaddyFileContent(this.configFile, this.sites),
      serviceId: this.serviceId,
      logStream: this.logStream,
      executable: process.execPath,
      arguments: [this.mhubScript, '-c', this.configFile],
      env: {
        'ELECTRON_RUN_AS_NODE': '1'
      }
    })
      .then(serviceId => {
        this.serviceId = serviceId
      })
  }

  stop () {
    return this.serviceManager.stopService(this.serviceId)
  }
}

exports.Mhub = Mhub
