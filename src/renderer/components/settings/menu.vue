<template>
    <div id="settings-menu" class="ui padded one column grid">
        <div class="row">
            <div class="column">
                <div class="ui compact menu">
                    <router-link class="icon link item" v-for="module in Object.keys(modules)" active-class="active" :to="{ name: 'settings-module', params: { module } }"
                        :key="module">
                        {{ modules[module] }}
                    </router-link>
                    <router-link class="icon link item" active-class="active" :to="{ name: 'settings-advanced' }"
                        key="settings">
                        advanced
                    </router-link>
                </div>
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
