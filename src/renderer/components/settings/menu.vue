<template>
    <div id="settings-menu" class="top-bar secondary">
        <ul class="menu">
            <router-link v-for="module in Object.keys(modules)" tag="li" active-class="is-active" :to="{ name: 'settings-module', params: { module } }"
                :key="module">
                <a>{{ modules[module] }}</a>
            </router-link>
            <router-link tag="li" active-class="is-active" :to="{ name: 'settings-advanced' }"
                key="settings">
                <a>advanced</a>
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
