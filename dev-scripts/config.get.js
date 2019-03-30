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
        version: 'FirstLegoLeague/identity-provider#c93abf808d44a90d06da945212cb19b45d5923d2'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '2.4.6'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament',
        version: '2.0.2'
      }
    },
    'tournament-status': {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament-status',
        version: '1.0.1'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/scoring',
        version: '2.3.8'
      }
    },
    rankings: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/rankings#5300e21842bf1ead56be329ac62cb4a44e6c697e'
      }
    },
    clock: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/clock',
        version: '2.4.2'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
