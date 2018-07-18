'use strict'

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

const CADDY_EXECUTABLE_PATH = path.resolve('./internals/caddy/caddy')
const CADDY_FILE_TEMPLATE = path.join(__static, 'caddy-file.ejs')
const CADDY_FILE_PATH = path.resolve('./tmp/$CaddyFile')
const CADDY_ENV_DIR = path.resolve('./tmp/$caddy/')

function generateCaddyFileContent (caddyFile, sites) {
  return mkdirpAsync(path.dirname(caddyFile))
    .then(() => ejs.renderFileAsync(CADDY_FILE_TEMPLATE, {
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
  const envFile = path.join(caddyEnvDir, `${environmentName}.json.tpl`)

  return fs.writeFileAsync(envFile, JSON.stringify(env))
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
        const caddyFilePromise = generateCaddyFileContent(this.caddyFile, this.sites)
        const siteEnvFilesPromise = createEnvironmentDirectory(this.caddyEnvDir)
          .then(() => this.sites.map(site => generateWebEnvironment(this.caddyEnvDir, site.id, site.env)))
          .all()

        return Promise.all([caddyFilePromise, siteEnvFilesPromise])
      },
      serviceName: 'caddy',
      serviceId: this.serviceId,
      logStream: this.logStream,
      executable: this.executable,
      arguments: ['-conf', this.caddyFile]
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
      return generateCaddyFileContent(this.caddyFile, this.sites)
        .then(() => generateWebEnvironment(this.caddyEnvDir, site.id, site.env))
        .then(() => this.child.kill('SIGUSR1'))
    } else {
      return Promise.resolve()
    }
  }
}

exports.Caddy = Caddy
