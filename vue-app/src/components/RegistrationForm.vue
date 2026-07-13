<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div v-if="apiError" class="alert alert-danger rounded-0 py-2 mb-4" role="alert">
      <small><i class="fa-solid fa-circle-exclamation me-2"></i>{{ apiError }}</small>
    </div>

    <div class="row">
      <div class="col-12 col-md-6 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-email">Email Address <em class="req">*</em></label>
        <input
          id="reg-email"
          type="email"
          class="form-control d-block w-100"
          v-model.trim="form.email"
          :aria-invalid="!!errors.email"
          autocomplete="email"
          required
        >
        <small v-if="errors.email" class="text-danger d-block mt-1">{{ errors.email }}</small>
      </div>
      <div class="col-12 col-md-6 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-username">Username</label>
        <input
          id="reg-username"
          type="text"
          class="form-control d-block w-100"
          v-model.trim="form.username"
          :aria-invalid="!!errors.username"
          autocomplete="username"
          placeholder="Optional (defaults to email)"
        >
        <small v-if="errors.username" class="text-danger d-block mt-1">{{ errors.username }}</small>
      </div>
    </div>

    <div class="form-group mb-4">
      <label class="d-block f-label fw-normal mb-2" for="reg-fullname">Full Name</label>
      <input
        id="reg-fullname"
        type="text"
        class="form-control d-block w-100"
        v-model.trim="form.fullName"
        :aria-invalid="!!errors.fullName"
        autocomplete="name"
      >
      <small v-if="errors.fullName" class="text-danger d-block mt-1">{{ errors.fullName }}</small>
    </div>

    <div class="form-group mb-4">
      <label class="d-block f-label fw-normal mb-2" for="reg-password">Password <em class="req">*</em></label>
      <input
        id="reg-password"
        type="password"
        class="form-control d-block w-100"
        v-model="form.password"
        :aria-invalid="!!errors.password"
        autocomplete="new-password"
        required
      >
      <small v-if="errors.password" class="text-danger d-block mt-1">{{ errors.password }}</small>
    </div>

    <div v-if="props.mode === 'B2B_USER'" class="row">
      <div class="col-12 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-name">Company Name <em class="req">*</em></label>
        <input
          id="reg-company-name"
          type="text"
          class="form-control d-block w-100"
          v-model.trim="form.b2bCompany.companyName"
          :aria-invalid="!!errors.companyName"
        >
        <small v-if="errors.companyName" class="text-danger d-block mt-1">{{ errors.companyName }}</small>
      </div>

      <div class="col-12 col-md-6 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-registration">Registration Number</label>
        <input
          id="reg-company-registration"
          type="text"
          class="form-control d-block w-100"
          v-model.trim="form.b2bCompany.registrationNumber"
        >
      </div>

      <div class="col-12 col-md-6 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-taxid">Tax ID</label>
        <input
          id="reg-company-taxid"
          type="text"
          class="form-control d-block w-100"
          v-model.trim="form.b2bCompany.taxId"
        >
      </div>

      <div class="col-12 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-address">Address Line 1 <em class="req">*</em></label>
        <input
          id="reg-company-address"
          type="text"
          class="form-control d-block w-100"
          v-model.trim="form.b2bCompany.addressLine1"
          :aria-invalid="!!errors.addressLine1"
        >
        <small v-if="errors.addressLine1" class="text-danger d-block mt-1">{{ errors.addressLine1 }}</small>
      </div>

      <div class="col-12 col-md-4 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-country">Country <em class="req">*</em></label>
        <select
          id="reg-company-country"
          class="form-control d-block w-100"
          v-model.number="form.b2bCompany.countryId"
          :aria-invalid="!!errors.countryId"
          @change="onCountryChange"
        >
          <option :value="null">Select country</option>
          <option v-for="country in countryOptions" :key="country.id" :value="country.id">{{ country.name }}</option>
        </select>
        <small v-if="errors.countryId" class="text-danger d-block mt-1">{{ errors.countryId }}</small>
      </div>

      <div class="col-12 col-md-4 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-state">State <em class="req">*</em></label>
        <select
          id="reg-company-state"
          class="form-control d-block w-100"
          v-model.number="form.b2bCompany.stateId"
          :disabled="!form.b2bCompany.countryId"
          :aria-invalid="!!errors.stateId"
          @change="onStateChange"
        >
          <option :value="null">Select state</option>
          <option v-for="state in stateOptions" :key="state.id" :value="state.id">{{ state.name }}</option>
        </select>
        <small v-if="errors.stateId" class="text-danger d-block mt-1">{{ errors.stateId }}</small>
      </div>

      <div class="col-12 col-md-4 mb-4">
        <label class="d-block f-label fw-normal mb-2" for="reg-company-city">City <em class="req">*</em></label>
        <select
          id="reg-company-city"
          class="form-control d-block w-100"
          v-model.number="form.b2bCompany.cityId"
          :disabled="!form.b2bCompany.stateId"
          :aria-invalid="!!errors.cityId"
        >
          <option :value="null">Select city</option>
          <option v-for="city in cityOptions" :key="city.id" :value="city.id">{{ city.name }}</option>
        </select>
        <small v-if="errors.cityId" class="text-danger d-block mt-1">{{ errors.cityId }}</small>
      </div>
    </div>

    <div class="form-group mb-4">
      <div class="form-check mb-3">
        <input
          id="reg-newsletter"
          type="checkbox"
          class="form-check-input"
          v-model="subscribeNewsletter"
        >
        <label class="form-check-label fw-light" for="reg-newsletter">
          Subscribe to our newsletter and receive exclusive offers, new arrivals, and jewellery care tips.
        </label>
      </div>
    </div>

    <div class="form-group mb-4">
      <button type="submit" class="btn btn-dark fw-medium text-uppercase w-100 py-3" :disabled="isSubmitting" :aria-busy="isSubmitting">
        <span v-if="isSubmitting"><span class="spinner-border spinner-border-sm me-2" role="status"></span>Submitting...</span>
        <span v-else>Register</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { mapRegistrationApiError, registerAccount } from '../services/registrationService'
import { validateRegistrationForm } from '../services/registrationValidation'
import { useLocationStore } from '../stores/locationStore'
import { subscribeToNewsletter, buildSubscribePayload } from '../services/newsletterService'

const props = defineProps({
  mode: {
    type: String,
    default: 'USER'
  }
})

const emit = defineEmits(['success'])
const locationStore = useLocationStore()

const form = reactive({
  email: '',
  username: '',
  fullName: '',
  password: '',
  b2bCompany: {
    companyName: '',
    registrationNumber: '',
    taxId: '',
    addressLine1: '',
    countryId: null,
    stateId: null,
    cityId: null
  }
})
const subscribeNewsletter = ref(false)
const isSubmitting = ref(false)
const apiError = ref('')
const errors = ref({})

const countryOptions = computed(() => locationStore.countries || [])
const stateOptions = computed(() => locationStore.getStates(Number(form.b2bCompany.countryId || 0)))
const cityOptions = computed(() => locationStore.getCities(Number(form.b2bCompany.stateId || 0)))

async function loadLocationOptions() {
  if (props.mode !== 'B2B_USER') return
  if (!locationStore.loaded) await locationStore.loadAllLocations()
}

function toDto() {
  const email = form.email.trim()
  const countryId = Number(form.b2bCompany.countryId || 0)
  const stateId = Number(form.b2bCompany.stateId || 0)
  const cityId = Number(form.b2bCompany.cityId || 0)
  return {
    email,
    username: (form.username || '').trim() || email,
    fullName: (form.fullName || '').trim(),
    password: form.password,
    roleName: props.mode,
    b2bCompany: props.mode === 'B2B_USER' ? {
      companyName: String(form.b2bCompany.companyName || '').trim(),
      registrationNumber: String(form.b2bCompany.registrationNumber || '').trim(),
      taxId: String(form.b2bCompany.taxId || '').trim(),
      addressLine1: String(form.b2bCompany.addressLine1 || '').trim(),
      country_id: countryId > 0 ? countryId : null,
      state_id: stateId > 0 ? stateId : null,
      city_id: cityId > 0 ? cityId : null
    } : null
  }
}

async function onCountryChange() {
  form.b2bCompany.stateId = null
  form.b2bCompany.cityId = null
  if (form.b2bCompany.countryId) {
    await locationStore.loadStates(Number(form.b2bCompany.countryId))
  }
}

async function onStateChange() {
  form.b2bCompany.cityId = null
  if (form.b2bCompany.stateId) {
    await locationStore.loadCities(Number(form.b2bCompany.stateId))
  }
}

async function onSubmit() {
  apiError.value = ''
  const validation = validateRegistrationForm({
    email: form.email,
    username: form.username,
    fullName: form.fullName,
    password: form.password,
    b2bCompany: form.b2bCompany
  }, props.mode)

  errors.value = validation.errors
  if (!validation.valid) return

  isSubmitting.value = true
  try {
    const response = await registerAccount(toDto())

    // Subscribe to newsletter if the user opted in
    if (subscribeNewsletter.value) {
      try {
        const subscriberType = props.mode === 'B2B_USER' ? 'B2B_USER' : 'USER'
        await subscribeToNewsletter({
          email: form.email.trim(),
          name: form.fullName.trim() || form.email.trim(),
          source: 'WEBSITE',
          subscriberType
        })
      } catch (newsletterError) {
        // Newsletter subscription is non-blocking - log but don't show error
        console.warn('Newsletter subscription after registration failed:', newsletterError)
      }
    }

    emit('success', {
      mode: props.mode,
      response
    })
  } catch (error) {
    apiError.value = mapRegistrationApiError(error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadLocationOptions)
</script>
