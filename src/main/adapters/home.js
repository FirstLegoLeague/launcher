'use strict'

const opn = require('opn')
const Promise = require('bluebird')
const AdmZip = require('adm-zip')

const mongo = require('../mongo')
const { LOG_DIR } = require('../logs')
const { STORAGE_PATH } = require('../configurator')

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
      .map(({ name, displayName }) => ({ [name]: displayName || name }))
      .reduce((object, keyValue) => Object.assign(object, keyValue), {})
      .asCallback(callback)
  }

  getIp (callback) {
    this.server.getIp().asCallback(callback)
  }

  saveDebugData (filename, callback) {
    const zip = new AdmZip()
    return mongo.dump()
      .then(() => {
        zip.addLocalFolder(mongo.DUMP_PATH, 'data')
        zip.addLocalFile(STORAGE_PATH, 'configuration')
        zip.addLocalFolder(LOG_DIR, 'logs')
        return Promise.fromCallback(cb => zip.writeZip(filename, cb))
      }).asCallback(callback)
  }

  openSite (site, callback) {
    Promise.resolve(opn(site)).asCallback(callback)
  }
}
