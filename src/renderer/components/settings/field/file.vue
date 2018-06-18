<template>
    <label>
        {{ field.display || field.name }}
        <input
            type="file"
            :name="field.name"
            :minLength="field.minLength"
            :maxLength="field.maxLength"
            :value="value"
            @change="$emit('value-change', $event.target.value)"
        />
    </label>
</template>

<script>
  export default {
    name: 'file-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
