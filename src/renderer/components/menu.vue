<template>
    <div>
        <router-link :to="{ name: 'settings' }">Settings</router-link>
        <!--<router to={`/settings`} activeStyle={{ 'font-weight': 'bold' }}>Settings</a>-->
    </div>
</template>

<script>
  export default {
    name: 'menu'
  }
</script>

<style scoped>
  .router-link-active {
    font-weight: bold
  }
</style>
