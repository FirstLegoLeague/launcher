const fs = require('fs');
const {resolve, dirname} = require('path');
const {app} = require('electron');
const isDev = require('electron-is-dev');

let logPath;
if (isDev) {
  // during development we want the logs to be accessible in app directory
  // if we used the executable path here, it would put the logs in the directory for electron's executable
  logPath = resolve(app.getAppPath(), 'log')
} else {
  // when packed into an asar file, we want them near the executable so the user has an easy time finding them and sending them to us
  logPath = resolve(dirname(app.getPath('exe')), 'log')
}

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

module.exports = logPath;
