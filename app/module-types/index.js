'use strict'

const { HttpModule } = require('./http')
const { NodeModule } = require('./node')

const modulesTypes = {
  http: HttpModule,
  node: NodeModule
}

exports.moduleFactory = (name, modulePath, description) => {
  if (name !== description.name) {
    throw new Error(`Module name ("${description.name}") don't match it's path (${modulePath})`)
  }

  const Module = modulesTypes[description.type]

  if (Module) {
    return new Module(modulePath, description)
  } else {
    throw new Error('Unknown module type')
  }
}
