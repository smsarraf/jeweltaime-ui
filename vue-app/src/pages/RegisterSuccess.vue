<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">Home</router-link></li>
          <li class="breadcrumb-item"><router-link :to="flow === 'b2b' ? '/register/b2b' : '/register/user'" class="text-decoration-none">Register</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">Registration Success</li>
        </ol>
      </nav>
    </div>

    <section class="registerWrap py-7 py-md-14">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-7">
            <div class="border py-7 px-5 px-md-8">
              <h2 class="text-center fw-medium mb-3">{{ title }}</h2>
              <p class="text-center text-muted mb-5">{{ description }}</p>

              <div v-if="flow === 'b2b'" class="border p-4 mb-4">
                <h5 class="mb-3">Approval Timeline</h5>
                <ol class="mb-0">
                  <li class="mb-2">Submitted</li>
                  <li class="mb-2">Under review</li>
                  <li>Activation email after approval</li>
                </ol>
              </div>

              <div v-else class="alert alert-info rounded-0 mb-4">
                Activation link sent to your email.
              </div>

              <div class="d-grid gap-2">
                <button
                  v-if="flow !== 'b2b'"
                  class="btn btn-dark rounded-0"
                  disabled
                  aria-disabled="true"
                  title="Login enabled after account activation"
                >
                  Go to Login (after activation)
                </button>
                <router-link v-else to="/signin" class="btn btn-dark rounded-0">Go to Login</router-link>
                <button v-if="flow !== 'b2b'" class="btn btn-outline-dark rounded-0">Resend Activation (Coming soon)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const flow = computed(() => (route.query.flow === 'b2b' ? 'b2b' : 'user'))

const result = (() => {
  try {
    const raw = sessionStorage.getItem('registration:result')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
})()

const title = computed(() => {
  if (flow.value === 'b2b') return 'Registration Submitted'
  return 'Registration Successful'
})

const description = computed(() => {
  const apiMessage = result?.response?.message
  if (apiMessage) return apiMessage
  if (flow.value === 'b2b') return 'Registration submitted for admin approval.'
  return 'Activation link sent to your email.'
})
</script>
