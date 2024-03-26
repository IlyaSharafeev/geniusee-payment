<template xmlns="http://www.w3.org/1999/html">
  <div class="payment">
    <Stepper orientation="vertical">
      <StepperPanel header="Personal information">
        <template #content="{ nextCallback }">
          <div class="personal-information base-shadow">
            <FloatLabel>
              <InputText class="input-text" id="firstName" v-model="firstName"/>
              <label for="firstName">Name</label>
            </FloatLabel>
            <FloatLabel>
              <InputText class="input-text" id="lastName" v-model="lastName"/>
              <label for="lastName">Surname</label>
            </FloatLabel>
            <Button label="Next" class="button" @click="nextCallback"/>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Contact information">
        <template #content="{ prevCallback, nextCallback }">
          <div class="contact-info base-shadow">
            <FloatLabel class="contact-info__field-email">
              <InputText id="email" v-model="email" class="input-text"/>
              <label for="email">Email</label>
            </FloatLabel>
            <FloatLabel class="contact-info__field-phone">
              <PhoneInput v-model="phones[0]"/>
              <button @click="addPhoneNumber" :style="{ visibility: phones.length < 3 ? 'visible' : 'hidden' }"><i
                  class="pi pi-plus-circle" style="font-size: 1rem"></i></button>
            </FloatLabel>
            <div v-for="(phone, index) in phones.slice(1)" :key="index" class="contact-info__field-phone">
              <PhoneInput v-model="phones[index + 1]"/>
              <button @click="removePhoneNumber(index + 1)"><i class="pi pi-minus-circle" style="font-size: 1rem"></i>
              </button>
            </div>
            <Dropdown v-model="selectedCountry" :options="countries" filter optionLabel="name.common"
                      class="contact-info__field-country input-text">
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div>{{ slotProps.value.name.common }}</div>
                </div>
                <span v-else>
            {{ slotProps.placeholder }}
        </span>
              </template>
              <template #option="slotProps">
                <div>
                  <div>{{ slotProps.option.name.common }}</div>
                </div>
              </template>
            </Dropdown>
            <FloatLabel class="contact-info__field-address">
              <InputText id="email" v-model="address" class="input-text"/>
              <label for="address">Address</label>
            </FloatLabel>
            <div class="wrapper-buttons">
              <Button label="Back" class="button" severity="secondary" @click="prevCallback"/>
              <Button label="Next" class="button" @click="nextCallback"/>
            </div>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Payment details">
        <template #content="{ prevCallback }">
          <div class="wrapper">
            <div class="card-form">
              <div class="card-item" :class="{ '-active' : isCardFlipped }">
                <div class="card-item__side -front">
                  <div class="card-item__chip"></div>
                  <NuxtImg class="card-item__type" :src='`/cardsType/${getCardType}.png`' v-if="getCardType"
                           v-bind:key="getCardType" alt="card type"/>
                  <label for="cardNumber" class="card-item__number">
              <span v-for="(n, $index) in generateCardNumberMask" :key="$index">
                <transition name="slide-fade-up">
                  <div
                      class="card-item__numberItem"
                      v-if="$index > 4 && $index < cardNumber.length - 4 && cardNumber.length > $index && n.trim() !== ''"
                  >*</div>
                  <div class="card-item__numberItem"
                       :class="{ '-active' : n.trim() === '' }"
                       :key="$index" v-else-if="cardNumber.length > $index">
                    {{ cardNumber[$index] }}
                  </div>
                  <div
                      class="card-item__numberItem"
                      :class="{ '-active' : n.trim() === '' }"
                      v-else
                      :key="$index + 1"
                  >{{ n }}</div>
                </transition>
              </span>
                  </label>
                </div>
                <div class="card-item__side -back">
                  <div class="card-item__cvv">
                    <div class="card-item__cvvTitle">CVV</div>
                    <div class="card-item__cvvBand">
                <span v-for="(n, $index) in cardCvv" :key="$index">
                  *
                </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-form__inner base-shadow">
                <div class="card-input">
                  <label for="cardNumber" class="card-input__label">Card Number</label>
                  <input :type="inputTypeNumber" id="cardNumber" class="input-text" v-model="cardNumber" v-maska
                         :data-maska="generateCardNumberMask" @blur="blurInput" data-ref="cardNumber"
                         autocomplete="off"><i class="pi" :class="eyeIconClassInputNumber"
                                               @click="toggleInputNumberType"></i>
                </div>
                <div class="card-form__row">
                  <div class="card-form__col -cvv">
                    <div class="card-input">
                      <label for="cardCvv" class="card-input__label">CVV</label>
                      <InputOtp v-model="cardCvv" :length="3">
                        <template #default="{ attrs, events }">
                          <input :type="inputTypeCVV" v-bind="attrs" v-on="events" class="custom-otp-input"
                                 @focus="flipCard(true)" @blur="flipCard(false)" autocomplete="off"><i class="pi"
                                                                                                       :class="eyeIconClassInputCVV"
                                                                                                       @click="toggleInputCVVType"></i>
                        </template>
                      </InputOtp>
                    </div>
                    <div class="agree-field">
                      <Checkbox v-model="checkedAgree" :binary="true" class="custom-checkbox agree-field__checkbox"/>
                      <div class="agree-field__text">Agreement with terms of use</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from 'vue';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import PhoneInput from "~/components/fields/PhoneInput.vue";

const cardNumber = ref("");
const cardCvv = ref("");
const isCardFlipped = ref(false);
const focusElementStyle = ref(null);
const isInputFocused = ref(false);

const email = ref("");
const phone = ref("");
const country = ref(null);
const address = ref("");
const firstName = ref(null);
const lastName = ref(null);
const phones = ref(['']);
const selectedCountry = ref('');
const checkedAgree = ref(false);

const inputTypeNumber = ref('password');
const inputTypeCVV = ref('password');
const eyeIconClassInputNumber = ref('pi pi-eye');
const eyeIconClassInputCVV = ref('pi pi-eye');

onMounted(async () => {
  await fetchCountries();
});

const addPhoneNumber = () => {
  if (phones.value.length < 3) {
    phones.value.push('');
  }
};

const removePhoneNumber = (index) => {
  phones.value.splice(index, 1);
};

const toggleInputNumberType = () => {
  inputTypeNumber.value = inputTypeNumber.value === 'password' ? 'text' : 'password';
  eyeIconClassInputNumber.value = inputTypeNumber.value === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash';
};

const toggleInputCVVType = () => {
  inputTypeCVV.value = inputTypeCVV.value === 'password' ? 'text' : 'password';
  eyeIconClassInputCVV.value = inputTypeCVV.value === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash';
};

const getCardType = computed(() => {
  let number = cardNumber.value;
  if (/^4/.test(number)) return "visa";
  if (/^(34|37)/.test(number)) return "amex";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^6011/.test(number)) return "discover";
  if (/^9792/.test(number)) return "troy";
  return "visa";
});

const generateCardNumberMask = computed(() => {
  return getCardType.value === "amex" ? "#### ###### #####" : "#### #### #### ####";
});


const flipCard = (status) => {
  isCardFlipped.value = status;
};

const blurInput = () => {
  setTimeout(() => {
    if (!isInputFocused.value) {
      focusElementStyle.value = null;
    }
  }, 300);
  console.log(cardNumber.value);
};

const submitForm = () => {
  console.log("Форма відправлена!");
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/payment-details";


.payment {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 30px 20px;

  .personal-information {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 35px 0 35px 0;
    border-radius: 15px;
    gap: 30px;
    width: 500px;
    margin: 30px auto;
  }
}
</style>
