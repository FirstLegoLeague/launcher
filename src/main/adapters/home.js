'use strict'

const opn = require('opn')
const Promise = require('bluebird')

const { saveLogs } = require('../logs')

exports.HomeAdapter = class {
  constructor (server) {
    this.server = server
  }

  getPortsAllocation (callback) {
    this.server.getPortsAllocation().asCallback(callback)
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
