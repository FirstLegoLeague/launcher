/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// Must run before everything
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const path = require('path')
const Promise = require('bluebird')
const { app, BrowserWindow, dialog } = require('electron')

const { Server } = require('./server')
const { SettingsAdapter } = require('./adapters/settings')
const { HomeAdapter } = require('./adapters/home')
const { logger } = require('./logs')

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
        .catch(err => logger.error(err))
    }
  })
}

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

    exports.settingsAdapter = new SettingsAdapter(server, server.moduleConfigurator, server.globalConfigurator)
    exports.homeAdapter = new HomeAdapter(server)

    server.start()
      .then(() => createWindow())
      .catch(err => {
        logger.error(err)
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
