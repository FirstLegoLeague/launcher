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
        version: 'FirstLegoLeague/identity-provider#d0251d2d981d93cf1efbdc914519e63c11941de6'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '2.0.17'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament',
        version: '1.5.0'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/scoring#82b97123a90e90478b31252a0c9d8554ed87bfe8'
      }
    },
    rankings: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/rankings#66767646fd3cd4e01381424a7eaab8f5d2e468b3'
      }
    },
    clock: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/clock',
        version: '2.0.11'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
