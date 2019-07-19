<template>
    <div class="ui toggle checkbox">
        <input
            type="checkbox"
            class="switch-input tiny"
            :id="field.name+'-id'"
            :name="field.name"
            :checked="value"
            @change="$emit('value-change', $event.target.checked)"
        />

        <label class="switch-paddle" :for="field.name+'-id'">
            <span class="show-for-sr">{{ field.display || field.name }}</span>
        </label>
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
