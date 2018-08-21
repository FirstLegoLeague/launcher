'use strict'

const Keyv = require('keyv')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')
const EventEmitter = require('events')

const { getDefaultValue, getUpdatedValue } = require('./types')

const mkdirpAsync = Promise.promisify(mkdirp)

const STORAGE_PATH = path.resolve('./data/$config.sqlite')

exports.Configurator = class extends EventEmitter {
  constructor () {
    super()
    this.configMetadata = {}
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
      .then(fields => this.emit('new', { moduleName, fields }))
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
      throw new Error('Can\'t add module to a sealed moduleConfigurator')
    }

    if (!module.config) {
      return Promise.resolve()
    }

    this.configMetadata[module.name] = module.config
    return this.storagePromise.then(storage => {
      return Promise.resolve(Object.values(module.config))
        .reduce((fields, group) => fields.concat(group.fields), [])
        .map(field => {
          const key = `${module.name}/${field.name}`
          const defaultValue = getDefaultValue(field)
          if (defaultValue !== undefined) {
            return Promise.resolve(storage.get(key))
              .then(value => {
                if (value === undefined) {
                  return storage.set(key, defaultValue)
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
        .map(([name, value]) => {
          const field = Object.values(this.configMetadata[moduleName])
            .reduce((fields, group) => fields.concat(group.fields), [])
            .filter(f => f.name === name)
          storage.set(`${moduleName}/${name}`, getUpdatedValue(field, value))
        })
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
