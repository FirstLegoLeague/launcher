'use strict'

const React = require('react')
const { Switch, Route } = require('react-router')
const electron = require('electron')

const { SettingsMenu } = require('./menu')
const { ModuleSettings } = require('./module')

class Settings extends React.Component {
  constructor (props) {
    super(props)
    electron.remote.require('./main').server.getModules()
      .then(modules => {
        console.log('MODULES', modules)
        this.setState({ modules })
      })
      .catch(err => console.error(err))

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
          render={({ match }) => this.renderModuleSettings(match.params.module)} />
      </Switch>
    </div>
  }

  renderModuleSettings (moduleName) {
    const module = this.state.modules.find(m => m.name === moduleName)
    return <ModuleSettings module={module} />
  }
}

exports.Settings = Settings
