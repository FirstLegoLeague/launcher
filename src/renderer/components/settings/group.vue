<template>
    <div>
        <h2 v-if="group.name">{{ group.name }}</h2>
        <Field v-for="field in group.fields"
               :field="field"
               :value="values[field.name]"
               :key="field.name"
               @value-change="v => $emit('value-change', field.name, v)"
        />
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
