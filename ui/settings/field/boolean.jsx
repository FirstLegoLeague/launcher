'use strict'

const React = require('react')
const PropTypes = require('prop-types')

exports.BooleanField = function BooleanField (props) {
  return <label>
    {props.display || props.name}
    <input
      type={`checkbox`}
      name={props.name}
      checked={props.value}
      onChange={e => props.onValueChange(e.target.checked)}
    />
    <br/>
  </label>
}

exports.BooleanField.propTypes = {
  name: PropTypes.string,
  display: PropTypes.string,
  value: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onValueChange: PropTypes.func
}
