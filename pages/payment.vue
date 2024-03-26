<template xmlns="http://www.w3.org/1999/html">
  <div class="payment">
    <Stepper orientation="vertical">
      <StepperPanel header="Personal information">
        <template #content="{ nextCallback }">
          <div class="personal-information base-shadow">
            <div class="personal-information__first-name">
              <label for="firstName">Name *</label>
              <InputText class="input-text" id="firstName" v-model="paymentForm.firstName" :class="{ 'input-text--error': v$.firstName.$error }"/>
              <div class="field-input-error-wrapper" v-for="error of v$.firstName.$errors" :key="error.$uid">
                <div class="field-input-error">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div class="personal-information__last-name">
              <label for="lastName">Surname *</label>
              <InputText class="input-text" id="lastName" v-model="paymentForm.lastName" :class="{ 'input-text--error': v$.firstName.$error }"/>
              <div class="field-input-error-wrapper" v-for="error of v$.lastName.$errors" :key="error.$uid">
                <div class="field-input-error">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <Button label="Next" class="button" @click="nextCallback"/>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel header="Contact information">
        <template #content="{ prevCallback, nextCallback }">
          <div class="contact-info base-shadow">
            <div class="contact-info__field-email">
              <label for="email">Email</label>
              <InputText id="email" v-model="paymentForm.email" class="input-text" :class="{ 'input-text--error': v$.email.$error }"/>
              <div class="field-input-error-wrapper" v-for="error of v$.email.$errors" :key="error.$uid">
                <div class="field-input-error">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div class="contact-info__field-phone">
              <PhoneInput v-model="paymentForm.phones[0]" :class="{ 'contact-info__field-phone--error': v$.phones.$error }"/>
              <button @click="addPhoneNumber" :style="{ visibility: paymentForm.phones.length < 3 ? 'visible' : 'hidden' }"><i
                  class="pi pi-plus-circle" style="font-size: 1rem"></i></button>
            </div>
            <div v-for="(phone, index) in paymentForm.phones.slice(1)" :key="index" class="contact-info__field-phone">
              <PhoneInput v-model="paymentForm.phones[index + 1]" :class="{ 'contact-info__field-phone--error': v$.phones.$error }"/>
              <button @click="removePhoneNumber(index + 1)"><i class="pi pi-minus-circle" style="font-size: 1rem"></i>
              </button>
            </div>
            <div class="contact-info__field-country">
              <label for="address">Country *</label>
              <Dropdown v-model="paymentForm.selectedCountry" :options="countries" filter optionLabel="name.common"
                        class="contact-info__field-country input-text" :class="{ 'input-text--error': v$.selectedCountry.$error }">
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
              <div class="field-input-error-wrapper" v-for="error of v$.selectedCountry.$errors" :key="error.$uid">
                <div class="field-input-error">
                  {{ error.$message }}
                </div>
              </div>
            </div>
            <div class="contact-info__field-address">
              <label for="address">Address *</label>
              <InputText id="email" v-model="paymentForm.address" class="input-text" :class="{ 'input-text--error': v$.address.$error }"/>
              <div class="field-input-error-wrapper" v-for="error of v$.address.$errors" :key="error.$uid">
                <div class="field-input-error">
                  {{ error.$message }}
                </div>
              </div>
            </div>
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
                      v-if="$index > 4 && $index < paymentForm.cardNumber.length - 4 && paymentForm.cardNumber.length > $index && n.trim() !== ''"
                  >*</div>
                  <div class="card-item__numberItem"
                       :class="{ '-active' : n.trim() === '' }"
                       :key="$index" v-else-if="paymentForm.cardNumber.length > $index">
                    {{ paymentForm.cardNumber[$index] }}
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
                <span v-for="(n, $index) in paymentForm.cardCvv" :key="$index">
                  *
                </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-form__inner base-shadow">
                <div class="card-input">
                  <label for="cardNumber" class="card-input__label">Card Number *</label>
                  <input :type="inputTypeNumber" id="cardNumber" class="input-text" v-model="paymentForm.cardNumber" v-maska
                         :data-maska="generateCardNumberMask" @blur="blurInput" data-ref="cardNumber"
                         autocomplete="off" :class="{ 'input-text--error': v$.cardNumber.$error }"><i class="pi" :class="eyeIconClassInputNumber"
                                               @click="toggleInputNumberType"></i>
                  <div class="field-input-error-wrapper" v-for="error of v$.cardNumber.$errors" :key="error.$uid">
                    <div class="field-input-error">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
                <div class="card-form__row">
                  <div class="card-form__col -cvv">
                    <div class="card-input">
                      <label for="cardCvv" class="card-input__label">CVV *</label>
                      <InputOtp v-model="paymentForm.cardCvv" :length="3">
                        <template #default="{ attrs, events }">
                          <input :type="inputTypeCVV" v-bind="attrs" v-on="events" class="custom-otp-input"
                                 @focus="flipCard(true)" @blur="flipCard(false)" autocomplete="off" :class="{ 'custom-otp-input--error': v$.cardCvv.$error }"><i class="pi"
                                                                                                       :class="eyeIconClassInputCVV"
                                                                                                       @click="toggleInputCVVType"></i>
                        </template>
                      </InputOtp>
                    </div>
                    <div class="agree-field">
                      <Checkbox v-model="paymentForm.checkedAgree" :binary="true" class="custom-checkbox agree-field__checkbox" :class="{ 'agree-field__checkbox--error': v$.checkedAgree.$error }"/>
                      <div class="agree-field__text">Agreement with terms of use *</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="payment-button-wrapper">
              <Button label="Back" class="button" severity="secondary" @click="prevCallback"/>
              <Button label="Pay" class="button" @click="goToPay"/>
            </div>
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, reactive} from 'vue';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import PhoneInput from "~/components/fields/PhoneInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";


const isCardFlipped = ref(false);
const focusElementStyle = ref(null);
const isInputFocused = ref(false);

const inputTypeNumber = ref('password');
const inputTypeCVV = ref('password');
const eyeIconClassInputNumber = ref('pi pi-eye');
const eyeIconClassInputCVV = ref('pi pi-eye');

const paymentForm = reactive({
  email: "",
  address: "",
  firstName: "",
  lastName: "",
  phones: [''],
  selectedCountry: '',
  checkedAgree: false,
  cardNumber: "",
  cardCvv: "",
})

const rules = {
  email: { email },
  address: { required },
  firstName: { required },
  lastName: { required },
  phones: { required, hasPhone: value => value.some(phone => phone !== '') },
  checkedAgree: { required, checked: value => value === true },
  selectedCountry: { required },
  cardNumber: {
    required,
    minLength: minLength(15),
    format: value => /^(\d{4} \d{6} \d{5}|\d{4} \d{4} \d{4} \d{4})$/.test(value)
  },
  cardCvv: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(3),
  },
};

const v$ = useVuelidate(rules, paymentForm);

const goToPay = () => {
  console.log("0")
  v$.value.$touch();
  console.log("1")
  console.log(v$.value);
  if (v$.value.$invalid) {
    return;
  }
  console.log("2")
};

onMounted(async () => {
  await fetchCountries();
});

const addPhoneNumber = () => {
  if (paymentForm.phones.length < 3) {
    paymentForm.phones.push('');
  }
};

const removePhoneNumber = (index) => {
  paymentForm.phones.splice(index, 1);
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
  let number = paymentForm.cardNumber;
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
};

const submitForm = () => {
  console.log("Форма відправлена!");
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/payment-details";



</style>
