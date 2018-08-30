<template>
    <div class="grid-container fluid text-center">
        <div class="grid-x grid-padding-y">
          <div class="cell small-2">
              <img src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/challenge_logo.png">
          </div>
          <div class="cell small-8">
              <h2>Tournament Management System</h2>
              <h4>v2018.1-alpha-6</h4>
          </div>
          <div class="cell small-2">
              <img src="../../../node_modules/@first-lego-league/user-interface/current/assets/img/fll_logo_tall.png">
          </div>
        </div>
        <div class="grid-x grid-padding-y">
          <div class="cell grid-y grid-padding-x">
            <div class="cell grid-x grid-margin-x">
              <div v-for="module in modules" class="cell small-3 grid-y card">
                  <div class="cell card-section text-left">{{module.name}}</div>
                  <div class="cell"><qrcode :value="module.site"></qrcode></div>
                  <div class="cell card-section">
                    <a @click="event => openSite(event, module.site)" :href="module.site">{{module.site}}</a>
                    <button class="button small" @click="() => saveInClipboard(module.site)"><i class="fas fa-copy"></i></button>
                  </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  import Promise from 'bluebird'
  import VueQrcode from '@xkeshi/vue-qrcode';
  
  export default {
    name: 'HomePage',
    components: { VueQrcode },
    methods: {      openSite (event, site) {
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
