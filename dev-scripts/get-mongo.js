'use strict'

const tar = require('tar-fs')
const unzip = require('unzip-stream')
const request = require('request')
const Promise = require('bluebird')
const { createGunzip } = require('zlib')

const MONGO_PACKED_DIR_REGEX = /^mongodb-[^/]*\//

function calculateMongoPlatform (platform) {
  return (platform === 'darwin') ? 'osx' : platform
}

function calculateMongoArch (arch) {
  if (arch === 'x32') {
    return 'i386'
  }

  if (arch === 'x64') {
    return 'x86_64'
  }

  throw new Error(`Unknown architecture '${arch}' for mongo`)
}

function createDownloadLink (platform, arch) {
  const mongoPlatform = calculateMongoPlatform(platform)
  const mongoArch = calculateMongoArch(arch)

  const extension = (platform === 'win32') ? 'zip' : 'tgz'
  const ubuntuAddition = (platform === 'linux') ? '-ubuntu1604' : ''

  return `http://downloads.mongodb.org/${mongoPlatform}/mongodb-${mongoPlatform}-${mongoArch}` +
    `${ubuntuAddition}-v3.2-latest.${extension}`
}

exports.getMongo = function ({ directory, platform, arch }) {
  const mongoLink = createDownloadLink(platform, arch)

  return Promise.resolve()
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
              .pipe(unzip.Extract({ path: directory })
                .on('close', () => {
                  resolve()
                }))
              .on('error', reject)
          } else if (response.headers['content-type'] === 'application/x-gzip') {
            req
              .pipe(createGunzip())
              .pipe(tar.extract(directory, {
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
