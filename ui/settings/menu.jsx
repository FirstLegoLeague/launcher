'use strict'

const React = require('react')
const PropTypes = require('prop-types')

const { NavLink } = require('react-router-dom')

class SettingsMenu extends React.Component {
  render () {
    return this.props.modules
      .map(m => <NavLink key={m.name}
        to={`/settings/${m.name}`}
        activeStyle={{ 'font-weight': 'bold' }}>{m.name}
      </NavLink>)
  }
}

SettingsMenu.propTypes = {
  modules: PropTypes.arrayOf(PropTypes.object)
}

exports.SettingsMenu = SettingsMenu
