<template>
    <label>
        {{ field.display || field.name }}
        <input
            type="text"
            :name="field.name"
            :minLength="field.minLength"
            :maxLength="field.maxLength"
            :value="value"
        />
    </label>
</template>

<script>
  export default {
    name: 'string-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
