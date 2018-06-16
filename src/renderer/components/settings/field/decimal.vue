<template>
    <label>
        {{ field.display || field.name }}
        <input
            type="number"
            :name="field.name"
            :value="value"
            :min="field.min"
            :max="field.max"
            @change="$emit('value-change', $event.target.value)"
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
