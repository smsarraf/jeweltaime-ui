<template>
  <main>
    <hr class="my-0 br">
    <section class="authCallbackWrap py-7 py-md-14">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="authCallbackBox border py-7 px-5 px-md-8 text-center">
              <div v-if="isProcessing">
                <div class="mb-4">
                  <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <h4 class="fw-medium mb-2">Completing sign in...</h4>
                <p class="text-muted mb-0">Please wait while we redirect you.</p>
              </div>

              <div v-if="error">
                <div class="mb-4">
                  <i class="fa-solid fa-circle-exclamation text-danger" style="font-size: 3rem;"></i>
                </div>
                <h4 class="fw-medium mb-2">Sign in failed</h4>
                <p class="text-muted mb-4">{{ errorMessage }}</p>
                <router-link to="/signin" class="btn btn-dark fw-medium text-uppercase px-5 py-2">
                  Try Again
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import { useWishlistStore } from '../stores/wishlistStore'
import axios from 'axios'
import { notifyAuthChanged } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const currencyStore = useCurrencyStore()
const wishlistStore = useWishlistStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const isProcessing = ref(true)
const error = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    // Get tokens from query parameters (from OAuth redirect)
    const accessToken = route.query.access_token
    const refreshToken = route.query.refresh_token
    const provider = route.query.provider
    const errorParam = route.query.error

    // Handle error from OAuth provider
    if (errorParam) {
      throw new Error(errorParam === 'social_login_failed' ? 'Social login failed. Please try again.' : 'Authentication failed.')
    }

    // Validate tokens
    if (!accessToken) {
      throw new Error('No authentication token received. Please try signing in again.')
    }

    // Store the JWT tokens
    localStorage.setItem('authToken', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    // Decode the JWT to get basic user info (sub = user id, email)
    let userEmail = ''
    let userId = ''
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      userEmail = payload.email || ''
      userId = payload.sub || ''
    } catch (e) {
      // Token parsing failed, that's okay
    }

    // Store a basic user profile
    if (userEmail) {
      localStorage.setItem('user', JSON.stringify({
        email: userEmail,
        id: userId,
        provider: provider || 'social',
        lastLogin: new Date().toISOString()
      }))
    }

    // Fetch full user profile with roles from the API
    try {
      const userRes = await axios.get(`${API_BASE}/api/auth/social/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (userRes.data) {
        const userData = userRes.data
        // Map Spring Security authorities to a roles array
        const roles = userData.authorities
          ? userData.authorities.map(a => a.authority || a)
          : userData.role
            ? [userData.role.name || userData.role]
            : []
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('roles', JSON.stringify(roles))
      }
    } catch (e) {
      // User fetch failed, the basic info we stored is sufficient
      localStorage.setItem('roles', JSON.stringify([]))
    }

    // Initialize stores
    currencyStore.reset()
    currencyStore.determineCurrency()
    wishlistStore.fetchWishlist()
    notifyAuthChanged()

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)

  } catch (err) {
    isProcessing.value = false
    error.value = true
    errorMessage.value = err.message || 'Something went wrong during authentication.'
  }
})
</script>

<style scoped>
.authCallbackBox {
  background: #fff;
}
</style>