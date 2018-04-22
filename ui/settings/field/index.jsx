'use strict'

const React = require('react')
const PropTypes = require('prop-types')

const { IntegerField } = require('./integer')
const { DecimalField } = require('./decimal')
const { BooleanField } = require('./boolean')
const { StringField } = require('./string')
const { ValuesField } = require('./values')

class Field extends React.Component {
  render () {
    switch (this.props.type) {
      case 'integer':
        return <IntegerField {...this.props}/>
      case 'decimal':
        return <DecimalField {...this.props}/>
      case 'boolean':
        return <BooleanField {...this.props}/>
      case 'string':
        return <StringField {...this.props}/>
      case 'values':
        return <ValuesField {...this.props}/>
      default:
        return <span><b>Error</b>{this.props.name}</span>
    }
  }
}

Field.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  onValueChange: PropTypes.func
}

exports.Field = Field
