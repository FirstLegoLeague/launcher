<template>
  <div>
      <h3 v-if="loading">Loading...</h3>
      <div v-else>
          <SettingsGroup :group="mainGroup"
                         :values="values"
                         @value-change="updateValue"
          />
          <SettingsGroup v-for="group in titledGroups"
                         :group="group"
                         :values="values"
                         :key="group.name"
                         @value-change="updateValue"
          />
          <button @click="save">Save</button>
      </div>
  </div>
</template>

<script>
  import Promise from 'bluebird'

  import SettingsGroup from './group'

  export default {
    name: 'module',
    props: ['module'],
    components: { SettingsGroup },
    data () {
      return {
        config: {},
        changedValues: {},
        loading: true
      }
    },
    computed: {
      mainGroup () {
        return this.config.find(g => g.name === undefined) || { fields: [] }
      },
      titledGroups () {
        return this.config.filter(g => g.name !== undefined)
      }
    },
    methods: {
      updateValue (fieldName, newValue) {
        this.values[fieldName] = newValue
        this.changedValues[fieldName] = newValue
      },
      save () {
        const changedValues = this.changedValues
        this.changedValues = {}

        Promise.fromCallback(cb => this.adapter.saveValues(this.module, changedValues, cb))
          .then(() => window.alert('Settings Saved!'))
          .catch(console.error)
      },
      fetchConfig (moudleName) {
        return Promise.all([
          Promise.fromCallback(cb => this.adapter.getModuleConfig(moudleName, cb))
            .then(config => { this.config = config }),
          Promise.fromCallback(cb => this.adapter.getModuleValues(moudleName, cb))
            .then(values => { this.values = values })
        ])
          .then(() => { this.loading = false })
      }
    },
    mounted () {
      this.adapter = this.$electron.remote.require('./main').settingsAdapter
    },
    beforeRouteEnter (to, from, next) {
      next(vm => vm.fetchConfig(vm.module)
        .catch(err => {
          console.error(err)
        }))
    },
    beforeRouteUpdate (to, from, next) {
      this.loading = true

      this.fetchConfig(to.params.module)
        .catch(err => {
          console.error(err)
        })

      next()
    }
  }
</script>

<style scoped>
</style>
