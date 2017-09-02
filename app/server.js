'use strict'

const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const { moduleFactory } = require('./module-types')

Promise.promisifyAll(fs)

exports.Server = class {
  constructor (modulesFile) {
    this.modulesPromise = fs.readFileAsync(modulesFile)
      .then(yaml.safeLoad)
      .then(modules => {
        return Object.keys(modules)
          .map(name => moduleFactory(name, path.join(process.cwd(), 'modules', name), modules[name]))
      })
  }

  start () {
    this.stopFunctionsPromise = this.modulesPromise
      .map(module => module.start())

    return this.stopFunctionsPromise
      .return()
  }

  close () {
    return this.stopFunctionsPromise
      .each(stop => stop())
  }

  getModules () {
    return this.modulesPromise
  }
}
