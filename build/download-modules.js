'use strict'

const Promise = require('bluebird')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')
const path = require('path')
const fs = require('fs')

const { moduleFactory } = require('../app/module-types')

Promise.promisifyAll(fs)

const mkdirpAsync = Promise.promisify(mkdirp)

fs.readFileAsync(path.join(__dirname, '../modules.yml'))
  .then(yaml.safeLoad)
  .then(modules => {
    return Object.keys(modules)
      .map(name => moduleFactory(name, path.join(__dirname, '../modules', name), modules[name]))
  })
  .map(module => {
    console.log(`Start downloading module "${module.name}"...`)
    return mkdirpAsync(module.path)
      .then(module.download())
      .then(() => console.log(`Finish downloading module "${module.name}".`))
  }, { concurrency: 4 })
  .catch(err => {
    console.error(err.message)
    console.error(err.stack)
  })
