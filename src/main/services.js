'use strict'

const pm2 = require('pm2')
const Promise = require('bluebird')

Promise.promisifyAll(pm2)

function waitForTermination (serviceId) {
  return new Promise((resolve, reject) => {
    function check () {
      pm2.describeAsync(serviceId)
        .then(([description]) => {
          if (description.pm2_env.status === 'stopped') {
            resolve()
          } else {
            setTimeout(check, 100)
          }
        })
        .catch(reject)
    }

    check()
  })
}

exports.ServiceManager = class {
  constructor () {
    this.services = {}
    this.pm2ConnectionPromise = null
  }

  _pm2Connect () {
    if (!this.pm2ConnectionPromise) {
      this.pm2ConnectionPromise = pm2.connectAsync(true)
    }

    return this.pm2ConnectionPromise
  }

  startService (options) {
    const serviceId = options.serviceId || options.serviceName
    const init = options.init || (() => {})

    return Promise.try(init)
      .then(() => this._pm2Connect())
      .then(() => pm2.startAsync({
        name: serviceId,
        script: options.executable,
        args: options.arguments || [],
        env: options.env || {},
        cwd: options.cwd,
        output: options.logPath
      }))
      .return(serviceId)
  }

  checkService (serviceId) {
    return this._pm2Connect()
      .then(() => pm2.describeAsync(serviceId))
      .then(([description]) => description.pm2_env.status === 'online')
  }

  stopService (serviceId) {
    return this._pm2Connect()
      .then(() => pm2.stopAsync(serviceId))
      .then(() => waitForTermination(serviceId))
  }
}
