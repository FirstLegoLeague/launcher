'use strict'

const Promise = require('bluebird')
const request = require('request')
const path = require('path')
const tar = require('tar-fs')
const { exec, fork, spawn } = require('child_process')
const { createGunzip } = require('zlib')
const rimraf = require('rimraf')
const rotate = require('rotating-file-stream')
const fs = require('fs')

const requestAsync = Promise.promisify(request, { multiArgs: true })

const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

exports.NodeModule = class {
  constructor (modulePath, description) {
    this.name = description.name
    this.path = modulePath

    console.log(this.path, description.script)
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
        const { tarball } = body.versions[this.version].dist

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
