'use strict'

// eslint-disable-next-line node/no-deprecated-api
const Domain = require('domain')

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')
const randomatic = require('randomatic')
const { MClient } = require('mhub')

const { logger } = require('../logs')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)

const mkdirpAsync = Promise.promisify(mkdirp)

const MHUB_CONNECTION_STRING = 'ws://127.0.0.1:13900'
// const MHUB_NODE_NAME = 'default'
const MHUB_EXECUTABLE_PATH = path.resolve('./internals/mhub/bin/mhub-server')
const MHUB_FILE_TEMPLATE = path.join(__static, 'mhub-config.ejs')
const MHUB_FILE_PATH = path.resolve('./tmp/$mhub.config.json')

const MAX_RETRIES = 5

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
      .then(() => this.connect())
  }

  connect () {
    const client = new MClient(MHUB_CONNECTION_STRING, {
      noImplicitConnect: true,
      timeout: 500
    })

    this.client = client

    function _connect (retry = 0) {
      return Promise.resolve(client.connect())
        .catch(err => {
          if (err.code === 'ECONNREFUSED' && retry < MAX_RETRIES) {
            return Promise.delay(500 * 2 ** retry)
              .then(() => _connect(retry + 1))
          } else {
            throw err
          }
        })
    }

    const domain = Domain.create()

    domain.add(client)

    domain.on('error', err => {
      if (err.code !== 'ECONNREFUSED') {
        domain.exit()
        throw err
      }
    })

    return domain.run(() => _connect())
      .then(() => this.client.login('launcher', this.options.launcherPassword))
  }

  publish (nodeName, topic, message, headers) {
    return Promise.resolve(this.client.publish(nodeName, topic, message, headers))
      .tap(() => logger.info(`Mhub message published on topic ${topic}`))
  }

  stop () {
    return Promise.resolve(this.client.close())
      .then(() => this.serviceManager.stopService(this.serviceId))
  }

  url (ip) {
    if (ip) {
      return `ws://${ip}:13900`
    }
    return MHUB_CONNECTION_STRING
  }
}

exports.Mhub = Mhub
