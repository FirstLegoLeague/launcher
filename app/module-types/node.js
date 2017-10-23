'use strict'

const Promise = require('bluebird')
const request = require('request')
const {join} = require('path')
const tar = require('tar-fs')
const {exec, fork, spawn} = require('child_process')
const {createGunzip} = require('zlib')
const rimraf = require('rimraf')
const rotate = require('rotating-file-stream')
const fs = require('fs')
const logPath = require('../logDirectory')

const requestAsync = Promise.promisify(request, {multiArgs: true})

const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

exports.NodeModule = class {
  constructor (name, path, options) {
    this.name = name
    this.path = path

    this.link = options.link
    this.package = options.package
    this.version = options.version

    this.dataDir = options.dataDir ? join(this.path, options.dataDir) : undefined
    this.resetScript = options.resetScript ? join(this.path, options.resetScript) : undefined
    this.resetArguments = options.resetArguments || []

    if (options.script) {
      this.script = join(this.path, options.script)
    }
    this.arguments = options.arguments || []

    Object.freeze(this)
  }

  start () {
    if (this.script) {
      const moduleLogPath = join(logPath, this.name)
      if (!fs.existsSync(moduleLogPath)) {
        fs.mkdirSync(moduleLogPath)
      }
      var stream = rotate(this.name, {
        size: '10M',
        interval: '1d',
        path: moduleLogPath
      })
      const child = fork(this.script, this.arguments, {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
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
        spawn(this.resetScript, this.resetArguments, {stdio: 'inherit'}).on('exit', resolve)
      })
    } else {
      scriptPromise = Promise.resolve()
    }
    return Promise.all([scriptPromise, unlinkPromise])
  }

  download () {
    return requestAsync({
      baseUrl: NPM_REGISTRY_BASE_URL,
      url: `/${this.package.replace('/', '%2F')}/`,
      json: true
    })
      .then(([response, body]) => {
        if (response.statusCode !== 200) {
          throw new Error(`Module "${this.name}" not available`)
        }

        return body
      })
      .then(body => {
        const {tarball} = body.versions[this.version].dist

        return new Promise((resolve, reject) => {
          const req = request({
            url: tarball,
            encoding: null,
            gzip: true
          })

          req.on('response', response => {
            if (response.statusCode === 200) {
              req
                .pipe(createGunzip())
                .pipe(tar.extract(this.path, {
                  map: header => {
                    if (header.name.startsWith('package/')) {
                      header.name = header.name.substring('package/'.length)
                    }
                    return header
                  }
                })
                  .on('finish', () => {
                    resolve()
                  }))
                .on('error', reject)
            } else {
              reject(new Error(`Could not download module: ${this.name}`))
            }
          })
        })
      })
      .then(() => new Promise((resolve, reject) => {
        exec('yarn --production --pure-lockfile', {
          cwd: this.path,
          stdio: 'ignore'
        })
          .on('error', reject)
          .on('close', code => {
            if (code === 0) {
              resolve()
            } else {
              reject(new Error(`Could not install module: ${this.name}`))
            }
          })
      }))
  }
}
