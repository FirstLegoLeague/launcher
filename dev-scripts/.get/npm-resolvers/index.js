
const { NpmResolver } = require('./registry')
const { GithubResolver } = require('./github')

const resolvers = [
  NpmResolver,
  GithubResolver
]

exports.resolveUrl = (package_, version) => {
  return resolvers.find(r => r.isVersion(version))
    .resolve(package_, version)
}
