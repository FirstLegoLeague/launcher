'use strict'

exports.SettingsAdapter = class {
  constructor (configurator) {
    this.configurator = configurator
  }

  getModulesNames () {
    return Object.keys(this.configMetadata)
  }
}
