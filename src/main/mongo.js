
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')
const { spawn } = require('child_process')

const { logger } = require('./logs')
const { TEMP_DIR, DATA_DIR } = require('./app-paths')

Promise.promisifyAll(fs)

const mkdirpAsync = Promise.promisify(mkdirp)

const FILE_EXTENSION = (process.platform === 'win32') ? '.exe' : ''
const MONGO_BIN_DIR = path.resolve(`./internals/mongo/bin`)
const MONGO_EXECUTABLE_PATH = path.join(MONGO_BIN_DIR, `mongod${FILE_EXTENSION}`)
const MONGO_DATA_PATH = path.join(DATA_DIR, '$mongo')
const MONGO_ARGUMENTS = ['--dbpath', MONGO_DATA_PATH]
  .concat((process.arch === 'ia32') ? ['--storageEngine=mmapv1'] : [])

const MONGODUMP_EXECUTABLE_PATH = path.join(MONGO_BIN_DIR, `mongodump${FILE_EXTENSION}`)
const DUMP_PATH = exports.DUMP_PATH = path.join(TEMP_DIR, 'dump')

exports.dump = function () {
  return mkdirpAsync(DUMP_PATH).then(() => {
    const mongodump = spawn(MONGODUMP_EXECUTABLE_PATH, ['--out', DUMP_PATH])
    mongodump.stdout.on('data', data => logger.info(data))
    mongodump.stderr.on('error', err => logger.error(err))
    mongodump.on('data', code => {
      if (code === 0) {
        logger.info(`Mongodump exited with code ${code}`)
      } else {
        logger.error(`Mongodump exited with code ${code}`)
        throw new Error('Mongodump exited with non-zero status code.')
      }
    })
  })
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
    return mkdirpAsync(MONGO_DATA_PATH)
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
