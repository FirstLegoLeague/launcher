<template>
  <div>
    {{ field.display || field.name }}
    <button @click="toggleEditing">Edit</button>
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
      <button @click="toggleShow">{{ isShowingPassword ? 'hide' : 'show' }}</button>
      <button @click="$emit('value-change', value)">Change</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'password-field',
    props: ['field'],
    data: function () {
      return {
        isShowingPassword: false,
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
        this.isShowingPassword = !this.isShowingPassword
        this.inputType = (this.inputType === 'password') ? 'text' : 'password'
      }
    }
  }
</script>

<style scoped>

</style>
