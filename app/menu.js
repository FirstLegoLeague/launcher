'use strict'

const { Menu } = require('electron')
const opn = require('opn')

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
      return Menu.buildFromTemplate(modules.concat([
        { type: 'separator' },
        { label: 'Quit', type: 'normal', role: 'quit' }
      ]))
    })
}
