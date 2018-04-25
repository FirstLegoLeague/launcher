<template>
  <label>
    {{ field.display || field.name }}
    <input
      type="checkbox"
      :name="field.name"
      :checked="value"
    />
  </label>
</template>

<script>
  export default {
    name: 'boolean-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
