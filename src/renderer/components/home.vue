<template>
    <div class="grid-container fluid text-center">
        <div class="grid-x grid-padding-y">
          <div id="challenge" class="cell small-2"></div>
          <div class="cell small-8">
              <h2>Tournament Management System</h2>
              <h4>v2018.1-beta-1.5</h4>
          </div>
          <div id="fll" class="cell small-2"></div>
        </div>
        <div class="grid-y">
          <div class="cell grid-x grid-margin-x">
            <fieldset v-for="module in modules" class="cell small-3 fieldset">
              <legend class="text-left">
                <a @click="event => openSite(event, module.site)" :href="module.site">{{module.name}}</a>
              </legend>
              <label>
                <div><qrcode :value="module.site"></qrcode></div>
                <a @click="event => openSite(event, module.site)" :href="module.site">{{module.site}}</a>
                <button class="button" @click="() => saveInClipboard(module.site)"><i class="fas fa-copy"></i>&nbsp;Copy link</button>
              </label>
            </fieldset>
          </div>
        </div>
    </div>
</template>

<script>
  import Promise from 'bluebird'
  import VueQrcode from '@xkeshi/vue-qrcode'

  export default {
    name: 'HomePage',
    components: { VueQrcode },
    methods: {
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
      this.clipboard = this.$electron.remote.clipboard
      this.adapter = this.$electron.remote.require('./main').homeAdapter

      Promise.all([
        Promise.fromCallback(cb => this.adapter.getPortsAllocation(cb)),
        Promise.fromCallback(cb => this.adapter.getIp(cb)),
        Promise.fromCallback(cb => this.adapter.getModulesDisplayNames(cb))
      ])
        .then(([portsAllocation, ip, dispalyNames]) => {
          this.modules = Object.entries(portsAllocation)
            .map(([module, port]) => ({
              name: dispalyNames[module],
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
#challenge {
  background-image: url('../../../node_modules/@first-lego-league/user-interface/current/assets/img/challenge_logo.png');
  background-size: auto 90%;
  background-position: center;
  background-repeat: no-repeat;
}
#fll {
  background-image: url('../../../node_modules/@first-lego-league/user-interface/current/assets/img/fll_logo_tall.png');
  background-size: auto 90%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
