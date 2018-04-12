'use strict'

const tar = require('tar-fs')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const caporal = require('caporal')
const request = require('request')
const Promise = require('bluebird')
const { exec } = require('child_process')
const { createGunzip } = require('zlib')

const mkdirpAsync = Promise.promisify(mkdirp)
const rimrafAsync = Promise.promisify(rimraf)
const requestAsync = Promise.promisify(request, { multiArgs: true })

const DEFAULT_MHUB_PACKAGE = 'mhub'
const DEFAULT_MHUB_VERSION = '0.9.1'
const MHUB_DIR = 'mhub'
const DEFAULT_INTERNALS_DIR = path.join(__dirname, '../internals')
const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

exports.getMhub = function (internalsDir, moduleOptions) {
  internalsDir = internalsDir || DEFAULT_INTERNALS_DIR
  moduleOptions.package = moduleOptions.package || DEFAULT_MHUB_PACKAGE
  moduleOptions.version = moduleOptions.version || DEFAULT_MHUB_VERSION

  const modulePath = path.resolve(internalsDir, MHUB_DIR)

  return rimrafAsync(modulePath)
    .then(() => mkdirpAsync(modulePath))
    .then(() => requestAsync({
      baseUrl: NPM_REGISTRY_BASE_URL,
      url: `/${moduleOptions.package.replace('/', '%2F')}/`,
      json: true
    }))
    .then(([response, body]) => {
      if (response.statusCode !== 200) {
        throw new Error(`Mhub not available`)
      }

      return body
    })
    .then(body => {
      const { tarball } = body.versions[moduleOptions.version].dist

      return new Promise((resolve, reject) => {
        const req = request({
          url: tarball,
          encoding: null,
          gzip: true
        })

        req.on('response', response => {
          if (response.statusCode === 200) {
            req
              .pipe(createGunzip())
              .pipe(tar.extract(modulePath, {
                map: header => {
                  if (header.name.startsWith('package/')) {
                    header.name = header.name.substring('package/'.length)
                  }
                  return header
                }
              })
                .on('finish', () => {
                  resolve()
                }))
              .on('error', reject)
          } else {
            reject(new Error(`Could not download mhub`))
          }
        })
      })
    })
    .then(() => new Promise((resolve, reject) => {
      exec('yarn --production --pure-lockfile', {
        cwd: modulePath,
        stdio: 'ignore'
      })
        .on('error', reject)
        .on('close', code => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Could not install mhub`))
          }
        })
    }))
}

if (require.main === module) {
  caporal
    .description('Download mhub')
    .option('--npm-package <package>', 'The name of the npm package')
    .option('--version, -v <version>', 'The version of mhub')
    .option('--internals-dir, -i <internalsDir>', 'The path to the modules directory')
    .action((args, options) => {
      exports.getMhub(options.internalsDir, {
        package: options.package,
        version: options.version
      })
        .then(() => console.info(`Mhub downloaded successfully.`))
        .catch(err => console.error(err))
    })

  caporal.parse(process.argv)
}
