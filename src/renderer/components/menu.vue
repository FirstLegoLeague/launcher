<template>
    <div class="ui huge secondary menu">
        <router-link class="item" active-class="active" :to="{ name: 'home-page' }">
            <i class="home icon"></i>&nbsp;Home
        </router-link>
        <router-link class="item" active-class="active" :to="{ name: 'settings' }">
            <i class="cogs icon"></i>&nbsp;Settings
        </router-link>
        <router-link class="item" active-class="active" :to="{ name: 'about-page' }">
            <i class="info circle icon"></i>&nbsp;About
        </router-link>
        <div class="right menu">
            <a class="item" @click="event => openSite(event, this.helpLink)">
                <i class="question circle icon"></i>&nbsp;Help
            </a>
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
