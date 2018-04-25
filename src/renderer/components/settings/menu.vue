<template>
  <div>
      <router-link v-for="module in modules" :to="{ name: 'settings-module', params: { module } }">
          {{ module }}
      </router-link>
  </div>
</template>

<script>
  export default {
    name: 'menu',
    props: [ 'modules' ]
  }
</script>

<style scoped>
  .router-link-active {
    font-weight: bold
  }
</style>
