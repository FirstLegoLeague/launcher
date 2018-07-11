'use strict'

const semver = require('semver')
const request = require('request')
const Promise = require('bluebird')

const NPM_REGISTRY_BASE_URL = 'https://registry.npmjs.org'

const requestAsync = Promise.promisify(request, { multiArgs: true })

exports.NpmResolver = {
  isVersion (version) {
    return semver.valid(version)
  },

  resolve (package_, version) {
    return Promise.resolve()
      .then(() => requestAsync({
        baseUrl: NPM_REGISTRY_BASE_URL,
        url: `/${encodeURIComponent(package_)}/`,
        json: true
      }))
      .then(([response, body]) => {
        if (response.statusCode !== 200) {
          throw new Error(`NPM package "${package_}" not available`)
        }

        return body.versions[version].dist.tarball
      })
  }
}
