<template>
  <div class="ui page menu">
    <router-link class="link icon item" active-class="active" :to="{ name: 'home-page' }">
      <i class="home icon"></i>
      <div class="hover text">Home</div>
    </router-link>
    <router-link class="link icon item" active-class="active" :to="{ name: 'settings' }">
      <i class="cogs icon"></i>
      <div class="hover text">Settings</div>
    </router-link>
    <router-link class="link icon item" active-class="active" :to="{ name: 'about-page' }">
      <i class="info circle icon"></i>
      <div class="hover text">About</div>
    </router-link>
    <div class="right aligned menu">
      <div class="link icon item" @click="event => openSite(event, this.helpLink)">
        <i class="question icon"></i>
        <div class="hover text">Help</div>
      </div>
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
  .ui.page.menu {
    margin: 0;
  }
</style>
