'use strict'

const { app, Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const url = require('url')


function getIcon() {
    let iconFilename

    if (process.platform === 'win32') {
        iconFilename = 'icon-win.ico'
    }
    else {
        iconFilename = 'icon-linux.png'
    }

    return nativeImage.createFromPath(path.join(__dirname, 'images', iconFilename))
}

let tray = null
app.on('ready', () => {

    tray = new Tray(getIcon())
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Item1', type: 'radio'},
        {label: 'Item2', type: 'radio'},
        {label: 'Item3', type: 'radio', checked: true},
        {label: 'Item4', type: 'radio'}
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})
