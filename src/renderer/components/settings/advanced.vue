<template>
  <div id="settings-global" v-bind:class="{ loading: loading }">
    <div class="dimmer">
      <div class="large slow loader"></div>
    </div>
    <div v-if="!loading">
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
        <div class="text-center">
          <button class="button" @click="save"><i class="fas fa-save"></i>&nbsp;Save</button>
        </div>
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
