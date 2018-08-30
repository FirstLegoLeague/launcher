<template>
    <div>
        <SettingsMenu :modules="modules" />
        <div class="top-bar-page">
          <router-view></router-view>
        </div>
    </div>
</template>

<script>
  import Promise from 'bluebird'

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

        Promise.all(modulesNames.map(moudleName => Promise.fromCallback(cb => adapter.getModuleConfig(moudleName, cb))))
          .then(configs => {
            this.modules = modulesNames.filter((module, index) => configs[index].length !== 0)
          })

        this.modules = modulesNames
      })
    }
  }
</script>

<style scoped>

</style>
