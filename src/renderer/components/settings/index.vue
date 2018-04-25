<template>
    <div>
        <h1>Settings</h1>
        <SettingsMenu :modules="modules" />
        <router-view></router-view>
    </div>
</template>

<script>
  import SettingsMenu from './menu'

  export default {
    name: 'settings',
    components: { SettingsMenu },
    data () {
      return {
        modules: []
      }
    },
    mounted () {
      const adapter = this.$electron.remote.require('./main').settingsAdapter

      adapter.getModulesNames((err, modulesNames) => {
        if (err) {
          console.error(err)
          return
        }

        this.modules = modulesNames
      })
    }
  }
</script>

<style scoped>

</style>
