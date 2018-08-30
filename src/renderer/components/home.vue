<template>
    <div class="text-center">
        <div class="grid-x">
            <div class="cell small-2">
                <img src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/challenge_logo.png">
            </div>
            <div class="cell small-8">
                <h2>Tournament Management System</h2>
                <h4>v2018.1-alpha-7.1</h4>
            </div>
            <div class="cell small-2">
                <img src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/fll_logo_tall.png">
            </div>
        </div>

        <table style="margin-top: 2em; margin-bottom: 2em;" class="small-8">
            <tbody>
            <tr v-for="module in modules">
                <td style="padding: 0.5em;">{{module.name}}</td>
                <td style="padding: 0.5em;"><a @click="event => openSite(event, module.site)" :href="module.site">{{module.site}}</a></td>
                <td style="padding: 0.5em;"><button class="button tiny" @click="() => saveInClipboard(module.site)">copy</button></td>
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
