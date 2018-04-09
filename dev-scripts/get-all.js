'use strict'

const caporal = require('caporal')

const { getCaddy } = require('./get-caddy')

caporal
  .description('Download all internals of the launcher')
  .option('--internals-dir, -i <internalsDir>', 'The path to the internals directory')
  .action((args, options, logger) => {
    getCaddy(options.internalsDir)
      .then(() => logger.info('Caddy downloaded successfully.'))
      .catch(err => logger.error(err))
  })

caporal.parse(process.argv)
