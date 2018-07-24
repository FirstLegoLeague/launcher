'use strict'

const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const caporal = require('caporal')
const Promise = require('bluebird')

const config = require('./config.get')

Promise.promisifyAll(fs)

const rimrafAsync = Promise.promisify(rimraf)
const mkdirpAsync = Promise.promisify(mkdirp)

const DEFAULT_CONCURRENCY = 5
const DEFAULT_INTERNALS_DIR = path.join(__dirname, '../internals')
const DEFAULT_MODULES_DIR = path.join(__dirname, '../modules')

function getModule (name, options) {
  const module = config.modules[name]

  if (!options.directory) {
    options.directory = path.join(module.internal ? DEFAULT_INTERNALS_DIR : DEFAULT_MODULES_DIR, name)
  }

  let setupPromise
  if (options.force) {
    console.log(`Cleaning directory of module ${name}...`)
    setupPromise = rimrafAsync(options.directory)
      .then(() => mkdirpAsync(options.directory))
      .return(true)
  } else {
    setupPromise = fs.readdirAsync(options.directory)
      .then(files => files.length === 0)
      .catch(err => {
        if (err.code === 'ENOENT') {
          return mkdirpAsync(options.directory)
            .return(true)
        }
        throw err
      })
  }

  return setupPromise
    .then(downloadModule => {
      if (downloadModule) {
        console.log(`Starting download of module ${name}...`)
        return module.get({
          directory: options.directory,
          platform: options.platform,
          arch: options.arch,
          verbose: options.verbose
        }, Object.assign({}, options.moduleOptions, module.options, { name }))
          .then(() => console.log(`Finish download of module ${name}.`))
      } else {
        console.log(`Skipping download of module ${name}`)
      }
    })
    .tapCatch(() => {
      if (!options.saveBroken) {
        return rimrafAsync(options.directory)
      }
    })
}

function getAll (options) {
  if (options.internalsOnly && options.regularsOnly) {
    throw new Error('Only one of the options (internals-only) and (regular-only) can be presented')
  }

  return Promise.resolve(Object.entries(config.modules))
    .map(([name, module]) => {
      if ((!module.internal && options.internalsOnly) ||
        (module.internal && options.regularsOnly) ||
        (options.excludes.includes(name))) {
        return
      }

      const directory = path.join(module.internal ? options.internalsDir : options.modulesDir, name)

      return getModule(name, {
        directory,
        platform: options.platform,
        arch: options.arch,
        force: options.force,
        verbose: options.verbose,
        saveBroken: options.saveBroken
      })
    }, { concurrency: options.concurrency })
}

caporal
  .name('get')
  .version('v1')
  .description('Get modules relevant for the launcher work')
  .command('all', 'Download all modules for the launcher')
  .option('--platform, -p <platform>', 'Platform for executable', ['win32', 'darwin', 'linux'], process.platform)
  .option('--arch <arch>', 'CPU architecture', ['x32', 'x64'], process.arch)
  .option('--concurrency, -c <concurrency>', 'Number of modules downloaded in the same time',
    caporal.INT, DEFAULT_CONCURRENCY)
  .option('--save-broken', 'Save broken modules', caporal.BOOL, false)
  .option('--force', 'Force downloading the modules')
  .option('--internals-dir, -i <internalsDir>', 'The path to the internals directory', null, DEFAULT_INTERNALS_DIR)
  .option('--modules-dir, -m <modulesDir>', 'The path to the modules directory', null, DEFAULT_MODULES_DIR)
  .option('--internals-only', 'Download only internals', caporal.BOOL, false)
  .option('--regulars-only', 'Download only internals', caporal.BOOL, false)
  .option('--excludes <exclude>', 'Exclude a module', caporal.REPEATABLE, [])
  .action((args, options) => {
    getAll(options)
      .catch(err => {
        console.error(err.message)
        process.exitCode = 1
      })
  })
  .command('module', 'Download one module')
  .argument('<name>', 'The name of the module', Object.keys(config.modules))
  .option('--platform, -p <platform>', 'Platform for executable', ['win32', 'darwin', 'linux'], process.platform)
  .option('--arch <arch>', 'CPU architecture', ['x32', 'x64'], process.arch)
  .option('--save-broken', 'Save broken modules', caporal.BOOL, false)
  .option('--force', 'Force downloading the modules')
  .option('--dir, -d <directory>', 'The path to the internals directory')
  .option('--option <moduleOptions>', 'A option of the module type', /^[a-z]+=/i)
  .action((args, options) => {
    getModule(args.name, options)
      .catch(err => {
        console.error(err.message)
        process.exitCode = 1
      })
  })
  .command('custom', 'Download a custom module')
  .argument('<type>', 'The name of the module', Object.keys(config.custom))
  .option('--platform, -p <platform>', 'Platform for executable', ['win32', 'darwin', 'linux'], process.platform)
  .option('--arch <arch>', 'CPU architecture', ['x32', 'x64'], process.arch)
  .option('--force', 'Force downloading the modules')
  .option('--dir, -d <directory>', 'The path to the internals directory')
  .option('--option <moduleOptions>', 'A option of the module type', /^[a-z]+=/i)
  .action((args, options) => {
    console.log('custom')
    console.log(options)
    console.log(args)
  })

// Make global options
const defaultCmd = caporal._commands[0]
for (const cmd of caporal._commands.slice(1)) {
  cmd._options.unshift(...defaultCmd._options)
}

caporal.parse(process.argv)
