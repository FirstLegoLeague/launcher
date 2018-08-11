'use strict'

const os = require('os')
const Promise = require('bluebird')

const getIp = exports.getIp = netConnection => {
  const networkInterfaces = os.networkInterfaces()

  return os.networkInterfaces()[netConnection || Object.keys(networkInterfaces)[0]]
    .find(i => i.family === 'IPv4').address
}

exports.immutableObject = function immutableObject (element) {
  if (['string', 'number', 'boolean'].includes(typeof element)) {
    return element
  } else if (Array.isArray(element)) {
    return Object.freeze(element.map(e => immutableObject(e)))
  } else if (element && element.constructor === Object) {
    return Object.freeze(Object.keys(element).reduce((newObject, key) => {
      newObject[key] = immutableObject(element[key])
      return newObject
    }, {}))
  } else {
    throw new Error(`Unsupported type (${(element === null) ? 'null' : typeof element}) for immutable objects`)
  }
}

exports.immutableArray = array => {
  array = array || []
  return Object.freeze(array.slice())
}

function createDiscoveryEnvironment (portAllocation, ip) {
  return Object.entries(portAllocation)
    .map(([key, value]) => ({ [`MODULE_${key.toUpperCase().replace(/-/g, '_')}_URL`]: `http://${ip}:${value}` }))
    .reduce((obj, kv) => Object.assign(obj, kv), {})
}

exports.startModuleProcess = (options, { mhub, mongo, serviceManager, portsAllocations }, moduleOptions) => {
  return Promise.resolve()
    .then(() => {
      if (moduleOptions.requirements.includes('mongodb')) {
        return mongo.createDatabase(moduleOptions.name)
          .then(uri => {
            return { 'MONGO_URI': uri }
          })
      } else {
        return {}
      }
    })
    .then(additionalEnv => {
      const ip = getIp(options.globalConfig.netConnection)

      return serviceManager.startService({
        serviceName: moduleOptions.name,
        logStream: options.logStream,
        executable: moduleOptions.executable,
        arguments: moduleOptions.arguments,
        cwd: moduleOptions.path,
        env: Object.assign({
          'PORT': options.port,
          'DATA_DIR': options.dataDir,
          'SECRET': options.secret,
          'PROTECTED_MHUB_PASSWORD': options.protectedMhubPassword,
          'LOG_LEVEL': options.globalConfig.logLevel,
          'MHUB_URI': mhub.url
        }, createDiscoveryEnvironment(portsAllocations, ip), additionalEnv, moduleOptions.env)
      })
    })
    .then(serviceId => {
      return () => serviceManager.stopService(serviceId)
    })
}
