'use strict'

const Promise = require('bluebird')

const GITHUB_PREFIX = 'github:'
const GITHUB_VERSION_REGEX = /^([^:@%/\s.-][^:@%/\s]*)[/]([^:@\s/%#]+)(?:#(.*))?$/

const USER = 1
const REPO = 2
const REF = 3

exports.GithubResolver = {
  isVersion (version) {
    return version.startsWith(GITHUB_PREFIX) || GITHUB_VERSION_REGEX.test(version)
  },
  resolve (package_, version) {
    const shortVersion = version.startsWith(GITHUB_PREFIX)
      ? version = version.substring(GITHUB_PREFIX.length) : version

    const match = shortVersion.match(GITHUB_VERSION_REGEX)

    if (!match) {
      throw new Error(`The version '${version}' is not a valid github version`)
    }

    if (!match[REF]) {
      throw new Error(`Missing git reference is not supported yet`)
    }

    return Promise.resolve(`https://github.com/${match[USER]}/${match[REPO]}/archive/${match[REF]}.zip`)
  }
}
