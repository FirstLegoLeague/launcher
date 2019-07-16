<template>
    <div>
        <div class="inline fields">
            <label :for="field.name">{{ field.display || field.name }}:</label>
            <template v-if="field.values.length <= 5">
                <div v-for="v in field.values" class="field">
                    <sui-checkbox radio
                                  :name="field.name"
                                  :value="v"
                                  :checked="value === v"
                                  :label="field.texts ? field.texts[v] : v"
                                  @change="$event.target.checked && $emit('value-change', $event.target.value)" />
                </div>
            </template>
            <sui-dropdown v-else
                          selection
                          :value="value"
                          :options="field.values.map(v => ({ value: v, text: field.texts ? field.texts[v] : v }))"
                          @change="$emit('value-change', $event.target.value)" />
        </div>
    </div>
</template>

<script>
  export default {
    name: 'values-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
