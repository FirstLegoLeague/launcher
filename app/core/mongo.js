'use strict'

const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const { MongoClient } = require('mongodb')

Promise.promisifyAll(fs)
Promise.promisifyAll(MongoClient)

const MONGO_EXECUTABLE_PATH = path.resolve('./internals/mongo/bin/mongod')
const MONOG_URL = 'mongodb://localhost:27017'

function getMongoConnection () {
  return MongoClient.connectAsync(MONOG_URL)
    .disposer(db => db.close())
}

class Mongo {
  constructor (serviceManager, logStream) {
    this.executable = MONGO_EXECUTABLE_PATH
    this.logStream = logStream
    this.serviceManager = serviceManager

    this.databases = []
  }

  start () {
    return this.serviceManager.startService({
      serviceId: this.serviceId,
      logStream: this.logStream,
      executable: this.executable,
      arguments: ['--dbpath', './data/$mongo']
    })
      .then(serviceId => {
        this.serviceId = serviceId
      })
  }

  stop () {
    return this.serviceManager.stopService(this.serviceId)
  }

  createDatabase (name) {
    return Promise.resovle(`${MONOG_URL}/${name}`)
  }
}

exports.Mongo = Mongo
