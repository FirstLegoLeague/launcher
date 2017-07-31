'use strict'

const { HttpModule } = require('./http')
const { NodeModule } = require('./node')

const modulesTypes = {
  http: HttpModule,
  node: NodeModule
}

exports.moduleFactory = (name, path, options) => {
  const Module = modulesTypes[options.type]

  if (Module) {
    return new Module(name, path, options)
  } else {
    throw new Error('Unknown module type')
  }
}
