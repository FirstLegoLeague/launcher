<template>
  <div id="app">
      <Menu></Menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import Menu from './components/menu'

  export default {
    name: 'app',
    components: { Menu }
  }
</script>


<style>
  /* CSS */
</style>
