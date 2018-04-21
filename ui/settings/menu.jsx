'use strict'

const React = require('react')
const PropTypes = require('prop-types')

const { NavLink } = require('react-router-dom')

class SettingsMenu extends React.Component {
  render () {
    return this.props.modules
      .map(name => <NavLink key={name}
        to={`/settings/${name}`}
        activeStyle={{ 'font-weight': 'bold' }}>{name}
      </NavLink>)
  }
}

SettingsMenu.propTypes = {
  modules: PropTypes.arrayOf(PropTypes.string)
}

exports.SettingsMenu = SettingsMenu
