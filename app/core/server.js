'use strict'

const fs = require('fs')
const Promise = require('bluebird')

const { Caddy } = require('./caddy')
const { loadModules } = require('./module-loader')
const { loadLogsOptions } = require('./logs')

Promise.promisifyAll(fs)

const STARTING_PORT = 1300

exports.Server = class {
  constructor (modulesFile) {
    this.modulesPromise = loadModules()
    this.caddy = new Caddy()
  }

  start () {
    return loadLogsOptions()
      .then(logsOptions => this.modulesPromise
        .map((module, i) => module.start(Object.assign({
          port: STARTING_PORT + i
        }, logsOptions), {
          caddy: this.caddy
        }))
      )
      .then(stopFunctions => { this.modulesStopFunctionsPromise = Promise.resolve(stopFunctions) })
  }

  close () {
    return this.modulesStopFunctionsPromise
      .each(stop => {
        stop()
      })
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
