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
      <button @click="$emit('value-change', hashedJson(value))"></button>
    </div>
  </div>
</template>

<script>
  import crypto from 'crypto'

  const RANDOM_BYTES_COUNT = 6

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
      hashedJson (password) {
        const salt = crypto.randomBytes(RANDOM_BYTES_COUNT)
          .toString('base64')
        const hashedPassword = crypto.createHash('sha256')
          .update(password + salt)
          .digest('base64')
        return { hash: hashedPassword, salt }
      },
      toggleShow () {
        this.inputType = (this.inputType === 'password') ? 'text' : 'password'
      }
    }
  }
</script>

<style scoped>

</style>
