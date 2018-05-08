'use strict'

const tar = require('tar-fs')
const request = require('request')
const Promise = require('bluebird')
const { exec } = require('child_process')
const { createGunzip } = require('zlib')

const requestAsync = Promise.promisify(request, { multiArgs: true })

const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

exports.getNpmModule = function ({ directory }, moduleOptions) {
  return Promise.resolve()
    .then(() => requestAsync({
      baseUrl: NPM_REGISTRY_BASE_URL,
      url: `/${moduleOptions.package.replace('/', '%2F')}/`,
      json: true
    }))
    .then(([response, body]) => {
      if (response.statusCode !== 200) {
        throw new Error(`Module "${moduleOptions.name}" not available`)
      }

      return body
    })
    .then(body => {
      const { tarball } = body.versions[moduleOptions.version].dist

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
              .pipe(tar.extract(directory, {
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
            reject(new Error(`Could not download module: ${moduleOptions.name}`))
          }
        })
      })
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
