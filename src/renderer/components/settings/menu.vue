<template>
    <div id="settings-menu" class="top-bar secondary">
        <ul class="menu">
            <router-link tag="li" :exact="true" active-class="is-active" :to="{ name: 'settings' }"
                key="settings">
                <a>home</a>
            </router-link>
            <router-link v-for="module in modules" tag="li" active-class="is-active" :to="{ name: 'settings-module', params: { module } }"
                :key="module">
                <a>{{ module }}</a>
            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {
      name: 'settings-menu',
      props: ['modules']
    }
</script>

<style scoped>
#settings-menu {
    border-bottom: 2px solid lightgray;
}
</style>
