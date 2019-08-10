<template>
    <div class="field">
        <sui-checkbox toggle
                      :label="field.display || field.name"
                      :name="field.name"
                      :input-value="value"
                      @change="v => $emit('value-change', v)" />
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
