<template>
    <div class="top-bar">
        <div class="top-bar-left top-par-page">
            <ul class="menu">
                <li><router-link active-class="is-active" :to="{ name: 'home-page' }">Home</router-link></li>
                <li><router-link active-class="is-active" :to="{ name: 'settings' }">Settings</router-link></li>
                <li><router-link active-class="is-active" :to="{ name: 'credits-page' }">Credits</router-link></li>
            </ul>
        </div>
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
