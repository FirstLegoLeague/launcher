<template>
  <div v-if="fieldComponent" class="field">
    <label>{{ field.display || field.name }}</label>
    <component :is="fieldComponent" v-bind="{ field, value }" @value-change="v => $emit('value-change', v)" />
  </div>
</template>

<script>
  import IntegerField from './integer'
  import DecimalField from './decimal'
  import BooleanField from './boolean'
  import StringField from './string'
  import PasswordField from './password'
  import FileField from './file'
  import ValuesField from './values'

  export default {
    name: 'index',
    props: ['field', 'value'],
    components: {
      IntegerField
    },
    data () {
      let fieldComponent = null

      switch (this.field.type) {
        case 'integer':
          fieldComponent = IntegerField
          break
        case 'boolean':
          fieldComponent = BooleanField
          break
        case 'decimal':
          fieldComponent = DecimalField
          break
        case 'string':
          fieldComponent = StringField
          break
        case 'password':
          fieldComponent = PasswordField
          break
        case 'file':
          fieldComponent = FileField
          break
        case 'values':
          fieldComponent = ValuesField
          break
      }

      return {
        fieldComponent
      }
    }
  }
</script>

<style scoped>

</style>
