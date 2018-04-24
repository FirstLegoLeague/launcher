'use strict'

const Keyv = require('keyv')
const path = require('path')
const Promise = require('bluebird')
const EventEmitter = require('events')

const STORAGE_PATH = path.resolve('./tmp/$config.sqlite')

exports.Configurator = class extends EventEmitter {
  constructor (mhub) {
    super()
    this.storage = new Keyv(`sqlite://${STORAGE_PATH}`)
    this.configMetadata = {}
    this.mhub = mhub
    this.sealed = false
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
      .then(() => this.mhub.publish('config:update', {
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
