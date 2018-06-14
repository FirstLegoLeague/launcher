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

  import sha256 from 'sha256'
  
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
