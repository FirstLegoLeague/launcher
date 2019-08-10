'use strict'

const decompress = require('decompress')
const request = require('request')
const Promise = require('bluebird')

const requestAsync = Promise.promisify(request, { multiArgs: true })

exports.getByHttp = function ({ directory }, moduleOptions) {
  return Promise.resolve()
    .then(() => requestAsync({
      url: moduleOptions.url,
      encoding: null,
      gzip: true
    }))
    .then(([response, body]) => {
      if (response.statusCode === 200) {
        return decompress(body, directory, { strip: moduleOptions.strip })
      } else {
        throw new Error(`Could not download module: ${this.name}`)
      }
    })
}
