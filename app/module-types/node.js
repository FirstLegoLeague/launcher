'use strict'

const Promise = require('bluebird')

exports.NodeModule = class {
  constructor (name, options) {
    this.name = name

    Object.freeze(this)
  }

  download () {
    return Promise.resolve()
  }
}
