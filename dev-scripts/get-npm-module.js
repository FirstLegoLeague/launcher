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

const DEFAULT_MODULES_DIR = path.join(__dirname, '../modules')
const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

exports.getNpmModule = function (modulesDir, moduleOptions) {
  modulesDir = modulesDir || DEFAULT_MODULES_DIR

  const modulePath = path.resolve(modulesDir, moduleOptions.name)

  return rimrafAsync(modulePath)
    .then(() => mkdirpAsync(modulePath))
    .then(() => requestAsync({
      baseUrl: NPM_REGISTRY_BASE_URL,
      url: `/${moduleOptions.package.replace('/', '%2F')}/`,
      json: true
    }))
    .then(([response, body]) => {
      if (response.statusCode !== 200) {
        throw new Error(`Module "${moduleOptions.name}" not available`)
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
            reject(new Error(`Could not download module: ${moduleOptions.name}`))
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
            reject(new Error(`Could not install module: ${moduleOptions.name}`))
          }
        })
    }))
}

if (require.main === module) {
  caporal
    .description('Download the relevant caddy executable')
    .argument('<name>', 'The name of the module')
    .argument('<package>', 'The name of the npm package')
    .argument('<version>', 'The version of the npm package')
    .option('--modules-dir, -m <modulesDir>', 'The path to the modules directory')
    .action((args, options) => {
      exports.getNpmModule(options.modulesDir, args)
        .then(() => console.info(`Module "${args.name}" downloaded successfully.`))
        .catch(err => console.error(err))
    })

  caporal.parse(process.argv)
}
