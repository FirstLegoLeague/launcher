'use strict'

const React = require('react')
const { NavLink } = require('react-router-dom')

exports.Menu = class Menu extends React.Component {
  render () {
    return <div>
      <NavLink to={`/settings`} activeStyle={{ 'font-weight': 'bold' }}>Settings</NavLink>
    </div>
  }
}
