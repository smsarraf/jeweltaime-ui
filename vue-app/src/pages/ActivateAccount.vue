<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">Home</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">Activate Account</li>
        </ol>
      </nav>
    </div>

    <section class="registerWrap py-7 py-md-14">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="border py-7 px-5 px-md-8 text-center">
              <div v-if="loading">
                <div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>
                <p class="text-muted mt-3 mb-0">Activating your account...</p>
              </div>

              <div v-else-if="status === 'success'">
                <i class="fa-solid fa-circle-check text-success" style="font-size: 4rem;"></i>
                <h2 class="mt-3 mb-2">Account activated successfully</h2>
                <router-link to="/signin" class="btn btn-dark rounded-0 mt-3">Go to login</router-link>
              </div>

              <div v-else>
                <i class="fa-solid fa-circle-exclamation text-danger" style="font-size: 4rem;"></i>
                <h2 class="mt-3 mb-2">{{ errorTitle }}</h2>
                <p class="text-muted">{{ errorMessage }}</p>
                <button class="btn btn-outline-dark rounded-0 mt-2" @click="runActivation">Retry</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { activateAccount, mapActivationApiError } from '../services/registrationService'

const route = useRoute()
const loading = ref(false)
const status = ref('idle')
const errorMessage = ref('')

const token = computed(() => String(route.query.token || '').trim())
const errorTitle = computed(() => {
  const msg = errorMessage.value.toLowerCase()
  if (msg.includes('expired')) return 'Activation link expired'
  if (msg.includes('invalid')) return 'Invalid activation link'
  return 'Activation failed'
})

async function runActivation() {
  loading.value = true
  status.value = 'idle'
  errorMessage.value = ''
  try {
    if (!token.value) {
      throw new Error('Invalid activation link.')
    }
    await activateAccount(token.value)
    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = mapActivationApiError(error)
  } finally {
    loading.value = false
  }
}

onMounted(runActivation)
</script>
