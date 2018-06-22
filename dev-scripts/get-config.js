'use strict'

const { getMhub } = require('./get-mhub')
const { getCaddy } = require('./get-caddy')
const { getMongo } = require('./get-mongo')
const { getNpmModule } = require('./.get/get-npm-module')
const { getByHttp } = require('./get-by-http')

// eslint-disable-next-line node/exports-style
module.exports = {
  modules: {
    caddy: {
      internal: true,
      get: getCaddy
    },
    mongo: {
      internal: true,
      get: getMongo
    },
    mhub: {
      internal: true,
      get: getMhub,
      options: {
        package: 'mhub',
        version: '0.9.1'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '1.1.6'
      }
    }
  },
  custom: {
    npm: getNpmModule
  }
}
