
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

exports.default = async function (context) {
  if (context.appOutDir.endsWith('/mac')) {
    fs.copyFile(path.resolve(__dirname, './setup/run'), context.appOutDir + '/run', (err) => {
      if (err) throw err
      console.log('The run script was copied to dist/mac.\nCreating the mac.zip...')
      exec('cd ./dist && zip -r -X mac.zip mac', (err) => {
        if (err) throw err
      })
    })
  }
}
