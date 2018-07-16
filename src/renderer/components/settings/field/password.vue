<template>
  <div>
    {{ field.display || field.name }}
    <button @click="toggleEditing"></button>
    <div v-if="editing">
      <label>
        <input
          :type="inputType"
          :name="field.name"
          :minLength="field.minLength"
          :maxLength="field.maxLength"
          v-model="value"
        />
      </label>
      <button @click="toggleShow"></button>
      <button @click="$emit('value-change', value)"></button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'password-field',
    props: ['field'],
    data: function () {
      return {
        inputType: 'password',
        editing: false,
        value: ''
      }
    },
    methods: {
      toggleEditing () {
        this.value = ''
        this.editing = !this.editing
      },
      toggleShow () {
        this.inputType = (this.inputType === 'password') ? 'text' : 'password'
      }
    }
  }
</script>

<style scoped>

</style>
