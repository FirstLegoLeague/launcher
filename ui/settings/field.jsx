'use strict'

const React = require('react')
const PropTypes = require('prop-types')

class Field extends React.Component {
  render () {
    switch (this.props.type) {
      case 'integer':
      case 'decimal':
        return <label>
          {this.props.display || this.props.name}
          <input
            type={`number`}
            name={this.props.name}
            value={this.props.value}
            min={this.props.min}
            max={this.props.max}
            onChange={e => this.handleChange(e)}
          />
          <br/>
        </label>
      case 'boolean':
        return <label>
          {this.props.display || this.props.name}
          <input
            type={`checkbox`}
            name={this.props.name}
            checked={this.props.value}
            onChange={e => this.handleChange(e)}
          />
          <br/>
        </label>
      case 'string':
        return <label>
          {this.props.display || this.props.name}
          <input
            type={`text`}
            name={this.props.name}
            minLength={this.props.minLength}
            maxLength={this.props.maxLength}
            value={this.props.value}
            onChange={e => this.handleChange(e)}
          />
          <br/>
        </label>
      case 'values':
        return <div>
          <span>{this.props.display || this.props.name}</span>
          {this.props.values.map(v => <label key={v}>
            <input
              type={`radio`}
              name={this.props.name}
              value={v}
              checked={this.props.value === v}
              onChange={e => this.handleChange(e)}
            /> {v}
          </label>)}
        </div>
      default:
        return <span>{this.props.name}</span>
    }
  }

  handleChange (event) {
    this.props.onValueChange(event.target.value)
  }
}

Field.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  display: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  values: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.any,
  onValueChange: PropTypes.func
}

exports.Field = Field
