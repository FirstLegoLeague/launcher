<template>
  <div class="row">
    <div class="column">
      <div class="ui container segment">
        <div class="ui large header" v-if="group.name">{{ group.name }}</div>
        <div class="ui form">
          <Field v-for="field in group.fields"
                 :field="field"
                 :value="values[field.name]"
                 :key="field.name"
                 @value-change="v => $emit('value-change', field.name, v)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Field from './field'

  export default {
    name: 'settings-group',
    props: ['group', 'values'],
    components: { Field }
  }
</script>

<style scoped>

</style>
