<template>
    <div id="settings-global">
        <div class="ui container form">
            <template v-if="!loading">
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
            </template>
            <div v-else class="ui placeholder segment">
                <div class="ui icon header">
                    <i class="spinner loading icon"></i>
                    Loading...
                </div>
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
          .then(() => this.toastr.success('Settings saved'))
          .catch(err => {
            console.error(err)
            return this.toastr.error('Settings failed saving')
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
