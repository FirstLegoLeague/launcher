'use strict'

const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const randomatic = require('randomatic')

const { Mhub } = require('./mhub')
const { Caddy } = require('./caddy')
const { Mongo } = require('./mongo')
const { getIp } = require('./helpers')
const { loadModules } = require('./module-loader')
const { loadLogsOptions, createLogStream } = require('./logs')
const { ServiceManager } = require('./services')
const { Configurator } = require('./configurator')
const { globalModuleConfig } = require('./global-config')

Promise.promisifyAll(fs)

const STARTING_PORT = 2828
const SECRET_LENGTH = 12
const DATA_DIR = path.resolve('./data/')

exports.Server = class {
  constructor (modulesFile) {
    this.modulesPromise = loadModules()
    this.mainLogStream = createLogStream('main')
    this.serviceManager = new ServiceManager()

    this.secret = randomatic('Aa', SECRET_LENGTH)
    this.protectedMhubPassword = randomatic('Aa', SECRET_LENGTH)
    const mhubOptions = { protectedPassword: this.protectedMhubPassword, configurationPassword: this.secret }
    this.mhub = new Mhub(this.serviceManager, createLogStream('mhub'), mhubOptions)
    this.caddy = new Caddy(this.serviceManager, createLogStream('caddy'))
    this.mongo = new Mongo(this.serviceManager, createLogStream('mongo'))

    this.moduleConfigurator = new Configurator()

    this.moduleConfigurator.on('new', ({ moduleName, fields }) => {
      return this.mhub.publish('configuration', `config:${moduleName}`, { fields })
    })

    this.modulesPromise
      .map(module => this.moduleConfigurator.addModule(module))
      .then(() => this.moduleConfigurator.seal())
      .catch(err => console.error(err))

    this.modulesStopFunctionsPromise = Promise.resolve([])

    this.globalConfigurator = new Configurator()

    this.globalConfigurator.addModule(globalModuleConfig)
      .then(() => this.globalConfigurator.seal())
      .catch(err => console.error(err))

    this.globalConfigurator.on('new', () => {
      this.restart()
        .catch(err => console.error(err))
    })
  }

  start () {
    return Promise.all([
      this.modulesPromise,
      loadLogsOptions(),
      this.getPortsAllocation(),
      this.globalConfigurator.getFields(globalModuleConfig.name),
      this.mhub.start()
        .then(() => this.moduleConfigurator.start()),
      this.mongo.start()
    ])
      .then(([modules, logsOptions, portsAllocations, globalConfig]) => modules
        .map((module, i) => module.start(Object.assign({
          port: portsAllocations[module.name],
          secret: this.secret,
          dataDir: DATA_DIR,
          protectedMhubPassword: this.protectedMhubPassword,
          logStream: this.mainLogStream,
          globalConfig
        }, logsOptions), {
          mhub: this.mhub,
          caddy: this.caddy,
          mongo: this.mongo,
          serviceManager: this.serviceManager,
          portsAllocations
        }))
      )
      .then(stopFunctions => { this.modulesStopFunctionsPromise = Promise.resolve(stopFunctions) })
      .then(() => this.caddy.start())
  }

  restart () {
    return this.close()
      .then(() => this.start())
  }

  close () {
    return this.modulesStopFunctionsPromise
      .map(stop => {
        return stop()
          .catch(err => console.error(err))
      })
      .then(() => [
        this.caddy.stop(),
        this.mongo.stop(),
        this.mhub.stop()
      ])
      .all()
  }

  getModules () {
    return this.modulesPromise
  }

  getIp () {
    return this.globalConfigurator.getFields(globalModuleConfig.name)
      .get('netConnection')
      .then(getIp)
  }

  getPortsAllocation () {
    return this.modulesPromise
      .then(modules => modules.map(m => m.name)
        .sort()
        .map((name, index) => ({ [name]: STARTING_PORT + index }))
        .reduce((object, keyValue) => Object.assign(object, keyValue), {})
      )
  }
}
