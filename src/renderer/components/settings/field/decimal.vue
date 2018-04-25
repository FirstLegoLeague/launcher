<template>
    <label>
        {{ field.display || field.name }}
        <input
            type="number"
            :name="field.name"
            :value="field.value"
            :min="field.min"
            :max="field.max"
        />
    </label>
</template>

<script>
  export default {
    name: 'decimal-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
