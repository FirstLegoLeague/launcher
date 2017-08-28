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
    this.stopFunctionPromise = this.modulesPromise
      .map(module => module.start())
  }

  close () {
    return this.stopFunctionPromise
      .each(stop => stop())
  }
}
