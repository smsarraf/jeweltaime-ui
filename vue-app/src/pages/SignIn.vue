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
                <router-link to="/register/user" class="text-decoration-none fw-medium">Create one here</router-link>
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
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useLocationStore } from '../stores/locationStore'
import axios from 'axios'
import { notifyAuthChanged } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const currencyStore = useCurrencyStore()
const wishlistStore = useWishlistStore()
const locationStore = useLocationStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const failedAttempts = ref(0)
const captchaVerified = ref(false)
const showCaptcha = computed(() => failedAttempts.value >= 1)

// Get redirect destination from query param, default to dashboard
const redirectTo = route.query.redirect || '/dashboard'

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
    const response = await axios.post(`${API_BASE}/api/v1/auth/login`, {
      email: email.value,
      password: password.value
    })

    if (response.data && response.data.access_token) {
      successMessage.value = 'Login successful! Redirecting...'
      // Store JWT tokens
      localStorage.setItem('authToken', response.data.access_token)
      if (response.data.refresh_token) {
        localStorage.setItem('refreshToken', response.data.refresh_token)
      }
      // Fetch user profile with roles
      let userData = null
      let roles = []
      // First try the /api/auth/social/me endpoint
      try {
        const userRes = await axios.get(`${API_BASE}/api/auth/social/me`, {
          headers: { Authorization: `Bearer ${response.data.access_token}` }
        })
        // Response format: { success: true, data: { id, firstName, lastName, email, role: "B2B_USER" } }
        const userPayload = userRes.data?.data || userRes.data
        if (userPayload && (userPayload.id || userPayload.email)) {
          userData = userPayload
          // role is a plain string like "B2B_USER" in this response
          if (userPayload.role && typeof userPayload.role === 'string') {
            roles = [userPayload.role]
          } else if (userPayload.authorities) {
            roles = userPayload.authorities.map(a => a.authority || a)
          } else if (userPayload.role && typeof userPayload.role === 'object') {
            roles = [userPayload.role.name || userPayload.role]
          }
        }
      } catch (e) {
        // social/me didn't work - try email lookup and JWT parsing
      }
      if (!userData) {
        // Fallback: fetch user by email from ERP
        try {
          const userRes = await axios.get(`${API_BASE}/api/v1/users/email/${email.value}`, {
            headers: { Authorization: `Bearer ${response.data.access_token}` }
          })
          if (userRes.data) {
            userData = userRes.data
          }
        } catch (e2) {
          // email lookup also failed
        }
        // Also try to extract roles from JWT token
        try {
          const payload = JSON.parse(atob(response.data.access_token.split('.')[1]))
          if (payload.role || payload.roles || payload.authorities) {
            const tokenRoles = payload.roles || payload.authorities || (payload.role ? [payload.role] : [])
            roles = Array.isArray(tokenRoles) ? tokenRoles.map(r => typeof r === 'string' ? r : (r.authority || r.name || r)) : [tokenRoles]
          }
        } catch (jwtErr) {
          // JWT parsing failed
        }
        // If we still don't have userData, create basic object
        if (!userData) {
          userData = { email: email.value }
        }
      }
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('roles', JSON.stringify(roles))
      // Determine currency based on user's country after login
      currencyStore.reset()
      currencyStore.determineCurrency()
      // Fetch wishlist from server after login
      wishlistStore.fetchWishlist()
      notifyAuthChanged()
      setTimeout(() => {
        router.push(redirectTo)
      }, 1000)
    } else {
      failedAttempts.value++
      errorMessage.value = 'Invalid credentials. Please try again.'
    }
  } catch (error) {
    failedAttempts.value++
    errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Invalid email or password.'
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