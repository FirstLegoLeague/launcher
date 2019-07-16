<template>
  <div id="settings-global">
    <div class="ui inverted dimmer" :class="{ active: loading }">
      <div class="ui text loader">Loading</div>
    </div>
    <div class="ui container form" v-if="!loading">
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
      <button class="ui button" @click="save"><i class="save icon"></i>&nbsp;Save</button>
    </div>
  </div>
</template>

<script>
  import Promise from 'bluebird'

  import SettingsGroup from './group'

  export default {
    name: 'settings-advanced',
    props: [],
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

        Promise.fromCallback(cb => this.adapter.saveGlobalValues(changedValues, cb))
          .then(() => new this.Foundation.Notification('Settings saved', 'success'))
          .catch(err => {
            console.error(err)
            return new this.Foundation.Notification('Settings failed saving', 'error')
          })
      }
    },
    mounted () {
      this.adapter = this.$electron.remote.require('./main').settingsAdapter

      Promise.all([
        Promise.fromCallback(cb => this.adapter.getGlobalConfig(cb))
          .then(config => { this.config = config }),
        Promise.fromCallback(cb => this.adapter.getGlobalConfigValues(cb))
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
#settings-global {
  height: 100%;
}
</style>
