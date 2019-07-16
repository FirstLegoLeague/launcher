<template>
    <div class="field">
        <sui-checkbox toggle
                      :label="field.display || field.name"
                      :name="field.name"
                      :checked="value"
                      @change="$emit('value-change', $event.target.checked)" />
    </div>
</template>

<script>
    export default {
      name: 'boolean-field',
      props: ['field', 'value']
    }
</script>

<style scoped>

</style>
