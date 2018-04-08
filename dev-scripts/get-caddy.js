'use strict'

const tar = require('tar-fs')
const unzip = require('unzip-stream')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const caporal = require('caporal')
const request = require('request')
const Promise = require('bluebird')
const { createGunzip } = require('zlib')

const mkdirpAsync = Promise.promisify(mkdirp)
const rimrafAsync = Promise.promisify(rimraf)

const CADDY_PATH = path.join(__dirname, '../internals/caddy')

function getDefaultsOsParameters (platform, arch) {
  if (platform === undefined) {
    platform = process.platform

    if (platform === 'win32') {
      platform = 'windows'
    }
  }

  if (arch === undefined) {
    arch = process.arch

    if (arch === 'x32') {
      arch = '386'
    }
    if (arch === 'x64') {
      arch = 'amd64'
    }
  }

  return [platform, arch]
}

function createDownloadLink (platform, arch) {
  return `https://caddyserver.com/download/${platform}/${arch}?license=personal`
}

exports.getCaddy = function (platform, arch) {
  [platform, arch] = getDefaultsOsParameters(platform, arch)
  const caddyLink = createDownloadLink(platform, arch)

  return rimrafAsync(CADDY_PATH)
    .then(() => mkdirpAsync(CADDY_PATH))
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
              .pipe(unzip.Extract({ path: CADDY_PATH })
                .on('close', () => {
                  resolve()
                }))
              .on('error', reject)
          } else if (response.headers['content-type'] === 'application/x-gzip') {
            req
              .pipe(createGunzip())
              .pipe(tar.extract(CADDY_PATH)
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

if (require.main === module) {
  caporal
    .description('Download the relevant caddy executable')
    .option('--platform, -p <platform>', 'Platform for executable', ['windows', 'darwin', 'linux'])
    .option('--arch <arch>', 'CPU architecture', ['x32', 'x64'])
    .action((args, options, logger) => {
      exports.getCaddy(options.platform, options.arch)
        .then(() => logger.info('Caddy downloaded successfully.'))
        .catch(err => logger.error(err))
    })

  caporal.parse(process.argv)
}
