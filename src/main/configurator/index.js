'use strict'

const Keyv = require('keyv')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')
const EventEmitter = require('events')

const mkdirpAsync = Promise.promisify(mkdirp)

const STORAGE_PATH = path.resolve('./data/$config.sqlite')

exports.Configurator = class extends EventEmitter {
  constructor (mhub) {
    super()
    this.configMetadata = {}
    this.mhub = mhub
    this.sealed = false
    this.started = false

    this.storagePromise = mkdirpAsync(path.dirname(STORAGE_PATH))
      .then(() => new Keyv(`sqlite://${STORAGE_PATH}`))
  }

  _publishConfiguration (moduleName) {
    return this.getFields(moduleName)
      .then(Object.entries)
      .map(([name, value]) => {
        return { name, value }
      })
      .then(fields => {
        return this.mhub.publish('configuration', `config:${moduleName}`, { fields })
      })
  }

  seal () {
    this.sealed = true
    Object.freeze(this.configMetadata)
    this.emit('seal')
  }

  start () {
    if (!this.started) {
      return this.getConfigMetadata()
        .then(Object.keys)
        .map(moduleName => this._publishConfiguration(moduleName))
    } else {
      return Promise.resolve()
    }
  }

  addModule (module) {
    if (this.sealed) {
      throw new Error('Can\'t add module to a sealed configurator')
    }

    this.configMetadata[module.name] = module.config
    return this.storagePromise.then(storage => {
      return Promise.resolve(Object.values(module.config))
        .reduce((fields, group) => fields.concat(group.fields), [])
        .map(field => {
          const key = `${module.name}/${field.name}`
          if (field.default !== undefined) {
            return Promise.resolve(storage.get(key))
              .then(value => {
                if (value === undefined) {
                  return storage.set(key, field.default)
                }
              })
          }
        })
    })
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

  setFields (moduleName, fieldsValues) {
    return this.storagePromise.then(storage => {
      return Promise.resolve(Object.entries(fieldsValues))
        .map(([name, value]) => storage.set(`${moduleName}/${name}`, value))
        .then(() => this._publishConfiguration(moduleName))
    })
  }

  getField (moduleName, fieldName) {
    return this.storagePromise.then(storage => storage.get(`${moduleName}/${fieldName}`))
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
