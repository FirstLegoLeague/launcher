'use strict'

const React = require('react')
const PropTypes = require('prop-types')

exports.IntegerField = function IntegerField (props) {
  return <label>
    {props.display || props.name}
    <input
      type={`number`}
      name={props.name}
      value={props.value}
      min={props.min}
      max={props.max}
      onChange={e => props.onValueChange(e.target.value)}
    />
    <br/>
  </label>
}

exports.IntegerField.propTypes = {
  name: PropTypes.string,
  display: PropTypes.string,
  value: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onValueChange: PropTypes.func
}
