/* eslint-disable node/exports-style */

function getGitCommit () {
  try {
    const fs = require('fs')
    const path = require('path')

    const gitHead = fs.readFileSync(path.resolve('./.git/HEAD'), 'utf8').trim()
    return fs.readFileSync(path.resolve('./.git', gitHead.substring('ref: '.length)), 'utf8').trim()
  } catch (e) {
    console.error('WARNING: Error getting current git commit')
  }
}

function getDefaultVersionObject () {
  return {
    semver: process.env.BUILD_VERSION || 'snapshot',
    timestamp: Date.now(),
    commit: process.env.GIT_COMMIT || getGitCommit() || 'N/A'
  }
}

try {
  module.exports = require('../../version.json')
} catch (e) {
  module.exports = getDefaultVersionObject()
}
