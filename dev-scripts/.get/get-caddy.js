'use strict'

const tar = require('tar-fs')
const unzip = require('unzip-stream')
const request = require('request')
const Promise = require('bluebird')
const { createGunzip } = require('zlib')

function calculateCaddyPlatform (platform) {
  return (platform === 'win32') ? 'windows' : platform
}

function calculateCaddyArch (arch) {
  if (arch === 'x32') {
    return '386'
  }

  if (arch === 'x64') {
    return 'amd64'
  }

  throw new Error(`Unknown architecture '${arch}' for caddy`)
}

function createDownloadLink (platform, arch) {
  const caddyPlatform = calculateCaddyPlatform(platform)
  const caddyArch = calculateCaddyArch(arch)
  return `https://caddyserver.com/download/${caddyPlatform}/${caddyArch}?license=personal`
}

exports.getCaddy = function ({ directory, platform, arch }) {
  const caddyLink = createDownloadLink(platform, arch)

  return Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
      const req = request({
        url: caddyLink,
        encoding: null,
        gzip: true
      })

      req.on('response', response => {
        if (response.statusCode === 200) {
          if (response.headers['content-type'] === 'application/zip') {
            req
              .pipe(unzip.Extract({ path: directory })
                .on('close', () => {
                  resolve()
                }))
              .on('error', reject)
          } else if (response.headers['content-type'] === 'application/x-gzip') {
            req
              .pipe(createGunzip())
              .pipe(tar.extract(directory, {
                writable: true
              })
                .on('finish', () => {
                  resolve()
                }))
              .on('error', reject)
          } else {
            throw new Error('Unknown content type')
          }
        } else {
          reject(new Error(`Could not download module: ${this.name}`))
        }
      })
    }))
}
