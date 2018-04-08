'use strict'

const Promise = require('bluebird')
const fs = require('fs')

const { loadModules } = require('./module-loader')
const { loadLogsOptions } = require('./logs')

Promise.promisifyAll(fs)

exports.Server = class {
  constructor (modulesFile) {
    this.modulesPromise = loadModules()
  }

  start () {
    return loadLogsOptions()
      .then(logsOptions => this.modulesPromise
        .map(module => module.start(logsOptions))
      )
      .then(stopFunctions => { this.stopFunctionsPromise = Promise.resolve(stopFunctions) })
  }

  close () {
    return this.stopFunctionsPromise
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
