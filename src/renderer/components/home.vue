<template>
    <div class="text-center">
        <div class="clearfix">
            <img class="float-left" src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/challenge_logo.png">
            <img class="float-right" src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/fll_logo_wide.png">
        </div>

        <h1>Tournament Management System</h1>

        <button class="button" @click="saveLogs">Save Logs</button>
    </div>
</template>

<script>
  import Promise from 'bluebird'

  export default {
    name: 'HomePage',
    methods: {
      saveLogs () {
        this.dialog.showSaveDialog({
          title: 'Save logs',
          defaultPath: 'logs.zip',
          filter: [{ name: 'zip', extensions: ['zip'] }]
        }, filePath => {
          Promise.fromCallback(cb => this.adapter.saveLogs(filePath, cb))
            .then(() => this.dialog.showMessageBox({
              type: 'info',
              buttons: ['Ok'],
              message: 'Logs saved'
            }))
            .catch(err => {
              this.dialog.showMessageBox({
                type: 'error',
                buttons: ['Ok'],
                message: 'Error in saving logs'
              })
              console.error(err)
            })
        })
      }
    },
    mounted () {
      this.dialog = this.$electron.remote.dialog
      this.adapter = this.$electron.remote.require('./main').homeAdapter
    }
  }
</script>

<style scoped>

</style>
