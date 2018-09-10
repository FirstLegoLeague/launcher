'use strict'

const opn = require('opn')
const Promise = require('bluebird')

const { saveLogs } = require('../logs')

exports.HomeAdapter = class {
  constructor (server) {
    this.server = server
  }

  getPortsAllocation (callback) {
    Promise.all([
      this.server.getPortsAllocation(),
      this.server.modulesPromise
    ])
      .then(([portsAllocation, modules]) => {
        const pickedAllocation = {}

        const modulesHiddenMap = modules
          .reduce((obj, module) => Object.assign(obj, { [module.name]: Boolean(module.hidden) }), {})

        Object.entries(portsAllocation).forEach(([moduleName, port]) => {
          if (!modulesHiddenMap[moduleName]) {
            pickedAllocation[moduleName] = port
          }
        })

        return pickedAllocation
      })
      .asCallback(callback)
  }

  getModulesDisplayNames (callback) {
    return this.server.modulesPromise
      .then(modules => modules.map(({ name, displayName }) => ({ [name]: displayName || name }))
        .reduce((object, keyValue) => Object.assign(object, keyValue), {}))
      .asCallback(callback)
  }

  getIp (callback) {
    this.server.getIp().asCallback(callback)
  }

  saveLogs (filename, callback) {
    saveLogs(filename).asCallback(callback)
  }

  openSite (site, callback) {
    Promise.resolve(opn(site)).asCallback(callback)
  }
}
