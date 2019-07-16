<template>
    <div id="settings-menu" class="ui large secondary menu">
        <router-link v-for="module in Object.keys(modules)"
                     tag="a"
                     class="item"
                     active-class="active"
                     :to="{ name: 'settings-module', params: { module } }"
                     :key="module">
            {{ modules[module] }}
        </router-link>
        <router-link tag="a"
                     class="item"
                     active-class="active"
                     :to="{ name: 'settings-advanced' }"
                     key="settings">
            advanced
        </router-link>
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
