<template>
    <div class="top-bar">
        <div class="top-bar-left top-par-page">
            <ul class="menu">
              <router-link tag="li" active-class="is-active" :to="{ name: 'home-page' }">
                <a><i class="fas fa-home"></i>&nbsp;Home</a>
              </router-link>
              <router-link tag="li" active-class="is-active" :to="{ name: 'settings' }">
                <a><i class="fas fa-cogs"></i>&nbsp;Settings</a>
              </router-link>
              <router-link tag="li" active-class="is-active" :to="{ name: 'about-page' }">
                <a><i class="fas fa-info-circle"></i>&nbsp;About</a>
              </router-link>
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
