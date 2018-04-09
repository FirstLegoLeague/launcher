'use strict'

const os = require('os')
const Promise = require('bluebird')
const { exec } = require('child_process')

exports.GenericModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath

    if (typeof description.command === 'string') {
      this.command = description.command
    } else {
      this.command = description.command[os.platform()]
    }

    this.arguments = description.arguments || []

    Object.freeze(this)
  }

  start (options) {
    const stream = options.logStream
    const child = exec(this.command, this.arguments, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
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
  }
}
