'use strict'

const path = require('path')
const rimraf = require('rimraf')
const Promise = require('bluebird')
const { fork, spawn } = require('child_process')

exports.NodeModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath

    this.script = path.join(this.path, description.script)
    this.arguments = description.arguments || []

    this.requirements = description.require || []

    Object.freeze(this)
  }

  start (options, { mongo }) {
    if (this.script) {
      return Promise.resolve()
        .then(() => {
          if (this.requirements.includes('mongo')) {
            return mongo.createDatabase(this.name)
              .then(uri => {
                return { 'MONGO_URI': uri }
              })
          } else {
            return {}
          }
        })
        .then(additionalEnv => {
          const child = fork(this.script, this.arguments, {
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
            env: Object.assign({
              'PORT': options.port,
              'DATA_DIR': options.datadir,
              'AUTH_SECRET': options.secret,
              'LOG_LEVEL': options.logLevel,
              additionalEnv
            }, additionalEnv)
          })
          child.stdout.pipe(options.logStream)
          child.stderr.pipe(options.logStream)

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

  reset () {
    let unlinkPromise
    if (this.dataDir) {
      unlinkPromise = new Promise(resolve => rimraf(this.dataDir, resolve))
    } else {
      unlinkPromise = Promise.resolve()
    }
    let scriptPromise
    if (this.resetScript) {
      scriptPromise = new Promise((resolve, reject) => {
        spawn(this.resetScript, this.resetArguments, { stdio: 'inherit' }).on('exit', resolve)
      })
    } else {
      scriptPromise = Promise.resolve()
    }
    return Promise.all([scriptPromise, unlinkPromise])
  }
}
