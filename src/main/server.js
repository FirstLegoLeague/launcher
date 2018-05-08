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

const STARTING_PORT = 2828

exports.Server = class {
  constructor (modulesFile) {
    this.modulesPromise = loadModules()
    this.mainLogStream = createLogStream('main')
    this.serviceManager = new ServiceManager()

    this.mhub = new Mhub(this.serviceManager, createLogStream('mhub'))
    this.caddy = new Caddy(this.serviceManager, createLogStream('caddy'))
    this.mongo = new Mongo(this.serviceManager, createLogStream('mongo'))

    this.configurator = new Configurator(this.mhub)

    this.modulesPromise
      .map(module => this.configurator.addModule(module))
      .then(() => this.configurator.seal())
      .catch(err => console.error(err))

    this.modulesStopFunctionsPromise = Promise.resolve([])
  }

  start () {
    return Promise.all([
      this.modulesPromise,
      loadLogsOptions(),
      this.getPortsAllocation(),
      this.mhub.start()
        .then(() => this.configurator.start()),
      this.mongo.start()
    ])
      .then(([modules, logsOptions, portsAllocations]) => modules
        .map((module, i) => module.start(Object.assign({
          port: portsAllocations[module.name],
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

  getPortsAllocation () {
    return this.modulesPromise
      .then(modules => modules.map(m => m.name)
        .sort()
        .map((name, index) => ({ [name]: STARTING_PORT + index }))
        .reduce((object, keyValue) => Object.assign(object, keyValue), {})
      )
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
