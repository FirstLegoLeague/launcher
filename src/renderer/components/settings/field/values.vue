<template>
    <div v-if="field.values.length <= 3" class="ui buttons">
        <div class="ui button" v-for="v in field.values" v-bind:class="{ primary: value === v }" @click="value = v; $emit('value-change', v)">
            {{ field.texts ? field.texts[v] : v }}
        </div>
    </div>
    <div v-else>
        <div class="field" v-for="v in field.values">
            <div class="ui radio checkbox" @click="value = v; $emit('value-change', v)">
                <input type="radio" :name="field.name" :checked="value === v">
                <label>{{ field.texts ? field.texts[v] : v }}</label>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'values-field',
    props: ['field', 'value']
  }
</script>

<style scoped>

</style>
