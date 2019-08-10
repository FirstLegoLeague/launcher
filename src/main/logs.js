
const path = require('path')
const mkdirp = require('mkdirp')
const rotate = require('rotating-file-stream')
const winston = require('winston')
const Promise = require('bluebird')

const LOG_SIZE = '10M'
const LOG_INTERVAL = '1d'
const LOG_DIR = exports.LOG_DIR = path.resolve('./logs/')

const { combine, timestamp, json } = winston.format

mkdirp.sync(LOG_DIR)

const UpperCaseLevels = winston.format(info => Object.assign(info, { level: info.level.toUpperCase() }))

exports.logger = winston.createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  format: combine(
    timestamp(),
    UpperCaseLevels(),
    json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'launcher.log'),
      level: 'info'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  exports.logger.add(new winston.transports.Console({ level: 'debug' }))
  exports.logger.debug('Console output enable on debug')
}

exports.createLogStream = name => {
  return rotate(`${name}.log`, {
    size: LOG_SIZE,
    interval: LOG_INTERVAL,
    path: LOG_DIR
  })
}

exports.loadLogsOptions = () => {
  return Promise.resolve({
    logsDirectory: LOG_DIR
  })
}
