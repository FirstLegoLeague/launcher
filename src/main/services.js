'use strict'

const { execFile } = require('child_process')
const Promise = require('bluebird')

function createServiceId () {
  return 's' + new Date().valueOf()
}

exports.ServiceManager = class {
  constructor () {
    this.services = {}
  }

  startService (options) {
    const serviceId = options.serviceId || createServiceId()
    const init = options.init || (() => {})

    return this.checkService(serviceId)
      .then(isRunning => {
        if (!isRunning) {
          return Promise.try(init)
            .then(() => {
              const child = execFile(options.executable, options.arguments, {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: options.env || {}
              })
              child.stdout.pipe(options.logStream)
              child.stderr.pipe(options.logStream)

              this.services[serviceId] = { child }
            })
        }
      })
      .return(serviceId)
  }

  checkService (serviceId) {
    if (serviceId && this.services[serviceId] && this.services[serviceId].child) {
      return Promise.try(() => this.services[serviceId].child.kill(0))
        .catch(err => {
          if (err.code !== 'ESRCH') {
            throw err
          }
          return false
        })
    } else {
      return Promise.resolve(false)
    }
  }

  stopService (serviceId) {
    if (this.services[serviceId] && this.services[serviceId].child) {
      return Promise.try(() => this.services[serviceId].child.kill())
        .catch(err => {
          if (err.code !== 'ESRCH') {
            throw err
          }
          return false
        })
    } else {
      return Promise.resolve(false)
    }
  }
}
