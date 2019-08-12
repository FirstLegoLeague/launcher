
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
      get: getCaddy,
      devFiles: './init/'
    },
    mongo: {
      internal: true,
      get: getMongo,
      devFiles: '**/*.pdb'
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
        package: '@first-lego-league/identity-provider',
        version: '1.1.0'
      }
    },
    display: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/display',
        version: '2.6.0'
      }
    },
    tournament: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament',
        version: '2.1.0'
      }
    },
    'tournament-status': {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/tournament-status',
        version: '1.3.0'
      }
    },
    scoring: {
      get: getNpmModule,
      options: {
        package: '@first-lego-league/scoring',
        version: '2.4.0'
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
        version: '2.5.0'
      }
    }
  },
  custom: {
    npm: getNpmModule,
    http: getByHttp
  }
}
