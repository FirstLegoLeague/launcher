'use strict'

const { getMhub } = require('./.get/get-mhub')
const { getCaddy } = require('./.get/get-caddy')
const { getMongo } = require('./.get/get-mongo')
const { getNpmModule } = require('./.get/get-npm-module')
const { getByHttp } = require('./.get/get-by-http')

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
    'identity-provider': {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/identity-provider#68b3f616a631a907b2f7fa0443788366d14c9ad5'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '2.0.3'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament',
        version: '0.6.0'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/scoring#f8fcd30dcc0a92b4c20723ad79bad14952bcb49f'
      }
    },
    rankings: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/rankings#2e1fbbfd5d03edef8b09ce033f876930ac829ab5'
      }
    },
    clock: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/clock',
        version: '2.0.6'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
