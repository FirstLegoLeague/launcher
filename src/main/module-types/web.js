'use strict'

const os = require('os')
const camelCase = require('camelcase')

const { immutableObject } = require('./helpers')

function getIp (netConnection) {
  return os.networkInterfaces()[netConnection]
    .find(i => i.family === 'IPv4').address
}

function createEnvironment (portsAllocations, globalConfig) {
  const ip = getIp(globalConfig.netConnection)

  return Object.entries(portsAllocations)
    .map(([module, port]) => ({ [`module${camelCase(module, { pascalCase: true })}Url`]: `http://${ip}:${port}` }))
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
      name: this.name,
      port: options.port,
      root: this.path,
      env: createEnvironment(portsAllocations, options.globalConfig)
    })
      .return(() => {
        return () => caddy.removeSite(this.name)
      })
  }
}
