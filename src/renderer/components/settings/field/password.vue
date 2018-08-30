<template>
    <div class="grid-x grid-padding-x">
      <label class="cell" :for="field.name+'-id'">
        {{ field.display || field.name }}
      </label>
      <div class="cell small-4 flex-container">
        <input
            :type="inputType"
            :name="field.name"
            :id="field.name+'-id'"
            :minLength="field.minLength"
            :maxLength="field.maxLength"
            v-model="value"
        />
        <button class="secondary small button" @click="toggleShow"><i class="fas" v-bind:class="{ 'fa-eye-slash': isShowingPassword, 'fa-eye': !isShowingPassword }"></i></button>
        <button class="small button" @click="$emit('value-change', value)"><i class="fas fa-check"></i></button>
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
