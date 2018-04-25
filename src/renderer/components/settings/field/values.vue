<template>
    <div>
        {{ field.display || field.name }}:
        <label v-for="v in field.values">
        <input
            type="radio"
            :name="field.name"
            :value="v"
            :checked="value === v"
        /> {{ v }}
    </label>
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
