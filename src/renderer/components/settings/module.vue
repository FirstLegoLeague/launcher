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
      }
    },
    mounted () {
      this.adapter = this.$electron.remote.require('./main').settingsAdapter

      Promise.all([
        Promise.fromCallback(cb => this.adapter.getModuleConfig(this.module, cb))
          .then(config => { this.config = config }),
        Promise.fromCallback(cb => this.adapter.getModuleValues(this.module, cb))
          .then(values => { this.values = values })
      ])
        .then(() => { this.loading = false })
        .catch(err => {
          console.error(err)
        })
    }
  }
</script>

<style scoped>
</style>
