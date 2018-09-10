<template>
    <div style="padding: 1em">
        <fieldset class="fieldset">
            <legend>{{ field.display || field.name }}</legend>
            <label v-for="v in field.values">
                <input
                    type="radio"
                    :name="field.name"
                    :value="v"
                    :checked="value === v"
                    @change="$event.target.checked && $emit('value-change', $event.target.value)"
                /> {{ field.descriptions ? field.descriptions[v] : v }}
            </label>
        </fieldset>
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
