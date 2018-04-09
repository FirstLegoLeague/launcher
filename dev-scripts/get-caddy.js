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

const DEFAULT_INTERNALS_DIR = path.join(__dirname, 'internals')
const CADDY_DIR = 'caddy'

function getDefaultPlatform () {
  return (process.platform === 'win32') ? 'windows' : process.platform
}

function getDefaultArch () {
  if (process.arch === 'x32') {
    return '386'
  }

  if (process.arch === 'x64') {
    return 'amd64'
  }

  return process.arch
}

function createDownloadLink (platform, arch) {
  return `https://caddyserver.com/download/${platform}/${arch}?license=personal`
}

exports.getCaddy = function (internalsDir, platform, arch) {
  internalsDir = internalsDir || DEFAULT_INTERNALS_DIR
  platform = platform || getDefaultPlatform()
  arch = arch || getDefaultArch()

  const caddyLink = createDownloadLink(platform, arch)
  const caddyPath = path.resolve(internalsDir, CADDY_DIR)

  return rimrafAsync(caddyPath)
    .then(() => mkdirpAsync(caddyPath))
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
              .pipe(unzip.Extract({ path: caddyPath })
                .on('close', () => {
                  resolve()
                }))
              .on('error', reject)
          } else if (response.headers['content-type'] === 'application/x-gzip') {
            req
              .pipe(createGunzip())
              .pipe(tar.extract(caddyPath)
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
    .option('--internals-dir, -i <internalsDir>', 'The path to the internals directory')
    .action((args, options, logger) => {
      exports.getCaddy(options.internalsDir, options.platform, options.arch)
        .then(() => logger.info('Caddy downloaded successfully.'))
        .catch(err => logger.error(err))
    })

  caporal.parse(process.argv)
}
