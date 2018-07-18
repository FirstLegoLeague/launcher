'use strict'

const Promise = require('bluebird')

exports.SettingsAdapter = class {
  constructor (moduleConfigurator, globalConfigurator) {
    this.configurator = moduleConfigurator
    this.globalConfigurator = globalConfigurator

    this.globalModulePromise =
      globalConfigurator.getConfigMetadata().then(Object.keys).get(0)
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

  getGlobalConfig (callback) {
    return this.globalModulePromise
      .then(module => this.globalConfigurator.getConfigMetadata().get(module))
      .asCallback(callback)
  }

  getGlobalConfigValues (callback) {
    return this.globalModulePromise
      .then(module => this.globalConfigurator.getFields(module))
      .asCallback(callback)
  }

  saveGlobalValues (values, callback) {
    return this.globalModulePromise
      .then(module => this.globalConfigurator.setFields(module, values))
      .asCallback(callback)
  }

  saveValues (moduleName, values, callback) {
    return Promise.resolve()
      .then(() => this.configurator.setFields(moduleName, values))
      .asCallback(callback)
  }
}
