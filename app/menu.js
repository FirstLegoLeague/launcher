'use strict'

const {Menu} = require('electron')
const {shell} = require('electron')
const ip = require('ip')
const clipboard = require('clipboardy')
const window = require('./window')

exports.buildAppMenu = modulesPromise => {
  return modulesPromise
    .reduce((menuItems, module) => {
      if (module.link) {
        return menuItems.concat({
          label: module.name,
          type: 'normal',
          click: () => {
            shell.openExternal(module.link)
          }
        })
      } else {
        return menuItems
      }
    }, [])
    .then(modules => {
      const ipAddress = ip.address()

      return Menu.buildFromTemplate(modules.concat([
        {type: 'separator'},
        {
          label: 'Open Window',
          type: 'normal',
          click: () => {
            // if window allready exists show it otherwise create a new one
            if (!window.mainWindow) {
              window.buildMainWindow()
            } else {
              window.mainWindow.restore()
              window.mainWindow.show()
            }
          }
        },
        {type: 'separator'},
        {
          label: `IP: ${ipAddress}`,
          type: 'normal',
          click: () => {
            clipboard.write(ipAddress)
              .catch(err => {
                console.error(err)
              })
          }
        },
        {label: 'Quit', type: 'normal', role: 'quit'}
      ]))
    })
}
