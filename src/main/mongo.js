'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')

Promise.promisifyAll(fs)

const mkdirpAsync = Promise.promisify(mkdirp)

const FILE_EXTENSION = (process.platform === 'win32') ? '.exe' : ''
const MONGO_EXECUTABLE_PATH = path.resolve(`./internals/mongo/bin/mongod${FILE_EXTENSION}`)

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
    return mkdirpAsync('./data/$mongo')
      .then(() => this.serviceManager.startService({
        serviceName: 'mongo',
        serviceId: this.serviceId,
        logStream: this.logStream,
        executable: this.executable,
        arguments: ['--dbpath', './data/$mongo']
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
