'use strict'

// require('../less/main.less');

const React = require('react')
const ReactDOM = require('react-dom')
const { HashRouter } = require('react-router-dom')

const { Main } = require('./main')

ReactDOM.render(<HashRouter><Main/></HashRouter>, document.getElementById('content'))
