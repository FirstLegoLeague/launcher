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

const DEFAULT_INTERNALS_DIR = path.join(__dirname, '../internals')
const MONGO_PACKED_DIR_REGEX = /^mongodb-[^/]*\//
const MONGO_DIR = 'mongo'

function getDefaultPlatform () {
  return (process.platform === 'darwin') ? 'osx' : process.platform
}

function getDefaultArch () {
  if (process.arch === 'x32') {
    return 'i386'
  }

  if (process.arch === 'x64') {
    return 'x86_64'
  }

  return process.arch
}

function createDownloadLink (platform, arch) {
  const extension = (platform === 'win32') ? 'zip' : 'tgz'
  const ubuntuAddition = (platform === 'linux') ? '-ubuntu1604' : ''

  return `http://downloads.mongodb.org/${platform}/mongodb-${platform}-${arch}` +
    `${ubuntuAddition}-v3.2-latest.${extension}`
}

exports.getMongo = function (internalsDir, platform, arch) {
  internalsDir = internalsDir || DEFAULT_INTERNALS_DIR
  platform = platform || getDefaultPlatform()
  arch = arch || getDefaultArch()

  const mongoLink = createDownloadLink(platform, arch)
  const mongoPath = path.resolve(internalsDir, MONGO_DIR)

  return rimrafAsync(mongoPath)
    .then(() => mkdirpAsync(mongoPath))
    .then(() => new Promise((resolve, reject) => {
      const req = request({
        url: mongoLink,
        encoding: null,
        gzip: true
      })

      req.on('response', response => {
        if (response.statusCode === 200) {
          if (response.headers['content-type'] === 'application/zip') {
            req
              .pipe(unzip.Extract({ path: mongoPath })
                .on('close', () => {
                  resolve()
                }))
              .on('error', reject)
          } else if (response.headers['content-type'] === 'application/x-gzip') {
            req
              .pipe(createGunzip())
              .pipe(tar.extract(mongoPath, {
                map: header => {
                  header.name = header.name.replace(MONGO_PACKED_DIR_REGEX, '')
                  return header
                }
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

if (require.main === module) {
  caporal
    .description('Download the relevant caddy executable')
    .option('--platform, -p <platform>', 'Platform for executable', ['win32', 'osx', 'linux'])
    .option('--arch <arch>', 'CPU architecture', ['i386', 'x86_64'])
    .option('--internals-dir, -i <internalsDir>', 'The path to the internals directory')
    .action((args, options) => {
      exports.getMongo(options.internalsDir, options.platform, options.arch)
        .then(() => console.info('Mongo downloaded successfully.'))
        .catch(err => console.error(err))
    })

  caporal.parse(process.argv)
}
