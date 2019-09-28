<template>
  <div class="ui one column padded grid">
    <div class="column">
      <div class="ui center aligned segment">
        <div class="ui grid">
          <div id="challenge" class="three wide column"></div>
          <div class="ten wide column">
            <h2 class="ui header">
              Tournament Management System
              <span class="sub header">v2019.1.0 Alpha</span>
            </h2>
          </div>
          <div id="fll" class="three wide column"></div>
        </div>
      </div>
      <div class="ui five cards">
        <div v-for="module in modules" class="card">
          <div class="content">
            <a class="header" @click="event => openSite(event, module.site)" :href="module.site">
              {{module.name}}
            </a>
            <div class="ui divider"></div>
            <div class="description">
              <qrcode :value="module.site"></qrcode>
            </div>
            <a class="meta" @click="event => openSite(event, module.site)" :href="module.site">
              {{module.site}}
            </a>
          </div>
          <div class="extra content">
            <div class="ui button" @click="() => saveInClipboard(module.site)">
              <i class="copy icon"></i>
              Copy link
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Promise from 'bluebird'

  export default {
    name: 'HomePage',
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
    background-image: url('../../../node_modules/@first-lego-league/user-interface/current/assets/images/challenge_logo_horizontal.png');
    background-size: 90% auto;
    background-position: center;
    background-repeat: no-repeat;
  }

  #fll {
    background-image: url('../../../node_modules/@first-lego-league/user-interface/current/assets/images/fll_logo_wide.png');
    background-size: 90% auto;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
