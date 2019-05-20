
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const Promise = require('bluebird')

const { moduleFactory } = require('./module-types/index')

Promise.promisifyAll(fs)

const PARALLEL_LOADING = 3
const MODULES_DIR = path.resolve('./modules')
const MODULE_DESCRIPTION_FILE = 'module.yml'

function loadModule (moduleName) {
  const modulePath = path.join(MODULES_DIR, moduleName)

  return fs.readFileAsync(path.join(modulePath, MODULE_DESCRIPTION_FILE))
    .then(yaml.safeLoad)
    .then(description => moduleFactory(moduleName, modulePath, description))
}

exports.loadModules = () => {
  return fs.readdirAsync(MODULES_DIR)
    .map(loadModule, { concurrency: PARALLEL_LOADING })
}
