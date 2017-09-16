'use strict'

const { app, Tray } = require('electron')

const path = require('path')

const { buildAppMenu } = require('./menu')
const { buildMainWindow } = require('./window')
const { Server } = require('./server')

function getIcon () {
  return path.join(__dirname, 'images', 'icon.png')
}

let server = null
let tray = null
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
    });
  buildMainWindow();
})

app.on('before-quit', () => {
  server.close()
})
