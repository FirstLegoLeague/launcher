<template>
  <div id="app">
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
  /* CSS */
</style>
