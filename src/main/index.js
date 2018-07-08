'use strict'

require('./static') // Must run before everything

const path = require('path')
// const { Tray } = require('electron')
const { app, BrowserWindow } = require('electron')

const { Server } = require('./server')
const { SettingsAdapter } = require('./adapters/settings')
const homeAdapter = require('./adapters/home')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    width: 1000,
    title: 'FIRST LEGO League scoring',
    useContentSize: true
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', () => {
    app.quit()
  })
}

// function getIcon () {
//   return path.join(__dirname, 'images', 'icon.png')
// }

let server = null
// let tray = null

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
  } else {
    createWindow()
  }
})

if (isSecondInstance) {
  app.quit()
} else {
  app.on('ready', () => {
    // Commented out, because of current bug in electron logging.
    // TODO solve this.
    // For reference: https://github.com/electron/electron/issues/683
    // process.stdout.pipe(stream)
    // process.stderr.pipe(stream)
    server = new Server(path.join(process.cwd(), 'modules.yml'))
    exports.server = server

    exports.settingsAdapter = new SettingsAdapter(server.configurator)
    exports.homeAdapter = homeAdapter

    server.start()
      // .then(() => buildAppMenu(server.getModules()))
      // .then(appMenu => {
      //   tray = new Tray(getIcon())
      //   const contextMenu = appMenu
      //   tray.setToolTip('FIRST LEGO League Scoring')
      //   tray.setContextMenu(contextMenu)
      // })
      .then(() => createWindow())
      .catch(err => {
        console.error(err)
      })
  })

  app.on('window-all-closed', event => { // this prevents the app from trying to quit when you close the main window
    event.preventDefault()
  })

  app.on('before-quit', () => {
    if (mainWindow) {
      mainWindow.destroy() // prevents it from showing any closing dialog
    }
    server.close()
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
