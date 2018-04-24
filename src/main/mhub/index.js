'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const Promise = require('bluebird')
const { MClient } = require('mhub')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)

const MHUB_CONNECTION_STRING = 'ws://localhost:13900'
const MHUB_NODE_NAME = 'default'
const MHUB_EXECUTABLE_PATH = path.resolve('./internals/mhub/bin/mhub-server')
const MHUB_FILE_TEMPLATE = path.join(__dirname, 'mhub-config.ejs')
const MHUB_FILE_PATH = path.resolve('./tmp/$mhub.config.json')

function generateConfigFileContent (configFile) {
  return ejs.renderFileAsync(MHUB_FILE_TEMPLATE, {})
    .then(content => fs.writeFileAsync(configFile, content))
}

class Mhub {
  constructor (serviceManager, logStream) {
    this.mhubScript = MHUB_EXECUTABLE_PATH
    this.configFile = MHUB_FILE_PATH
    this.serviceManager = serviceManager
    this.logStream = logStream

    this.client = new MClient(MHUB_CONNECTION_STRING, {
      noImplicitConnect: true,
      timeout: 500
    })
  }

  start () {
    return this.serviceManager.startService({
      init: () => generateConfigFileContent(this.configFile, this.sites),
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
      .then(() => this.connect())
  }

  connect () {
    return Promise.resolve(this.client.connect())
  }

  publish (topic, message, headers) {
    return Promise.resolve(this.client.publish(MHUB_NODE_NAME, topic, message, headers))
      .tap(() => console.log(`Mhub message published on topic ${topic}`))
  }

  stop () {
    return this.serviceManager.stopService(this.serviceId)
  }
}

exports.Mhub = Mhub
