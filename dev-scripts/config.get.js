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
        version: 'FirstLegoLeague/identity-provider#master'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/display#env'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/tournament#master'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/scoring#master'
      }
    },
    rankings: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/scoring#dev/standard'
      }
    },
    clock: {
      get: getNpmModule,
      options: {
        version: 'FirstLegoLeague/clock#webpack'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
