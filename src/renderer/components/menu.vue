<template>
    <div class="top-bar">
        <div class="top-bar-left top-par-page">
            <ul class="menu">
                <router-link tag="li" active-class="is-active" :to="{ name: 'home-page' }"><a>Home</a></router-link>
                <router-link tag="li" active-class="is-active" :to="{ name: 'settings' }"><a>Settings</a></router-link>
                <router-link tag="li" active-class="is-active" :to="{ name: 'credits-page' }"><a>Credits</a></router-link>
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
