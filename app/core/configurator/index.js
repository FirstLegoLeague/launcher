'use strict'

const Keyv = require('keyv')
const path = require('path')
const Promise = require('bluebird')
const { MClient } = require('mhub')
const EventEmitter = require('events')

const MHUB_CONNECTION_STRING = 'ws://localhost:13900'
const MHUB_NODE_NAME = 'default'
const STORAGE_PATH = path.resolve('./tmp/$config.sqlite')

exports.Configurator = class extends EventEmitter {
  constructor () {
    super()
    this.storage = new Keyv(`sqlite://${STORAGE_PATH}`)
    this.configMetadata = {}
    this.sealed = false
  }

  start () {
    this.started = true
    this.emit('start')
    this.mhub = new MClient(MHUB_CONNECTION_STRING)
  }

  seal () {
    this.sealed = true
    Object.freeze(this.configMetadata)
    this.emit('seal')
  }

  addModule (module) {
    if (this.sealed) {
      throw new Error('Can\'t add module to a sealed configurator')
    }

    this.configMetadata[module.name] = module.config
  }

  getConfigMetadata () {
    return new Promise((resolve, reject) => {
      if (this.sealed) {
        resolve()
      } else {
        this.on('seal', () => {
          resolve()
        })
      }
    })
      .then(() => this.configMetadata)
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

  getField (moduleName, fieldName) {
    return Promise.resolve(this.storage.get(`${moduleName}/${fieldName}`))
  }

  getFields (moduleName) {
    return this.getConfigMetadata()
      .get(moduleName)
      .tap(module => {
        if (!module) {
          throw new Error(`Module "${moduleName}" is not register in configurator`)
        }
      })
      .reduce((fields, group) => fields.concat(group.fields.map(f => f.name)), [])
      .map(k => [k, this.getField(moduleName, k)])
      .map(Promise.all)
      .reduce((map, [key, value]) => Object.assign(map, { [key]: value }), {})
  }
}
