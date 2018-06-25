<template>
  <div>
    {{ field.display || field.name }}
    <button @click="editing = !editing"></button>
    <div v-if="editing">
      <label>
        <input
          type="password"
          :name="field.name"
          :minLength="field.minLength"
          :maxLength="field.maxLength"
          :value="value"
        />
      </label>
      <button @click="$emit('value-change', hashedJson(value))"></button>
    </div>
  </div>
</template>

<script>
  import crypto from 'crypto'

  const RANDOM_BYTES_COUNT = 6

  function hashedJson (password) {
    const salt = crypto.randomBytes(RANDOM_BYTES_COUNT)
      .toString('base64')
    const hashedPassword = crypto.createHash('sha256')
      .update(password + salt)
      .digest('base64')
    return { hash: hashedPassword, salt }
  }

  export default {
    name: 'password-field',
    props: ['field'],
    editing: false,
    value: '',
    hashedJson
  }
</script>

<style scoped>

</style>
