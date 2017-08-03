'use strict'

const Promise = require('bluebird')
const request = require('request')
const { join } = require('path')
const tar = require('tar-fs')
const { spawn, fork } = require('child_process')
const { createGunzip } = require('zlib')

const requestAsync = Promise.promisify(request, { multiArgs: true })

const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

exports.NodeModule = class {
  constructor (name, path, options) {
    this.name = name
    this.path = path

    this.package = options.package

    if (options.script) {
      this.script = join(this.path, options.script)
    }
    this.arguments = options.arguments || []

    Object.freeze(this)
  }

  start () {
    if (this.script) {
      const child = fork(this.script, this.arguments, {
        stdio: 'inherit'
      })

      return () => new Promise(resolve => {
        child
          .on('exit', resolve)
          .kill()
      })
    } else {
      return Promise.resolve()
    }
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
        const version = body['dist-tags'].latest
        const { tarball } = body.versions[version].dist

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
        spawn('yarn', ['--production', '--pure-lockfile'], {
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
