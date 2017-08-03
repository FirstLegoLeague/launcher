'use strict'

const Promise = require('bluebird')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')

const { moduleFactory } = require('../app/module-types')

Promise.promisifyAll(fs)

const rimrafAsync = Promise.promisify(rimraf)
const mkdirpAsync = Promise.promisify(mkdirp)

fs.readFileAsync(path.join(__dirname, '../modules.yml'))
  .then(yaml.safeLoad)
  .then(modules => {
    return Object.keys(modules)
      .map(name => moduleFactory(name, path.join(__dirname, '../modules', name), modules[name]))
  })
  .map(module => {
    console.log(`Start downloading module "${module.name}"...`)
    return rimrafAsync(module.path)
      .then(() => mkdirpAsync(module.path))
      .then(() => module.download())
      .then(() => {
        console.log(`Finish downloading module "${module.name}".`)
      })
  }, { concurrency: 2 })
  .catch(err => {
    console.error(err.message)
    console.error(err.stack)
  })
