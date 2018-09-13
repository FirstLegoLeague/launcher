<template>
    <div class="top-bar">
        <div class="top-bar-left">
            <ul class="menu">
              <router-link tag="li" active-class="is-active" :to="{ name: 'home-page' }">
                <a><i class="fas fa-home"></i>&nbsp;Home</a>
              </router-link>
              <router-link tag="li" active-class="is-active" :to="{ name: 'settings' }">
                <a><i class="fas fa-cogs"></i>&nbsp;Settings</a>
              </router-link>
              <router-link tag="li" active-class="is-active" :to="{ name: 'about-page' }">
                <a><i class="fas fa-info-circle"></i>&nbsp;About</a>
              </router-link>
            </ul>
        </div>
        <div class="top-bar-right">
          <ul class="menu">
            <li><a @click="event => openSite(event, this.helpLink)"><i class="fas fa-question-circle"></i>&nbsp;Help</a></li>
          </ul>
        </div>
    </div>
</template>

<script>
  import Promise from 'bluebird'

  export default {
    name: 'main-menu',
    methods: {
      openSite (event, site) {
        event.preventDefault()

        Promise.fromCallback(cb => this.adapter.openSite(site, cb))
          .catch(err => {
            console.error(err)
          })
      }
    },
    mounted () {
      this.adapter = this.$electron.remote.require('./main').homeAdapter
      this.helpLink = 'https://github.com/FirstLegoLeague/Launcher/blob/user-guide/docs/userguide.md#first-lego-league-tms-user-guide'
    }
  }
</script>

<style scoped>
  .router-link-active {
    font-weight: bold
  }
</style>
