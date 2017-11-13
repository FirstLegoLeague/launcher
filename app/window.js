const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const pjson = require('../package.json')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

exports.mainWindow = null
exports.buildMainWindow = () => {
  // Create the browser window.
  exports.mainWindow = new BrowserWindow({width: 600, height: 500, icon: getIcon()})
  // Disable the menubar
  exports.mainWindow.setMenu(null)
  // Setting the window title
  exports.mainWindow.setTitle('FIRST LEGO League scoring v' + pjson.version)
  // and load the index.html of the app.
  exports.mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted after the window is closed, in any way shape or form
  exports.mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    exports.mainWindow = null
  })

  // Emitted before the window is closed by the user or using the the close() function
  exports.mainWindow.on('close', () => {
    // Showing message so people will know its in system tray
    var dialog = electron.dialog
    dialog.showMessageBox({message: 'This window is still available in the tray'})
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', buildMainWindow)

// Quit when all windows are closed.
// app.on('window-all-closed', function () {
//     // On OS X it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })

// app.on('activate', function () {
//     // On OS X it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (mainWindow === null) {
//         createWindow()
//     }
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function getIcon () {
  return path.join(__dirname, 'images', 'icon.png')
}
