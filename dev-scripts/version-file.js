
const caporal = require('caporal')
const fs = require('fs')
const path = require('path')

caporal
  .name('version-file')
  .version('v1')
  .option('--commit, -c <commit>', 'The git commit of the version')
  .option('--ts <timestamp>', 'The timestamp of the build')
  .option('--output <output>', 'The output file')
  .argument('<semver>', 'The semver version for the file')
  .action((args, options) => {
    const timestamp = (options.ts) ? Number(options.ts) : Date.now()

    if (Number.isNaN(timestamp)) {
      console.error('ERROR: timestamp should be in unix timestamp format')
      return
    }

    fs.writeFileSync(path.resolve(options.output), JSON.stringify({
      semver: args.semver || 'none',
      timestamp: timestamp,
      commit: options.commit || 'NA'
    }))
  })

caporal.parse(process.argv)
