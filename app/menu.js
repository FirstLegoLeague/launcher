'use strict'

const { Menu } = require('electron')
const opn = require('opn')
const ip = require('ip')
const clipboard = require('clipboardy')

exports.buildAppMenu = modulesPromise => {
  return modulesPromise
    .reduce((menuItems, module) => {
      if (module.link) {
        return menuItems.concat({
          label: module.name,
          type: 'normal',
          click: () => {
            opn(module.link)
          }
        })
      } else {
        return menuItems
      }
    }, [])
    .then(modules => {
      const ipAddress = ip.address()

      return Menu.buildFromTemplate(modules.concat([
        { type: 'separator' },
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
        { label: 'Quit', type: 'normal', role: 'quit' }
      ]))
    })
}
