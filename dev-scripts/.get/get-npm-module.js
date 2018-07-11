'use strict'

const request = require('request')
const Promise = require('bluebird')
const { exec } = require('child_process')
const decompress = require('decompress')

const { resolveUrl } = require('./npm-resolvers')

const requestAsync = Promise.promisify(request, { multiArgs: true })

exports.getNpmModule = function ({ directory }, moduleOptions) {
  return resolveUrl(moduleOptions.package, moduleOptions.version)
    .then(url => requestAsync({
      url,
      encoding: null,
      gzip: true
    }))
    .then(([response, body]) => {
      if (response.statusCode === 200) {
        return decompress(body, directory, { strip: 1 })
      } else {
        throw new Error(`Could not download module: ${this.name}`)
      }
    })
    .then(() => new Promise((resolve, reject) => {
      exec('yarn --production --pure-lockfile', {
        cwd: directory,
        stdio: 'ignore'
      })
        .on('error', reject)
        .on('close', code => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Could not install module: ${moduleOptions.name}`))
          }
        })
    }))
}
