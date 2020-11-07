
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const Promise = require('bluebird')
const randomatic = require('randomatic')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)
const mkdirpAsync = Promise.promisify(mkdirp)
const rimrafAsync = Promise.promisify(rimraf)

const FILE_EXTENSION = (process.platform === 'win32') ? '.exe' : ''
const CADDY_EXECUTABLE_PATH = path.resolve(`./internals/caddy/caddy${FILE_EXTENSION}`)
const CADDY_FILE_TEMPLATE = path.join(__static, 'caddy-file.ejs')
const CADDY_FILE_PATH = path.resolve('./tmp/$CaddyFile')
const CADDY_ENV_DIR = path.resolve('./tmp/$caddy/')

function generateCaddyFileContent (caddyFile, sites, configPort) {
  return mkdirpAsync(path.dirname(caddyFile))
    .then(() => ejs.renderFileAsync(CADDY_FILE_TEMPLATE, {
      configPort,
      sites,
      envDir: CADDY_ENV_DIR
    }))
    .then(content => fs.writeFileAsync(caddyFile, content))
}

function createEnvironmentDirectory (caddyEnvDir) {
  return rimrafAsync(caddyEnvDir)
    .then(() => mkdirpAsync(caddyEnvDir))
}

function generateWebEnvironment (caddyEnvDir, environmentName, env) {
  const envFile = path.join(caddyEnvDir, `${environmentName}.json`)

  return fs.writeFileAsync(envFile, JSON.stringify(env))
}

function removeWebEnvironment (caddyEnvDir, environmentName) {
  const envFile = path.join(caddyEnvDir, `${environmentName}.json`)
  return fs.unlinkAsync(envFile)
}

class Caddy {
  constructor (serviceManager, logStream) {
    this.executable = CADDY_EXECUTABLE_PATH
    this.caddyFile = CADDY_FILE_PATH
    this.caddyEnvDir = CADDY_ENV_DIR
    this.serviceManager = serviceManager
    this.logStream = logStream

    this.sites = []
  }

  start () {
    return this.serviceManager.startService({
      init: () => {
        const caddyFilePromise = generateCaddyFileContent(this.caddyFile, this.sites, this.configPort)
        const siteEnvFilesPromise = createEnvironmentDirectory(this.caddyEnvDir)
          .then(() => this.sites.map(site => generateWebEnvironment(this.caddyEnvDir, site.id, site.env)))
          .all()

        return Promise.all([caddyFilePromise, siteEnvFilesPromise])
      },
      serviceName: 'caddy',
      serviceId: this.serviceId,
      logStream: this.logStream,
      executable: this.executable,
      arguments: ['run', '--config', this.caddyFile, '--adapter', 'caddyfile']
    })
      .then(serviceId => {
        this.serviceId = serviceId
      })
  }

  stop () {
    return this.serviceManager.stopService(this.serviceId)
  }

  addSite (site) {
    this.sites.push(Object.assign({}, site, {
      id: `${site.name}-${randomatic('a0', 5)}`
    }))

    if (this.child !== undefined) {
      return generateCaddyFileContent(this.caddyFile, this.sites, this.configPort)
        .then(() => generateWebEnvironment(this.caddyEnvDir, site.id, site.env))
        .then(() => this.child.kill('SIGUSR1'))
    } else {
      return Promise.resolve()
    }
  }

  removeSite (siteName) {
    const siteIndex = this.sites.findIndex(s => s.name === siteName)
    const site = this.sites[siteIndex]
    this.sites.splice(siteIndex, 1)

    if (this.child !== undefined) {
      return generateCaddyFileContent(this.caddyFile, this.sites, this.configPort)
        .then(() => removeWebEnvironment(this.caddyEnvDir, site.id))
        .then(() => this.child.kill('SIGUSR1'))
    } else {
      return Promise.resolve()
    }
  }

  setConfigPort (configPort) {
    this.configPort = configPort
  }
}

exports.Caddy = Caddy
