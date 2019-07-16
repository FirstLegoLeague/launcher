<template>
    <div>
        <SettingsMenu :modules="modules" />
        <div>
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

      Promise.fromCallback(cb => adapter.getModulesDisplayNames(cb))
        .then(dispalyNames => {
          return Promise.all(Object.keys(dispalyNames))
            .filter(moudleName => Promise.fromCallback(cb => adapter.getModuleConfig(moudleName, cb))
              .then(config => config.length !== 0))
            .then(modulesNames => {
              this.modules = modulesNames
                .map(moduleName => ({ [moduleName]: dispalyNames[moduleName] }))
                .reduce((object, keyValue) => Object.assign(object, keyValue), {})
            })
        }).catch(err => {
          console.error(err)
        })
    }
  }
</script>

<style scoped>

</style>
