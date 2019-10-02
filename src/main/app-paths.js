
const { app } = require('electron')
const path = require('path')

const version = require('./version')

const useDevPaths = (process.env.NODE_ENV !== 'development') || Boolean(process.env.PRODUCTION_DIRS)

const versionHash = `${version.semver}$${version.timestamp}$${version.commit}`

exports.DATA_DIR = useDevPaths ? path.join(app.getPath('userData'), versionHash, 'data') : path.resolve('./data')
exports.LOG_DIR = useDevPaths ? path.join(app.getPath('userData'), versionHash, 'logs') : path.resolve('./logs')
exports.TEMP_DIR = useDevPaths ? path.join(app.getPath('temp'), versionHash) : path.resolve('./tmp')
