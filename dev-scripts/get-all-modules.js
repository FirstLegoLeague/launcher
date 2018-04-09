'use strict'

const Promise = require('bluebird')
const caporal = require('caporal')

const { getNpmModule } = require('./get-npm-module')

caporal
  .description('Download all internals of the launcher')
  .option('--modules-dir, -m <modulesDir>', 'The path to the modules directory')
  .action((args, options) => {
    Promise.all([
      getNpmModule(options.modulesDir, { name: 'mhub', package: 'mhub', version: '0.9.1' })
    ])
      .then(() => console.info('All modules downloaded successfully.'))
      .catch(err => console.error(err))
  })

caporal.parse(process.argv)
