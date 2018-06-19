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
        <button @click="$emit('value-change', hashedJson(value))"></button>
    </div>
</template>

<script>
  import crypto from 'crypto'
  
  const SALT_LENGTH = 6

  function hashedJson (password) {
    let salt = crypto.randomBytes(Math.ceil(SALT_LENGTH/2))
            .toString('base64')
            .slice(0, SALT_LENGTH)
    let hashedPassword = crypto.createHash('sha256')
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
