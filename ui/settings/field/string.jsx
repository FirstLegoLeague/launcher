'use strict'

const React = require('react')
const PropTypes = require('prop-types')

exports.StringField = function StringField (props) {
  return <label>
    {props.display || props.name}
    <input
      type={`text`}
      name={props.name}
      minLength={props.minLength}
      maxLength={props.maxLength}
      value={props.value}
      onChange={e => props.onValueChange(e.target.value)}
    />
    <br/>
  </label>
}

exports.StringField.propTypes = {
  name: PropTypes.string,
  display: PropTypes.string,
  value: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  onValueChange: PropTypes.func
}
