<template>
  <div class="module">
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
          .then(() => this.toastr.success('Settings saved'))
          .catch(err => {
            console.error(err)
            return this.toastr.error('Settings failed saving')
          })
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
.module {
  height: 100%;
}
</style>
