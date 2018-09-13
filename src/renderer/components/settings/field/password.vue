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
            @change="$emit('value-change', $event.target.value)"
        />
        <button class="secondary small button" @click="toggleShow"><i class="fas" v-bind:class="{ 'fa-eye-slash': isShowingPassword, 'fa-eye': !isShowingPassword }"></i></button>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'password-field',
      props: ['field', 'value'],
      data: function () {
        return {
          isShowingPassword: false,
          inputType: 'password',
          editing: false
        }
      },
      methods: {
        toggleEditing () {
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
