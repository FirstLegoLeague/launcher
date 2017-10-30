'use strict'

const {app, Tray} = require('electron')
const path = require('path')

const {buildAppMenu} = require('./menu')
const window = require('./window')

const {Server} = require('./server')
const logPath = require('./logDirectory')

const rotate = require('rotating-file-stream')

function getIcon () {
  return path.join(__dirname, 'images', 'icon.png')
}

let server = null
let tray = null

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (window.mainWindow) {
    if (window.mainWindow.isMinimized()) {
      window.mainWindow.restore()
      window.mainWindow.show()
    }
  } else {
    window.buildMainWindow()
  }
})

if (isSecondInstance) {
  app.quit()
} else {
  app.on('ready', () => {
    var stream = rotate('launcher', {
      size: '10M',
      interval: '1d',
      path: logPath
    })
    // Commented out, because of current bug in electron logging.
    // TODO solve this.
    // For reference: https://github.com/electron/electron/issues/683
    // process.stdout.pipe(stream)
    // process.stderr.pipe(stream)
    server = new Server(path.join(process.cwd(), 'modules.yml'))
    exports.server = server
    server.start()
      .then(() => buildAppMenu(server.getModules()))
      .then(appMenu => {
        tray = new Tray(getIcon())
        const contextMenu = appMenu
        tray.setToolTip('FIRST LEGO League Scoring')
        tray.setContextMenu(contextMenu)
      })
      .then(() => window.buildMainWindow())
      .catch(err => {
        console.error(err)
      })

  })

  app.on('window-all-closed', event => { // this prevents the app from trying to quit when you close the main window
    event.preventDefault()
  })

  app.on('before-quit', () => {
    if (window.mainWindow) {
      window.mainWindow.destroy() // prevents it from showing any closing dialog
    }
    server.close()
  })
}
