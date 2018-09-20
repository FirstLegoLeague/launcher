'use strict'

const camelCase = require('camelcase')

const { immutableObject } = require('./helpers')

const { getIp } = require('../helpers')

function createEnvironment (portsAllocations, globalConfig) {
  const ip = getIp(globalConfig.netConnection)

  const discoveryServices = Object.entries(portsAllocations)
    .map(([module, port]) => ({ [`module${camelCase(module, { pascalCase: true })}Url`]: `http://${ip}:${port}` }))
    .reduce((object, keyValue) => Object.assign(object, keyValue), {})

  return Object.assign(discoveryServices, {
    'mhubUri': `ws://${ip}:13900/`
  })
}

exports.WebModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath
    this.index = description.index

    this.hidden = description.hidden
    this.displayName = description.display

    this.config = immutableObject(description.config || [])

    Object.freeze(this)
  }

  start (options, { caddy, portsAllocations }) {
    return caddy.addSite({
      name: this.name,
      port: options.port,
      root: this.path,
      env: createEnvironment(portsAllocations, options.globalConfig)
    })
      .return(() => caddy.removeSite(this.name))
  }
}
