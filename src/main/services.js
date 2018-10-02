'use strict'

const pm2 = require('pm2')
const Promise = require('bluebird')
const randomatic = require('randomatic')

Promise.promisifyAll(pm2)

function createServiceId (serviceName) {
  return `${serviceName || 'unknown'}-${randomatic('a0', 5)}`
}

exports.ServiceManager = class {
  constructor () {
    this.services = {}
    this.pm2ConnectionPromise = null
  }

  _pm2Connect () {
    if (!this.pm2ConnectionPromise) {
      this.pm2ConnectionPromise = pm2.connectAsync(false)
    }

    return this.pm2ConnectionPromise
  }

  startService (options) {
    const serviceId = options.serviceId || createServiceId(options.serviceName)
    const init = options.init || (() => {})

    return Promise.try(init)
      .then(() => this._pm2Connect())
      .then(() => pm2.startAsync({
        name: serviceId,
        script: options.executable,
        args: options.arguments || [],
        env: options.env || {},
        cwd: options.cwd,
        pid: `./tmp/$pids/${options.serviceName}.pid`,
        output: `./logs/${options.serviceName}.log`
      }))
  }

  checkService (serviceId) {
    return pm2.connectAsync(false)
      .then(() => pm2.describeAsync(serviceId))
      .then(description => description.pm2_env.status === 'online')
      .tap(() => pm2.disconnectAsync())
  }

  stopService (serviceId) {
    return pm2.connectAsync(false)
      .then(() => pm2.delete(serviceId))
      .tap(() => pm2.disconnectAsync())
  }
}
