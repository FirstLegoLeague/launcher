'use strict'

const { execFile } = require('child_process')
const Promise = require('bluebird')

const TERMINATION_TIMEOUT = 5 * 1000

function createServiceId () {
  return 's' + new Date().valueOf()
}

function terminateGracefully (childProcess) {
  return Promise.try(() => {
    return childProcess.kill('SIGINT')
  })
    .catch(err => {
      if (err.code !== 'ESRCH') {
        throw err
      }
    })
    .then(() => new Promise((resolve, reject) => {
      try {
        if (!childProcess.kill(0)) {
          resolve()
        } else {
          childProcess.once('exit', resolve)
        }
      } catch (err) {
        if (err.code !== 'ESRCH') {
          throw err
        }
        resolve()
      }
    }))
    .timeout(TERMINATION_TIMEOUT)
    .catch(Promise.TimeoutError, () => childProcess.kill('SIGKILL'))
    .catch(err => {
      if (err.code !== 'ESRCH') {
        throw err
      }
    })
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
              const child = execFile(options.executable, options.arguments || [], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: options.env || {},
                cwd: options.cwd || '.'
              })
              child.stdout.pipe(options.logStream, { end: false })
              child.stderr.pipe(options.logStream, { end: false })

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
      return terminateGracefully(this.services[serviceId].child)
    } else {
      return Promise.resolve(false)
    }
  }
}
