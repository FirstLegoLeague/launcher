'use strict'

const randomatic = require('randomatic')
const { execFile } = require('child_process')
const Promise = require('bluebird')

const { logger } = require('./logs')

const TERMINATION_TIMEOUT = 30 * 1000

function createServiceId (serviceName) {
  return `${serviceName || 'unknown'}-${randomatic('a0', 5)}`
}

const SIGNAL = 0
const SIGINT = 2
const SIGKILL = 9

const SERVICE_RESTART_TIMEOUT = 3 * 1000

function waitForTermination (childProcess) {
  return new Promise((resolve, reject) => {
    try {
      if (!childProcess.kill(SIGNAL)) {
        resolve()
      } else {
        childProcess.once('exit', () => {
          resolve()
        })
      }
    } catch (err) {
      if (err.code !== 'ESRCH') {
        throw err
      }
      resolve()
    }
  })
}

function terminateGracefully ({ child, restartCallback }) {
  return Promise.try(() => {
    logger.info(`Starting termination of process ${child.pid}`)
    child.removeListener('exit', restartCallback)
    child.kill(SIGINT)
  })
    .catch(err => {
      if (err.code !== 'ESRCH') {
        throw err
      }
    })
    .then(() => {
      return waitForTermination(child)
        .timeout(TERMINATION_TIMEOUT)
    })
    .catch(Promise.TimeoutError, () => {
      logger.error(`Process ${child.pid} is not terminating, stating force shutdown`)
      child.kill(SIGKILL)
      return waitForTermination()
        .timeout(TERMINATION_TIMEOUT)
    })
    .tap(() => logger.info(`Process ${child.pid} is terminated`))
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
    const serviceId = options.serviceId || createServiceId(options.serviceName)
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

              const restartCallback = () => {
                logger.warn(`Service  ${serviceId} exited.`)
                setTimeout(() => {
                  logger.warn('Restarting.')
                  this.startService(options)
                }, SERVICE_RESTART_TIMEOUT)
              }

              child.on('exit', restartCallback)

              logger.info(`Service ${serviceId} start running with PID: ${child.pid}`)

              this.services[serviceId] = { child, restartCallback }
            })
        }
      })
      .return(serviceId)
  }

  checkService (serviceId) {
    if (serviceId && this.services[serviceId] && this.services[serviceId].child) {
      return Promise.try(() => this.services[serviceId].child.kill(SIGNAL))
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
      return terminateGracefully(this.services[serviceId])
    } else {
      return Promise.resolve(false)
    }
  }
}
