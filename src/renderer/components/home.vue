<template>
    <div class="text-center">
        <div class="clearfix">
            <img class="float-left" src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/challenge_logo.png">
            <img class="float-right" src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/fll_logo_wide.png">
        </div>
        <h1>Tournament Management System</h1>

        <table>
            <tbody>
            <tr v-for="module in modules">
                <td>{{module.name}}</td>
                <td class="text-left"><a @click="event => openSite(event, module.site)" :href="module.site">{{module.site}}</a></td>
                <td class="align-left text-left"><button class="button" @click="() => saveInClipboard(module.site)">copy</button></td>
            </tr>
            </tbody>
        </table>

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
      },
      openSite (event, site) {
        event.preventDefault()

        Promise.fromCallback(cb => this.adapter.openSite(site, cb))
          .catch(err => {
            console.error(err)
          })
      },
      saveInClipboard (site) {
        this.clipboard.writeText(site)
      }
    },
    data () {
      return {
        modules: []
      }
    },
    mounted () {
      this.dialog = this.$electron.remote.dialog
      this.clipboard = this.$electron.remote.clipboard
      this.adapter = this.$electron.remote.require('./main').homeAdapter

      Promise.all([
        Promise.fromCallback(cb => this.adapter.getPortsAllocation(cb)),
        Promise.fromCallback(cb => this.adapter.getIp(cb))
      ])
        .then(([portsAllocation, ip]) => {
          this.modules = Object.entries(portsAllocation)
            .map(([module, port]) => ({
              name: module,
              site: `http://${ip}:${port}/`
            }))
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
</script>

<style scoped>

</style>
