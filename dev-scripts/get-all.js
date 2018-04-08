'use strict'

const caporal = require('caporal')

const { getCaddy } = require('./get-caddy')

caporal
  .description('Download all internals of the launcher')
  .action((args, options, logger) => {
    getCaddy(options.getCaddyPlatform, options.getCaddyArch)
      .then(() => logger.info('Caddy downloaded successfully.'))
      .catch(err => logger.error(err))
  })

caporal.parse(process.argv)
