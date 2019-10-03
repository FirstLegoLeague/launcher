const fs = require('fs')
const path = require('path')

function getGitCommit () {
  try {
    const gitHead = fs.readFileSync(path.resolve('./.git/HEAD'), 'utf8').trim()
    return fs.readFileSync(path.resolve('./.git', gitHead.substring('ref: '.length)), 'utf8').trim()
  } catch (e) {
    console.error('WARNING: Error getting current git commit')
  }
}

function getDefaultVersionObject () {
  return {
    semver: 'snapshot',
    timestamp: Date.now(),
    commit: getGitCommit() || 'NA'
  }
}

if (process.env.NODE_ENV !== 'development') {
  Object.assign(exports, JSON.parse(fs.readFileSync(path.resolve('./version.json'))))
} else {
  Object.assign(exports, getDefaultVersionObject())
}
