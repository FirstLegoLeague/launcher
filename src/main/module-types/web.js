'use strict'

const Promise = require('bluebird')

const { immutableObject } = require('./helpers')

const { $ } = require('../caddy/templates')

function createEnvironment (portsAllocations) {
  return Object.entries(portsAllocations)
    .map(([module, port]) => ({ [module]: $`http://${$.host}:${port}` }))
    .reduce((object, keyValue) => Object.assign(object, keyValue), {})
}

exports.WebModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath
    this.index = description.index

    this.config = immutableObject(description.config || [])

    Object.freeze(this)
  }

  start (options, { caddy, portsAllocations }) {
    return caddy.addSite({
      port: options.port,
      root: this.path,
      env: createEnvironment(portsAllocations)
    })
      .return(() => Promise.resolve())
  }
}
