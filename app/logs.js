'use strict'

const path = require('path')
const rotate = require('rotating-file-stream')
const Promise = require('bluebird')

const LOG_SIZE = '10M'
const LOG_INTERVAL = '1d'
const LOG_DIR = path.resolve('./logs')

exports.createLogStream = name => {
  return rotate(`${name}.log`, {
    size: LOG_SIZE,
    interval: LOG_INTERVAL,
    path: LOG_DIR
  })
}

exports.loadLogsOptions = () => {
  return Promise.resolve({
    logsDirectory: path.resolve('./logs'),
    logLevel: process.env.LOG_LEVEL
  })
}
