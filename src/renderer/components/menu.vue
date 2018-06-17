<template>
    <div>
        <router-link :to="{ name: 'home-page' }">Home</router-link>
        <router-link :to="{ name: 'settings' }">Settings</router-link>
        <router-link :to="{ name: 'credits-page' }">Credits</router-link>
    </div>
</template>

<script>
  export default {
    name: 'main-menu'
  }
</script>

<style scoped>
  .router-link-active {
    font-weight: bold
  }
</style>
