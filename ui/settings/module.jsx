'use strict'

const React = require('react')
const Promise = require('bluebird')
const electron = require('electron')
const PropTypes = require('prop-types')

const { Field } = require('./field')

class ModuleSettings extends React.Component {
  constructor (props) {
    super(props)
    this.adapter = electron.remote.require('./main').settingsAdapter

    Promise.all([
      Promise.fromCallback(cb => this.adapter.getModuleConfig(props.name, cb))
        .then(config => this.setState({ config })),
      Promise.fromCallback(cb => this.adapter.getModuleValues(props.name, cb))
        .then(values => this.setState({ values }))
    ])
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        console.error(err)
      })

    this.state = {
      changed: {},
      loading: true
    }
  }

  render () {
    if (this.state.loading) {
      return <h2>Loading...</h2>
    }

    return [<div key={`main`}>
      {this.renderFields(this.getMainGroup().fields)}
    </div>]
      .concat(this.getTitledGroups()
        .map((group, i) => <div key={`group${i}`}>
          <h2>{group.name}</h2>
          {this.renderFields(group.fields)}
        </div>), <button onClick={() => this.save()} key={`submit`}>Save</button>)
  }

  renderFields (fields) {
    return fields.map(f => <Field
      {...f}
      key={f.name}
      value={this.state.values[f.name]}
      onValueChange={this.updateValue.bind(this, f.name)}
    />)
  }

  getMainGroup () {
    return this.state.config.find(g => g.name === undefined) || { fields: [] }
  }

  getTitledGroups () {
    return this.state.config.filter(g => g.name !== undefined)
  }

  updateValue (fieldName, value) {
    this.setState({
      values: Object.assign({}, this.state.values, { [fieldName]: value }),
      changed: Object.assign({}, this.state.changed, { [fieldName]: value })
    })
  }

  save () {
    const changed = this.state.changed
    this.setState({ changed: {} })

    Promise.fromCallback(cb => this.adapter.saveValues(this.props.name, changed, cb))
      .catch(console.error)
  }
}

ModuleSettings.propTypes = {
  name: PropTypes.string
}

exports.ModuleSettings = ModuleSettings
