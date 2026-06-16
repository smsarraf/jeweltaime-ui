<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Sign In</li>
        </ol>
      </nav>
    </div>

    <section class="loginWrap py-7 py-md-14">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="loginBox border py-7 px-5 px-md-8">
              <h2 class="text-center fw-medium mb-2">Sign In</h2>
              <p class="text-center text-muted mb-6">Welcome back! Please enter your credentials.</p>

              <div v-if="errorMessage" class="alert alert-danger rounded-0 py-2 mb-4">
                <small><i class="fa-solid fa-circle-exclamation me-2"></i>{{ errorMessage }}</small>
              </div>
              <div v-if="successMessage" class="alert alert-success rounded-0 py-2 mb-4">
                <small><i class="fa-solid fa-circle-check me-2"></i>{{ successMessage }}</small>
              </div>

              <form @submit.prevent="handleSignIn">
                <div class="form-group mb-4">
                  <label class="d-block f-label fw-normal mb-2">Email Address <em class="req">*</em></label>
                  <input type="email" class="form-control d-block w-100" v-model="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group mb-4">
                  <label class="d-block f-label fw-normal mb-2">Password <em class="req">*</em></label>
                  <input type="password" class="form-control d-block w-100" v-model="password" placeholder="Enter your password" required>
                </div>
                <div class="form-group d-flex justify-content-between align-items-center mb-5">
                  <span class="customCheckboxLabel d-inline-block">
                    <input class="form-check-input fakeInput m-0" type="checkbox" id="remember-me" v-model="rememberMe">
                    <label class="form-check-label fw-normal cuFakeLabel" for="remember-me">Remember me</label>
                  </span>
                  <a href="javascript:void(0);" class="txtLink text-decoration-none fw-normal">Forgot password?</a>
                </div>
                <Captcha
                  v-if="showCaptcha"
                  ref="captchaRef"
                  @verified="onCaptchaVerified"
                />
                <div class="form-group mb-4">
                  <button type="submit" class="btn btn-dark fw-medium text-uppercase w-100 py-3" :disabled="isLoading">
                    <span v-if="isLoading">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...
                    </span>
                    <span v-else>Sign In</span>
                  </button>
                </div>
              </form>

              <p class="text-center mb-0">
                Don't have an account?
                <router-link to="/register" class="text-decoration-none fw-medium">Create one here</router-link>
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
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const failedAttempts = ref(0)
const captchaVerified = ref(false)
const showCaptcha = computed(() => failedAttempts.value >= 1)

const handleSignIn = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  if (showCaptcha.value && !captchaVerified.value) {
    errorMessage.value = 'Please complete the security check.'
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post(`${API_BASE}/api/auth/login`, {
      email: email.value,
      password: password.value
    })

    if (response.data.success) {
      successMessage.value = 'Login successful! Redirecting...'
      // Store token/user data
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      failedAttempts.value++
      errorMessage.value = response.data.error || 'Invalid credentials.'
    }
  } catch (error) {
    failedAttempts.value++
    errorMessage.value = error.response?.data?.error || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function onCaptchaVerified(valid) {
  captchaVerified.value = valid
}
</script>

<style scoped>
.loginBox {
  background: #fff;
}
.f-label {
  font-size: 0.9rem;
}
</style>