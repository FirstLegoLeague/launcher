<template>
    <div class="ui sub page menu grid">
        <div class="column">
            <div id="settings-menu" class="ui compact menu">
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
        </div>
    </div>
</template>

<script>
    export default {
      name: 'settings-menu',
      props: ['modules']
    }
</script>

<style scoped>
</style>
