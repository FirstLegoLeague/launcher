'use strict'

const AdmZip = require('adm-zip')
const Promise = require('bluebird')

const mongo = require('./mongo')
const { LOG_DIR } = require('./logs')
const { STORAGE_PATH } = require('./configurator')

exports.saveDebugData = filename => {
  const zip = new AdmZip()
  return mongo.dump()
    .then(() => {
      zip.addLocalFolder(mongo.DUMP_PATH, 'data')
      zip.addLocalFile(STORAGE_PATH, 'configuration')
      zip.addLocalFolder(LOG_DIR, 'logs')
      return Promise.fromCallback(cb => zip.writeZip(filename, cb))
    })
}
