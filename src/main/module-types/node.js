
const path = require('path')
const rimraf = require('rimraf')
const Promise = require('bluebird')
const { spawn } = require('child_process')

const { immutableObject, immutableArray, startModuleProcess } = require('./helpers')

exports.NodeModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath

    this.script = path.join(this.path, description.script)

    this.hidden = description.hidden
    this.displayName = description.display

    this.scriptArguments = immutableArray(description.arguments)
    this.requirements = immutableArray(description.require)
    this.config = immutableObject(description.config || [])

    Object.freeze(this)
  }

  start (options, dependencies) {
    const nodeArgs = []

    if (process.env.NODE_ENV === 'development') {
      nodeArgs.push(`--inspect=1${options.port}`)
    }

    return startModuleProcess(options, dependencies, {
      name: this.name,
      requirements: this.requirements,
      executable: process.execPath,
      path: this.path,
      arguments: nodeArgs.concat(this.script, this.arguments || []),
      env: {
        'ELECTRON_RUN_AS_NODE': '1'
      }
    })
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
