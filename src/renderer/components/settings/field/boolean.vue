<template>
    <div class="grid-x grid-padding-x">
        <div class="switch">
            <label :for="field.name+'-id'" class="text-right middle">
                {{ field.display || field.name }}

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
            </label>
        </div>
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
