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
        version: 'FirstLegoLeague/identity-provider#3d7995dbf72d53f5d8465b29e379369a5d7ec140'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '2.1.5'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament',
        version: '1.7.7'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/scoring#beb440205095e3776c4cc9776bfac82499969fcc'
      }
    },
    rankings: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/rankings#ad4877e6d13efeb830b38951c84928fd5c623dc6'
      }
    },
    clock: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/clock',
        version: '2.1.1'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
