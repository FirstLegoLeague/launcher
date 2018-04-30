'use strict'

const Promise = require('bluebird')

exports.SettingsAdapter = class {
  constructor (configurator) {
    this.configurator = configurator
  }

  getModulesNames (callback) {
    return this.configurator.getConfigMetadata()
      .then(Object.keys)
      .asCallback(callback)
  }

  getModuleConfig (moduleName, callback) {
    return this.configurator.getConfigMetadata()
      .get(moduleName)
      .asCallback(callback)
  }

  getModuleValues (moduleName, callback) {
    return this.configurator.getFields(moduleName)
      .asCallback(callback)
  }

  saveValues (moduleName, values, callback) {
    return Promise.resolve()
      .then(() => this.configurator.setFields(moduleName, values))
      .asCallback(callback)
  }
}
