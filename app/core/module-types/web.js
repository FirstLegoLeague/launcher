'use strict'

exports.WebModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath
    this.index = description.index
  }

  start (options, { caddy }) {
    return caddy.addSite({
      port: options.port,
      root: this.path
    })
  }
}
