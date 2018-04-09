'use strict'

const caporal = require('caporal')

const { getCaddy } = require('./get-caddy')
const { getMongo } = require('./get-mongo')

caporal
  .description('Download all internals of the launcher')
  .option('--internals-dir, -i <internalsDir>', 'The path to the internals directory')
  .action((args, options) => {
    getCaddy(options.internalsDir)
      .then(() => console.info('Caddy downloaded successfully.'))
      .catch(err => console.error(err))

    getMongo(options.internalsDir)
      .then(() => console.info('Mongo downloaded successfully.'))
      .catch(err => console.error(err))
  })

caporal.parse(process.argv)
