'use strict'

const crypto = require('crypto')

const PASSWORD_RANDOM_BYTES_COUNT = 6

exports.getDefaultValue = function (field) {
  if (field.type === 'password') {
    const salt = crypto.randomBytes(PASSWORD_RANDOM_BYTES_COUNT)
      .toString('base64')
    const hashedPassword = crypto.createHash('sha256')
      .update(field.default + salt)
      .digest('base64')
    return { hash: hashedPassword, salt }
  } else {
    return field.default
  }
}

exports.getUpdatedValue = function (field, value) {
  if (field.type === 'password') {
    const salt = crypto.randomBytes(PASSWORD_RANDOM_BYTES_COUNT)
      .toString('base64')
    const hashedPassword = crypto.createHash('sha256')
      .update(value + salt)
      .digest('base64')
    return { hash: hashedPassword, salt }
  } else {
    return value
  }
}
