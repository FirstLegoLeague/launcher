<template>
    <div>
        <ul class="menu">
            <li v-for="module in modules">
                <router-link active-class="is-active" :to="{ name: 'settings-module', params: { module } }"
                             :key="module">
                    {{ module }}
                </router-link>
            </li>
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
    .router-link-active {
        font-weight: bold
    }
</style>
