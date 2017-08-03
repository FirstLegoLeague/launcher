'use strict'

const Promise = require('bluebird')
const request = require('request')
const AdmZip = require('adm-zip')
const fs = require('fs')
const { join } = require('path')

Promise.promisifyAll(fs)

const requestAsync = Promise.promisify(request, { multiArgs: true })

exports.HttpModule = class {
  constructor (name, path, options) {
    this.name = name
    this.path = path
    this.url = options.url
    this.directory = options.directory

    Object.freeze(this)
  }

  start () {}

  stop () {
    return Promise.resolve()
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
      .then(zip => Promise.fromCallback(cb => zip.extractAllToAsync(this.path, true, cb)))
      .then(() => fs.readdirAsync(join(this.path, this.directory)))
      .each(file => fs.renameAsync(join(this.path, this.directory, file), join(this.path, file)))
      .then(() => fs.rmdirAsync(join(this.path, this.directory)))
  }
}
