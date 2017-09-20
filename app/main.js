'use strict'

const {app, Tray} = require('electron')

const path = require('path')

const {buildAppMenu} = require('./menu')
const window = require('./window')
const {Server} = require('./server')

function getIcon () {
  return path.join(__dirname, 'images', 'icon.png')
}

let server = null
let tray = null

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (window.mainWindow) {
    if (window.mainWindow.isMinimized()) window.mainWindow.restore()
    window.mainWindow.show()
  } else {
    window.buildMainWindow()
  }
})

if (isSecondInstance) {
  app.quit()
} else {
  app.on('ready', () => {
    server = new Server(path.join(process.cwd(), 'modules.yml'))

    server.start()
      .then(() => buildAppMenu(server.getModules()))
      .then(appMenu => {
        tray = new Tray(getIcon())
        const contextMenu = appMenu
        tray.setToolTip('FIRST LEGO League Scoring System')
        tray.setContextMenu(contextMenu)
      })
      .catch(err => {
        console.error(err)
      })
    window.buildMainWindow()
  })

  app.on('before-quit', () => {
    server.close()
  })
}
