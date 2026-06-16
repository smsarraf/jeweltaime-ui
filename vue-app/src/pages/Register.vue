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
                  <input type="tel" class="form-control d-block w-100" v-model="phone" placeholder="Enter your phone number">
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
import { ref } from 'vue'
import Captcha from '../components/Captcha.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const captchaVerified = ref(false)

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
    const response = await axios.post(`${API_BASE}/api/auth/register`, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      password: password.value
    })

    if (response.data.success) {
      successMessage.value = 'Account created successfully! Redirecting to sign in...'
      setTimeout(() => {
        router.push('/signin')
      }, 1500)
    } else {
      errorMessage.value = response.data.error || 'Registration failed.'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Registration failed. Please try again.'
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
</style>