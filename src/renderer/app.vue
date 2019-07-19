<template>
  <div id="app" class="fll tile-background">
    <MainMenu></MainMenu>
    <router-view></router-view>
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
    height: 100vh;
  }
</style>
