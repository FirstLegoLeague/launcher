<template>
    <div class="grid-x grid-padding-x">
        <div class="cell small-6 switch flex-container align-justify align-middle">
            <label :for="field.name+'-id'">
                {{ field.display || field.name }}
            </label>

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
