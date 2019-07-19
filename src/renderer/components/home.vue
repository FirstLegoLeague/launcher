<template>
  <div>
    <div class="ui grid container">
      <div class="row">
        <div class="ui padded grid">
          <div class="row">
            <div id="challenge" class="two wide column"></div>
            <div class="twelve wide column">
              <div class="ui huge center aligned header">Tournament Management System</div>
            </div>
            <div id="fll" class="two wide right aligned column"></div>
          </div>
          <div class="row">
            <div class="ui centered raised link cards" @click="event => openSite(event, module.site)">
              <div v-for="module in modules" class="card">
                <div class="content">
                  <div class="ui header">{{module.name}}</div>
                </div>
                <div class="center aligned content">
                  <qrcode :value="module.site"></qrcode>
                </div>
                <div class="extra content">
                  <a>{{module.site}}</a>
                  <div class="ui right floated icon primary button" @click="() => saveInClipboard(module.site)">
                    <i class="ui copy icon"></i>
                    <span class="hover text">Copy link</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  background-size: auto 90%;
  background-position: center;
  background-repeat: no-repeat;
}
#fll {
  background-size: auto 90%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
