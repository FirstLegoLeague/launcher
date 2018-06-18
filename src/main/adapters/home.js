'use strict'

const { saveLogs } = require('../logs')

exports.saveLogs = function (filename, callback) {
  saveLogs(filename).asCallback(callback)
}
