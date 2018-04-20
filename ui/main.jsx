'use strict'

const React = require('react')
const { Switch, Route } = require('react-router')

const { Menu } = require('./menu')
const { Home } = require('./home')
const { Settings } = require('./settings')

exports.Main = class Main extends React.Component {
  render () {
    return <div>
      <Menu/>
      <Switch>
        <Route exact path={'/'} component={Home}/>
        <Route path={'/settings'} component={Settings}/>
      </Switch>
    </div>
  }
}
