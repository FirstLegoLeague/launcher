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
        version: 'FirstLegoLeague/identity-provider#a707e3e07fe61560f6bf73cad2fbf5c3ff79dac8'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '2.0.10'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament',
        version: '1.3.3'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/scoring#ac6c3d000f0623a3a9a7a41d52384204550f7f09'
      }
    },
    rankings: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/rankings#7baaebdf699ecda9013118b5ea1f80e8fca67372'
      }
    },
    clock: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/clock',
        version: '2.0.8'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
