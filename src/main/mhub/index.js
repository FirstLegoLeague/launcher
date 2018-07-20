'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')
const randomatic = require('randomatic')
const { MClient } = require('mhub')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)

const mkdirpAsync = Promise.promisify(mkdirp)

const MHUB_CONNECTION_STRING = 'ws://localhost:13900'
// const MHUB_NODE_NAME = 'default'
const MHUB_EXECUTABLE_PATH = path.resolve('./internals/mhub/bin/mhub-server')
const MHUB_FILE_TEMPLATE = path.join(__static, 'mhub-config.ejs')
const MHUB_FILE_PATH = path.resolve('./tmp/$mhub.config.json')

function generateConfigFileContent (configFile, options) {
  return mkdirpAsync(path.dirname(configFile))
    .then(() => ejs.renderFileAsync(MHUB_FILE_TEMPLATE, options))
    .then(content => fs.writeFileAsync(configFile, content))
}

class Mhub {
  constructor (serviceManager, logStream, options) {
    this.mhubScript = MHUB_EXECUTABLE_PATH
    this.configFile = MHUB_FILE_PATH
    this.serviceManager = serviceManager
    this.logStream = logStream
    this.options = Object.assign(options, {
      launcherPassword: randomatic('Aa', 12)
    })

    this.client = new MClient(MHUB_CONNECTION_STRING, {
      noImplicitConnect: true,
      timeout: 500
    })
  }

  start () {
    return this.serviceManager.startService({
      init: () => generateConfigFileContent(this.configFile, this.options),
      serviceName: 'mhub',
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
      .delay(1000)
      .then(() => this.connect())
  }

  connect () {
    return Promise.resolve(this.client.connect())
      .then(() => this.client.login('launcher', this.options.launcherPassword))
  }

  publish (nodeName, topic, message, headers) {
    return Promise.resolve(this.client.publish(nodeName, topic, message, headers))
      .tap(() => console.log(`Mhub message published on topic ${topic}`))
  }

  stop () {
    return Promise.resolve(this.client.close())
      .then(() => this.serviceManager.stopService(this.serviceId))
  }
}

exports.Mhub = Mhub
