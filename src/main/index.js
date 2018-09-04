'use strict'

require('./static') // Must run before everything

const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')
const { app, BrowserWindow, protocol, dialog } = require('electron')

const { Server } = require('./server')
const { SettingsAdapter } = require('./adapters/settings')
const { HomeAdapter } = require('./adapters/home')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

let server = null

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    width: 1000,
    title: 'FIRST LEGO League Tournament Management System',
    useContentSize: true
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', e => {
    const choice = dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'Cancel'],
      title: 'Quit?',
      message: 'Are you sure you want to close the FIRST LEGO League TMS?\nNote: All data will be available next time you open the app.'
    })

    if (choice === 1) {
      e.preventDefault()
    } else {
      const serverClosePromise = server ? server.close() : Promise.resolve()
      serverClosePromise
        .finally(app.quit())
        .catch(err => console.error(err))
    }
  })
}

// function getIcon () {
//   return path.join(__static, 'img', 'first-favicon.ico')
// }

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
    protocol.interceptFileProtocol('file', (request, callback) => {
      if (request.url.includes('webfonts')) {
        callback(fs.createReadStream(decodeURIComponent(request.url.replace(/.+webfonts/, path.join(__static, '/webfonts')))))
      } else {
        callback(fs.createReadStream(decodeURIComponent(request.url.substr(8)).replace(/#.+/, '')))
      }
    }, err => {
      if (err) console.error('Failed to register protocol')
    })
    // Commented out, because of current bug in electron logging.
    // TODO solve this.
    // For reference: https://github.com/electron/electron/issues/683
    // process.stdout.pipe(stream)
    // process.stderr.pipe(stream)
    server = new Server(path.join(process.cwd(), 'modules.yml'))
    exports.server = server

    exports.settingsAdapter = new SettingsAdapter(server.moduleConfigurator, server.globalConfigurator)
    exports.homeAdapter = new HomeAdapter(server)

    server.start()
      .then(() => buildAppMenu(server.getModules()))
      // .then(appMenu => {
      //   const tray = new Tray(getIcon())
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
