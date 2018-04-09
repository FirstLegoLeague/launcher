'use strict'

const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const { MongoClient } = require('mongodb')
const { execFile } = require('child_process')

Promise.promisifyAll(fs)
Promise.promisifyAll(MongoClient)

const MONGO_EXECUTABLE_PATH = path.resolve('./internals/mongo/bin/mongod')
const MONOG_URL = 'mongodb://localhost:27017'

function getMongoConnection () {
  return MongoClient.connectAsync(MONOG_URL)
    .disposer(db => db.close())
}

class Mongo {
  constructor (logStream) {
    this.executable = MONGO_EXECUTABLE_PATH
    this.logStream = logStream

    this.databases = []
  }

  start () {
    if (this.child === undefined) {
      return Promise.resolve()
        .then(() => {
          const stream = this.logStream
          const child = execFile(this.executable, ['--dbpath', './data/$mongo'], {
            stdio: ['pipe', 'pipe', 'pipe']
          })
          child.stdout.pipe(stream)
          child.stderr.pipe(stream)

          return () => new Promise(resolve => {
            child
              .on('exit', resolve)
              .kill()
          })
        })
    } else {
      return Promise.resolve()
    }
  }

  createDatabase (name) {
    return Promise.resovle(`${MONOG_URL}/${name}`)
  }
}

exports.Mongo = Mongo
