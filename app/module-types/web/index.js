'use strict'

const { caddy } = require('./caddy')

exports.WebModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath
    this.index = description.index
  }

  start (options) {
    return caddy.addSite({
      port: options.port,
      root: this.path
    })
      .then(() => caddy.start())
  }
}
