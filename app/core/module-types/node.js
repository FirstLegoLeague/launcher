'use strict'

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const rotate = require('rotating-file-stream')
const Promise = require('bluebird')
const { fork, spawn } = require('child_process')

exports.NodeModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath

    this.script = path.join(this.path, description.script)
    this.arguments = description.arguments || []

    Object.freeze(this)
  }

  start (options) {
    if (this.script) {
      if (!fs.existsSync(options.logsDirectory)) {
        fs.mkdirSync(options.logsDirectory)
      }
      const stream = rotate(`${this.name}.log`, {
        size: '10M',
        interval: '1d',
        path: options.logsDirectory
      })
      const child = fork(this.script, this.arguments, {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        env: {
          'PORT': options.port,
          'DATA_DIR': options.datadir,
          'AUTH_SECRET': options.secret,
          'LOG_LEVEL': options.logLevel
        }
      })
      child.stdout.pipe(stream)
      child.stderr.pipe(stream)

      return () => new Promise(resolve => {
        child
          .on('exit', resolve)
          .kill()
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
