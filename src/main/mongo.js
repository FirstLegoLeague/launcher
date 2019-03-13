'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')
const { spawn } = require('child_process')

const { logger } = require('./logs')

Promise.promisifyAll(fs)

const mkdirpAsync = Promise.promisify(mkdirp)

const FILE_EXTENSION = (process.platform === 'win32') ? '.exe' : ''
const MONGO_BIN_DIR = path.resolve(`./internals/mongo/bin`)
const MONGO_EXECUTABLE_PATH = path.resolve(MONGO_BIN_DIR, `mongod${FILE_EXTENSION}`)
const MONGO_ARGUMENTS = ['--dbpath', './data/$mongo']
  .concat((process.arch === 'ia32') ? ['--storageEngine=mmapv1'] : [])

const MONGODUMP_EXECUTABLE_PATH = path.resolve(MONGO_BIN_DIR, `mongodump${FILE_EXTENSION}`)
const DUMP_PATH = exports.DUMP_PATH = path.resolve('./dump')

exports.dump = function () {
  return mkdirpAsync(DUMP_PATH).then(() =>
    new Promise((resolve, reject) => {
      const mongodump = spawn(MONGODUMP_EXECUTABLE_PATH, ['--out', DUMP_PATH])
      mongodump.stdout.on('data', data => logger.info(data))
      mongodump.stderr.on('error', err => logger.error(err))
      mongodump.on('exit', code => {
        if (code === 0) {
          logger.info(`Mongodump exited with code ${code}`)
          resolve()
        } else {
          logger.error(`Mongodump exited with code ${code}`)
          reject(new Error('Mongodump exited with non-zero status code.'))
        }
      })
    })
  )
}

function createMongoUri (options) {
  const parts = ['mongodb://']

  if (options.credentials) {
    parts.push(options.credentials.user, ':', options.credentials.password, '@')
  }

  parts.push(options.host || 'localhost', ':', options.port || '27017')

  if (options.db) {
    parts.push('/', options.db)
  }

  return parts.join('')
}

class Mongo {
  constructor (serviceManager, logStream) {
    this.executable = MONGO_EXECUTABLE_PATH
    this.logStream = logStream
    this.serviceManager = serviceManager

    this.databases = []
  }

  start () {
    logger.info(`process.arch:${process.arch} MONGO_ARGUMENTS:${MONGO_ARGUMENTS}`)
    return mkdirpAsync('./data/$mongo')
      .then(() => this.serviceManager.startService({
        serviceName: 'mongo',
        serviceId: this.serviceId,
        logStream: this.logStream,
        executable: this.executable,
        arguments: MONGO_ARGUMENTS
      }))
      .then(serviceId => {
        this.serviceId = serviceId
      })
  }

  stop () {
    return this.serviceManager.stopService(this.serviceId)
  }

  createDatabase (name) {
    return Promise.resolve(createMongoUri({
      db: name
    }))
  }
}

exports.Mongo = Mongo
