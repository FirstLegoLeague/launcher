'use strict'

const React = require('react')
const PropTypes = require('prop-types')

exports.ValuesField = function ValuesField (props) {
  return <div>
    <span>{props.display || props.name}</span>
    {props.values.map(v => <label key={v}>
      <input
        type={`radio`}
        name={props.name}
        value={v}
        checked={props.value === v}
        onChange={e => props.onValueChange(e.target.value)}
      /> {v}
    </label>)}
  </div>
}

exports.ValuesField.propTypes = {
  name: PropTypes.string,
  display: PropTypes.string,
  value: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string),
  onValueChange: PropTypes.func
}
