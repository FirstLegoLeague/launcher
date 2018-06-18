<template>
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
        <button @click="$emit('value-change', sha256(value))"></button>
    </div>
</template>

<script>
  import crypto from 'crypto'

  function sha256 (password) {
    return crypto.createHash('sha256')
       .update(password)
       .digest('base64')
  }
  
  export default {
    name: 'password-field',
    props: ['field'],
    editing: false,
    value: '',
    sha256
  }
</script>

<style scoped>

</style>
