'use strict'

const Promise = require('bluebird')
const request = require('request')
const path = require('path')
const AdmZip = require('adm-zip')

const requestAsync = Promise.promisify(request, { multiArgs: true })

exports.HttpModule = class {
  constructor (name, options) {
    this.name = name
    this.modulePath = path.join(process.cwd(), 'modules', name)
    this.url = options.url

    Object.freeze(this)
  }

  download () {
    return requestAsync({
      url: this.url,
      encoding: null
    })
      .then(([response, zipBody]) => {
        if (response.statusCode !== 200) {
          throw new Error('Module not available')
        }

        return zipBody
      })
      .then(body => new AdmZip(body))
      .then(zip => Promise.fromCallback(cb => zip.extractAllToAsync(this.modulePath, true, cb)))
  }
}
