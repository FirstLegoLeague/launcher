'use strict'

const request = require('request')
const Promise = require('bluebird')
const decompress = require('decompress')

const requestAsync = Promise.promisify(request, { multiArgs: true })

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

  return requestAsync({
    url: mongoLink,
    encoding: null,
    gzip: true
  })
    .then(([response, body]) => {
      if (response.statusCode === 200) {
        return decompress(body, directory, { strip: 1 })
      } else {
        throw new Error(`Could not download mongodb`)
      }
    })
}
