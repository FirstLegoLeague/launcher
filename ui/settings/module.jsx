'use strict'

const React = require('react')
const PropTypes = require('prop-types')

class ModuleSettings extends React.Component {
  render () {
    return <div>
      <h1>{this.props.module.name}</h1>
    </div>
  }

  getMainGroup () {
    return this.props.module.config.find(g => g.name === undefined)
  }
}

ModuleSettings.propTypes = {
  module: PropTypes.object
}

exports.ModuleSettings = ModuleSettings
