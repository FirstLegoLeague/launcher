<template>
    <div class="ui input">
        <input
            type="text"
            :name="field.name"
            :minLength="field.minLength"
            :maxLength="field.maxLength"
            :value="value"
            @change="$emit('value-change', $event.target.value)"
        />
    </div>
</template>

<script>
  export default {
    name: 'string-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
