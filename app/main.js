'use strict'

const { app, Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const opn = require('opn')
const { Server } = require('./server');


function getIcon() {
    return path.join(__dirname, 'images', 'icon.png');
}

let server = null
let tray = null
app.on('ready', () => {

    server = new Server()
    server.start()

    tray = new Tray(getIcon())
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Scoring', type: 'normal', click: () => {
            opn('http://localhost:1390')
        } },
        { type: 'separator'},
        { label: 'Quit', type: 'normal', role: 'quit' }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})

app.on('before-quit', () => {
    server.close()
});
