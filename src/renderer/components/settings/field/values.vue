<template>
    <div>
        <div class="inline fields">
            <label :for="field.name">{{ field.display || field.name }}:</label>
            <template v-if="field.values.length <= 5">
                <div v-for="v in field.values" class="field">
                    <sui-checkbox radio
                                  :name="field.name"
                                  :value="v"
                                  :input-value="value"
                                  :label="field.texts ? field.texts[v] : v"
                                  @change="newValue => newValue && $emit('value-change', newValue)" />
                </div>
            </template>
            <sui-dropdown v-else
                          selection
                          v-model="current"
                          :options="field.values.map(v => ({ value: v, text: field.texts ? field.texts[v] : v }))"
                          @input="v => $emit('value-change', v)" />
        </div>
    </div>
</template>

<script>
  export default {
    name: 'values-field',
    props: ['field', 'value'],
    data () {
      return {
        current: this.value
      }
    }
  }
</script>

<style scoped>

</style>
