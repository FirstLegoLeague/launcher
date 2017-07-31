'use strict'

const Promise = require('bluebird')

exports.NodeModule = class {
  constructor (name, path, options) {
    this.name = name
    this.path = path

    Object.freeze(this)
  }

  download () {
    return Promise.resolve()
  }
}
