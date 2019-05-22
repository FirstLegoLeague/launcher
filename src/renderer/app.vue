<template>
  <div id="app">
    <MainMenu></MainMenu>
    <router-view class="top-bar-page"></router-view>
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
