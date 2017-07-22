'use strict'

const path = require('path')
const { fork } = require('child_process')

exports.Server = class {

    start() {
        this.process = fork(path.join(__dirname, '../modules/fllscoring/localserver'))
    }

    close() {
        this.process.kill()
    }

}