'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const Promise = require('bluebird')
const { execFile } = require('child_process')

Promise.promisifyAll(fs)
Promise.promisifyAll(ejs)

const CADDY_EXECUTABLE_PATH = path.resolve('./internals/caddy/caddy')
const CADDY_FILE_TEMPLATE = path.join(__dirname, 'caddy-file.ejs')
const CADDY_FILE_PATH = path.resolve('./tmp/CaddyFile')

function generateCaddyFileContent (caddyFile, sites) {
  return ejs.renderFileAsync(CADDY_FILE_TEMPLATE, { sites })
    .then(content => fs.writeFileAsync(caddyFile, content))
}

class Caddy {
  constructor (logStream) {
    this.executable = CADDY_EXECUTABLE_PATH
    this.caddyFile = CADDY_FILE_PATH
    this.logStream = logStream

    this.sites = []
  }

  start () {
    if (this.child === undefined) {
      return generateCaddyFileContent(this.caddyFile, this.sites)
        .then(() => {
          // const stream = this.logStream
          const child = execFile(this.executable, ['-conf', this.caddyFile], {
            stdio: ['pipe', 'pipe', 'pipe', 'ipc']
          })
          // child.stdout.pipe(stream)
          // child.stderr.pipe(stream)

          return () => new Promise(resolve => {
            child
              .on('exit', resolve)
              .kill()
          })
        })
    } else {
      return Promise.resolve()
    }
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
