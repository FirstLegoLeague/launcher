<template>
  <div id="app">
    <MainMenu></MainMenu>
    <router-view style="padding: 1em;"></router-view>
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
