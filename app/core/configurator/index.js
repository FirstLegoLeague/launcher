'use strict'

const Keyv = require('keyv')
const path = require('path')
const { MClient } = require('mhub')
const Promise = require('bluebird')

const MHUB_CONNECTION_STRING = 'ws://localhost:13900'
const MHUB_NODE_NAME = 'default'
const STORAGE_PATH = path.resolve('./tmp/$config.sqlite')

exports.Configurator = class {
  constructor () {
    this.storage = new Keyv(`sqlite://${STORAGE_PATH}`)
    this.configMetadata = {}
  }

  start () {
    this.mhub = new MClient(MHUB_CONNECTION_STRING)
  }

  addModule (module) {
    this.configMetadata[module.name] = module.config
  }

  getConfigMetadata () {
    return this.configMetadata
  }

  setField (moduleName, fieldName, value) {
    return Promise.resolve()
      .then(() => {
        this.storage.set(`${moduleName}/${fieldName}`, value)
      })
      .then(() => this.mhub.publish(MHUB_NODE_NAME, 'config:update', {
        module: moduleName,
        fields: [
          {
            name: fieldName,
            value
          }
        ]
      }))
  }

  getField (moduleName, fieldName, value) {
    return Promise.resolve(this.storage.get(`${moduleName}/${fieldName}`, value))
  }
}
