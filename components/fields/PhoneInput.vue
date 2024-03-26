<template>
  <div>
    <MazPhoneNumberInput
        class="input"
        @input="setPhone"
        v-model="phoneNumber"
        :translations="translations"
        show-code-on-list
        default-country-code="UA"
        :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"
        :ignored-countries="['AC']"
        @update="results = $event"
        :success="results?.isValid"
    />
  </div>
</template>

<script setup lang="ts">
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'
import {ref} from 'vue'

const phoneNumber = ref()
const results = ref()
const translations = {
  countrySelector: {
    placeholder: 'Код країни',
    error: 'Обери країну',
  },
  phoneInput: {
    placeholder: 'Номер телефону',
    example: 'Наприклад:',
  },
}

const setPhone = () => {
  console.log(results.value.isValid);
  if (results.value.isValid) {
    return;
  }
}
</script>

<style scoped lang="scss">
.title-input {
  color: white;
  width: 100%;
  margin-bottom: 15px;
}

.input {
  background-color: white;
  border-radius: 15px;
}
</style>
