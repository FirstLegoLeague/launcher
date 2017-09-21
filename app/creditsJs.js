const path = require('path');
const url = require('url');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

function openCredits() {
    var win = new BrowserWindow({ width: 500, height: 400 });
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'credits.html'),
        protocol: 'file:',
        slashes: true
    }))
}