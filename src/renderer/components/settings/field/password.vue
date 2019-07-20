<template>
    <div class="inline fields">
        <div class="field">
            <label>{{ field.display || field.name }}</label>
            <div class="ui action input">
                <input
                    :type="inputType"
                    :name="field.name"
                    :id="field.name+'-id'"
                    :minLength="field.minLength"
                    :maxLength="field.maxLength"
                    @change="$emit('value-change', $event.target.value)"
                />
                <button class="ui icon button" @click="toggleShow">
                    <i class="eye icon" :class="{ slash: isShowingPassword }"></i>
                </button>
            </div>
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
