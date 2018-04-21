'use strict'

const React = require('react')
const { Switch, Route } = require('react-router')
const electron = require('electron')

const { SettingsMenu } = require('./menu')
const { ModuleSettings } = require('./module')

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.adapter = electron.remote.require('./main').settingsAdapter

    this.adapter.getModulesNames((err, modulesNames) => {
      if (err) {
        console.error(err)
        return
      }

      this.setState({ modules: modulesNames })
    })

    this.state = {
      modules: []
    }
  }

  render () {
    return <div>
      <h1>Settings</h1>
      <SettingsMenu modules={this.state.modules} />
      <Switch>
        <Route exact path={`/settings`} />
        <Route path={`/settings/:module`}
          render={({ match }) => <ModuleSettings name={match.params.module} />} />
      </Switch>
    </div>
  }
}

exports.Settings = Settings
