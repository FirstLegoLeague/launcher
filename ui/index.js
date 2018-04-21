'use strict'

if (process.env.NODE_ENV === 'development') {
  const electronHot = require('electron-hot-loader')
  electronHot.install()
  electronHot.watchJsx(['./**/*.jsx'])
  electronHot.watchCss(['./**/*.css'])
}

require('./index.jsx')
