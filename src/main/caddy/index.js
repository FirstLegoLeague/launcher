'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const mkdirp = require('mkdirp')
const Promise = require('bluebird')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)
const mkdirpAsync = Promise.promisify(mkdirp)

const CADDY_EXECUTABLE_PATH = path.resolve('./internals/caddy/caddy')
const CADDY_FILE_TEMPLATE = path.join(__static, 'caddy-file.ejs')
const CADDY_FILE_PATH = path.resolve('./tmp/$CaddyFile')

function generateCaddyFileContent (caddyFile, sites) {
  return mkdirpAsync(path.dirname(caddyFile))
    .then(() => ejs.renderFileAsync(CADDY_FILE_TEMPLATE, { sites }))
    .then(content => fs.writeFileAsync(caddyFile, content))
}

class Caddy {
  constructor (serviceManager, logStream) {
    this.executable = CADDY_EXECUTABLE_PATH
    this.caddyFile = CADDY_FILE_PATH
    this.serviceManager = serviceManager
    this.logStream = logStream

    this.sites = []
  }

  start () {
    return this.serviceManager.startService({
      init: () => generateCaddyFileContent(this.caddyFile, this.sites),
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
    this.sites.push(site)

    if (this.child !== undefined) {
      return generateCaddyFileContent(this.caddyFile, this.sites)
        .then(() => this.child.kill('SIGUSR1'))
    } else {
      return Promise.resolve()
    }
  }
}

exports.Caddy = Caddy
