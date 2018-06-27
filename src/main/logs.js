'use strict'

const path = require('path')
const AdmZip = require('adm-zip')
const mkdirp = require('mkdirp')
const rotate = require('rotating-file-stream')
const Promise = require('bluebird')

const LOG_SIZE = '10M'
const LOG_INTERVAL = '1d'
const LOG_DIR = path.resolve('./logs/')

mkdirp.sync(LOG_DIR)

exports.createLogStream = name => {
  return rotate(`${name}.log`, {
    size: LOG_SIZE,
    interval: LOG_INTERVAL,
    path: LOG_DIR
  })
}

exports.loadLogsOptions = () => {
  return Promise.resolve({
    logsDirectory: LOG_DIR,
    logLevel: process.env.LOG_LEVEL
  })
}

exports.saveLogs = filePath => {
  const zip = new AdmZip()
  zip.addLocalFolder(LOG_DIR, 'logs')
  return Promise.fromCallback(cb => zip.writeZip(filePath, cb))
}
