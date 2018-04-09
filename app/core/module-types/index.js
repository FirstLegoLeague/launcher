'use strict'

const { WebModule } = require('./web/index')
const { NodeModule } = require('./node')

const modulesTypes = {
  web: WebModule,
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
