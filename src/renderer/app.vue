<template>
  <div id="app" class="fll tile-background">
    <MainMenu></MainMenu>
    <div id="content">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import MainMenu from './components/menu'

  export default {
    name: 'app',
    components: { MainMenu }
  }
</script>

<style>
  #app {
    min-height: 100vh;
    background-attachment: fixed;
  }

  #content {
    padding-bottom: 1rem;
    height: calc(100vh - 3rem);
  }
</style>
