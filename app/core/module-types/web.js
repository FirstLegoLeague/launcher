'use strict'

const { immutableObject } = require('./helpers')

exports.WebModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath
    this.index = description.index

    this.config = immutableObject(description.config || [])

    Object.freeze(this)
  }

  start (options, { caddy }) {
    return caddy.addSite({
      port: options.port,
      root: this.path
    })
      .return(() => {})
  }
}
