<template>
    <div class="inline fields">
        <div class="field">
            <label>{{ field.display || field.name }}</label>
            <input
                type="text"
                :name="field.name"
                :minLength="field.minLength"
                :maxLength="field.maxLength"
                :value="value"
                @change="$emit('value-change', $event.target.value)"
            />
        </div>
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
