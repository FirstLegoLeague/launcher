'use strict'

const fs = require('fs')
const Promise = require('bluebird')

const { Mhub } = require('./mhub')
const { Caddy } = require('./caddy')
const { Mongo } = require('./mongo')
const { loadModules } = require('./module-loader')
const { loadLogsOptions, createLogStream } = require('./logs')
const { ServiceManager } = require('./services')
const { Configurator } = require('./configurator')

Promise.promisifyAll(fs)

const STARTING_PORT = 1300

exports.Server = class {
  constructor (modulesFile) {
    this.modulesPromise = loadModules()
    this.mainLogStream = createLogStream('main')
    this.serviceManager = new ServiceManager()
    this.configurator = new Configurator()

    this.modulesPromise.map(module => this.configurator.addModule(module))

    this.mhub = new Mhub(this.serviceManager, createLogStream('mhub'))
    this.caddy = new Caddy(this.serviceManager, createLogStream('caddy'))
    this.mongo = new Mongo(this.serviceManager, createLogStream('mongo'))

    this.modulesStopFunctionsPromise = Promise.resolve([])
  }

  start () {
    return Promise.resolve()
      .then(() => this.mhub.start())
      .then(() => this.configurator.start())
      .then(() => this.mongo.start())
      .then(() => loadLogsOptions())
      .then(logsOptions => this.modulesPromise
        .map((module, i) => module.start(Object.assign({
          port: STARTING_PORT + i,
          logStream: this.mainLogStream
        }, logsOptions), {
          mhub: this.mhub,
          caddy: this.caddy,
          mongo: this.mongo,
          serviceManager: this.serviceManager
        }))
      )
      .then(stopFunctions => { this.modulesStopFunctionsPromise = Promise.resolve(stopFunctions) })
      .then(() => this.caddy.start())
  }

  close () {
    return this.modulesStopFunctionsPromise
      .map(stop => {
        stop()
      })
      .then(() => this.caddy.stop())
      .then(() => this.mongo.stop())
  }

  getModules () {
    return this.modulesPromise
  }

  resetData () {
    this.getModules()
      .then(modules =>
        Promise.all(modules.map(module => module.reset()))
      )
      .catch(() => {
        console.error('Failed to reset modules data')
      })
  }
}
