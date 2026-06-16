<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Create Account</li>
        </ol>
      </nav>
    </div>

    <section class="registerWrap py-7 py-md-14">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="registerBox border py-7 px-5 px-md-8">
              <h2 class="text-center fw-medium mb-2">Create an Account</h2>
              <p class="text-center text-muted mb-6">Join us today! Fill in your details to register.</p>

              <div v-if="errorMessage" class="alert alert-danger rounded-0 py-2 mb-4">
                <small><i class="fa-solid fa-circle-exclamation me-2"></i>{{ errorMessage }}</small>
              </div>
              <div v-if="successMessage" class="alert alert-success rounded-0 py-2 mb-4">
                <small><i class="fa-solid fa-circle-check me-2"></i>{{ successMessage }}</small>
              </div>

              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="form-group">
                      <label class="d-block f-label fw-normal mb-2">First Name <em class="req">*</em></label>
                      <input type="text" class="form-control d-block w-100" v-model="firstName" placeholder="First name" required>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="form-group">
                      <label class="d-block f-label fw-normal mb-2">Last Name <em class="req">*</em></label>
                      <input type="text" class="form-control d-block w-100" v-model="lastName" placeholder="Last name" required>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-4">
                  <label class="d-block f-label fw-normal mb-2">Email Address <em class="req">*</em></label>
                  <input type="email" class="form-control d-block w-100" v-model="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group mb-4">
                  <label class="d-block f-label fw-normal mb-2">Phone Number</label>
                  <div class="input-group">
                    <select class="form-select phone-country-select" v-model="phoneCountryCode" style="max-width: 140px;">
                      <option v-for="country in countryCodes" :key="country.code" :value="country.dialCode">
                        {{ country.flag }} {{ country.dialCode }} {{ country.code }}
                      </option>
                    </select>
                    <input type="tel" class="form-control" v-model="phoneNumber" placeholder="Enter phone number" @input="formatPhoneNumber">
                  </div>
                  <small class="text-muted">Full number: {{ fullPhoneNumber || 'Not entered' }}</small>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="form-group">
                      <label class="d-block f-label fw-normal mb-2">Password <em class="req">*</em></label>
                      <input type="password" class="form-control d-block w-100" v-model="password" placeholder="Create a password" required>
                    </div>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="form-group">
                      <label class="d-block f-label fw-normal mb-2">Confirm Password <em class="req">*</em></label>
                      <input type="password" class="form-control d-block w-100" v-model="confirmPassword" placeholder="Confirm password" required>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-5">
                  <span class="customCheckboxLabel d-inline-block">
                    <input class="form-check-input fakeInput m-0" type="checkbox" id="agree-terms" v-model="agreeTerms">
                    <label class="form-check-label fw-normal cuFakeLabel" for="agree-terms">
                      I agree to the <a href="javascript:void(0);" class="text-decoration-none">terms and conditions</a> & <a href="javascript:void(0);" class="text-decoration-none">privacy policy</a> <em class="req">*</em>
                    </label>
                  </span>
                </div>
                <Captcha
                  ref="captchaRef"
                  @verified="onCaptchaVerified"
                />
                <div class="form-group mb-4">
                  <button type="submit" class="btn btn-dark fw-medium text-uppercase w-100 py-3" :disabled="isLoading || !captchaVerified">
                    <span v-if="isLoading">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>Creating account...
                    </span>
                    <span v-else>Create Account</span>
                  </button>
                </div>
              </form>

              <p class="text-center mb-0">
                Already have an account?
                <router-link to="/signin" class="text-decoration-none fw-medium">Sign in here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import Captcha from '../components/Captcha.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneCountryCode = ref('+1')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const captchaVerified = ref(false)

const fullPhoneNumber = computed(() => {
  if (!phoneNumber.value) return ''
  return `${phoneCountryCode.value}${phoneNumber.value}`
})

const countryCodes = [
  { code: 'US', dialCode: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: 'CA', dialCode: '+1', flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada' },
  { code: 'AU', dialCode: '+61', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { code: 'DE', dialCode: '+49', flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { code: 'FR', dialCode: '+33', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { code: 'IT', dialCode: '+39', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy' },
  { code: 'ES', dialCode: '+34', flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { code: 'NL', dialCode: '+31', flag: '\u{1F1F3}\u{1F1F1}', name: 'Netherlands' },
  { code: 'BE', dialCode: '+32', flag: '\u{1F1E7}\u{1F1EA}', name: 'Belgium' },
  { code: 'CH', dialCode: '+41', flag: '\u{1F1E8}\u{1F1ED}', name: 'Switzerland' },
  { code: 'AT', dialCode: '+43', flag: '\u{1F1E6}\u{1F1F9}', name: 'Austria' },
  { code: 'SE', dialCode: '+46', flag: '\u{1F1F8}\u{1F1EA}', name: 'Sweden' },
  { code: 'NO', dialCode: '+47', flag: '\u{1F1F3}\u{1F1F4}', name: 'Norway' },
  { code: 'DK', dialCode: '+45', flag: '\u{1F1E9}\u{1F1F0}', name: 'Denmark' },
  { code: 'FI', dialCode: '+358', flag: '\u{1F1EB}\u{1F1EE}', name: 'Finland' },
  { code: 'IE', dialCode: '+353', flag: '\u{1F1EE}\u{1F1EA}', name: 'Ireland' },
  { code: 'PT', dialCode: '+351', flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal' },
  { code: 'GR', dialCode: '+30', flag: '\u{1F1EC}\u{1F1F7}', name: 'Greece' },
  { code: 'PL', dialCode: '+48', flag: '\u{1F1F5}\u{1F1F1}', name: 'Poland' },
  { code: 'CZ', dialCode: '+420', flag: '\u{1F1E8}\u{1F1FF}', name: 'Czech Republic' },
  { code: 'HU', dialCode: '+36', flag: '\u{1F1ED}\u{1F1FA}', name: 'Hungary' },
  { code: 'RO', dialCode: '+40', flag: '\u{1F1F7}\u{1F1F4}', name: 'Romania' },
  { code: 'BG', dialCode: '+359', flag: '\u{1F1E7}\u{1F1EC}', name: 'Bulgaria' },
  { code: 'HR', dialCode: '+385', flag: '\u{1F1ED}\u{1F1F7}', name: 'Croatia' },
  { code: 'SK', dialCode: '+421', flag: '\u{1F1F8}\u{1F1F0}', name: 'Slovakia' },
  { code: 'SI', dialCode: '+386', flag: '\u{1F1F8}\u{1F1EE}', name: 'Slovenia' },
  { code: 'EE', dialCode: '+372', flag: '\u{1F1EA}\u{1F1EA}', name: 'Estonia' },
  { code: 'LV', dialCode: '+371', flag: '\u{1F1F1}\u{1F1FB}', name: 'Latvia' },
  { code: 'LT', dialCode: '+370', flag: '\u{1F1F1}\u{1F1F9}', name: 'Lithuania' },
  { code: 'JP', dialCode: '+81', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { code: 'KR', dialCode: '+82', flag: '\u{1F1F0}\u{1F1F7}', name: 'South Korea' },
  { code: 'CN', dialCode: '+86', flag: '\u{1F1E8}\u{1F1F3}', name: 'China' },
  { code: 'IN', dialCode: '+91', flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { code: 'BR', dialCode: '+55', flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
  { code: 'MX', dialCode: '+52', flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexico' },
  { code: 'AR', dialCode: '+54', flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
  { code: 'CL', dialCode: '+56', flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile' },
  { code: 'CO', dialCode: '+57', flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
  { code: 'ZA', dialCode: '+27', flag: '\u{1F1FF}\u{1F1E6}', name: 'South Africa' },
  { code: 'NG', dialCode: '+234', flag: '\u{1F1F3}\u{1F1EC}', name: 'Nigeria' },
  { code: 'EG', dialCode: '+20', flag: '\u{1F1EA}\u{1F1EC}', name: 'Egypt' },
  { code: 'KE', dialCode: '+254', flag: '\u{1F1F0}\u{1F1EA}', name: 'Kenya' },
  { code: 'GH', dialCode: '+233', flag: '\u{1F1EC}\u{1F1ED}', name: 'Ghana' },
  { code: 'AE', dialCode: '+971', flag: '\u{1F1E6}\u{1F1EA}', name: 'United Arab Emirates' },
  { code: 'SA', dialCode: '+966', flag: '\u{1F1F8}\u{1F1E6}', name: 'Saudi Arabia' },
  { code: 'IL', dialCode: '+972', flag: '\u{1F1EE}\u{1F1F1}', name: 'Israel' },
  { code: 'TR', dialCode: '+90', flag: '\u{1F1F9}\u{1F1F7}', name: 'Turkey' },
  { code: 'RU', dialCode: '+7', flag: '\u{1F1F7}\u{1F1FA}', name: 'Russia' },
  { code: 'UA', dialCode: '+380', flag: '\u{1F1FA}\u{1F1E6}', name: 'Ukraine' },
  { code: 'SG', dialCode: '+65', flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore' },
  { code: 'MY', dialCode: '+60', flag: '\u{1F1F2}\u{1F1FE}', name: 'Malaysia' },
  { code: 'TH', dialCode: '+66', flag: '\u{1F1F9}\u{1F1ED}', name: 'Thailand' },
  { code: 'PH', dialCode: '+63', flag: '\u{1F1F5}\u{1F1ED}', name: 'Philippines' },
  { code: 'ID', dialCode: '+62', flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesia' },
  { code: 'VN', dialCode: '+84', flag: '\u{1F1FB}\u{1F1F3}', name: 'Vietnam' },
  { code: 'NZ', dialCode: '+64', flag: '\u{1F1F3}\u{1F1FF}', name: 'New Zealand' },
]

function formatPhoneNumber() {
  // Remove non-numeric characters
  phoneNumber.value = phoneNumber.value.replace(/[^0-9]/g, '')
}

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.'
    return
  }

  if (!agreeTerms.value) {
    errorMessage.value = 'Please agree to the terms and conditions.'
    return
  }

  if (!captchaVerified.value) {
    errorMessage.value = 'Please complete the security check.'
    return
  }

  isLoading.value = true

  try {
    const fullName = `${firstName.value} ${lastName.value}`.trim()
    const phoneString = fullPhoneNumber.value || ''
    
    await axios.post(`${API_BASE}/api/v1/auth/register`, {
      email: email.value,
      password: password.value,
      username: email.value.split('@')[0],
      fullName: fullName,
      phone: phoneString,
      roleName: 'USER'
    })

    successMessage.value = 'Account created successfully! Redirecting to sign in...'
    setTimeout(() => {
      router.push('/signin')
    }, 1500)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function onCaptchaVerified(valid) {
  captchaVerified.value = valid
}
</script>

<style scoped>
.registerBox {
  background: #fff;
}
.f-label {
  font-size: 0.9rem;
}
.phone-country-select {
  border-radius: 0;
  border-color: #ced4da;
  background-color: #fff;
  font-size: 0.9rem;
}
.input-group .form-control {
  border-radius: 0;
}
</style>