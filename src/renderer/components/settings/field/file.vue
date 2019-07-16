<template>
    <div class="inline fields">
        <div class="field">
            <label>{{ field.display || field.name }}</label>
            <input
                type="file"
                :name="field.name"
                :value="value"
                :accept="field.extensions"
                @change="$emit('value-change', $event.target.value)"
            />
        </div>
    </div>
</template>

<script>
  export default {
    name: 'file-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
