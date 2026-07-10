<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">Home</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">B2B Registration</li>
        </ol>
      </nav>
    </div>

    <section class="registerWrap py-7 py-md-14">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="registerBox border py-7 px-5 px-md-8">
              <h2 class="text-center fw-medium mb-2">Create B2B Account</h2>
              <p class="text-center text-muted mb-6">Register your business user account for admin approval.</p>
              <RegistrationForm mode="B2B_USER" @success="onSuccess" />
              <p class="text-center mb-0">
                Individual account?
                <router-link to="/register/user" class="text-decoration-none fw-medium">Register as User</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RegistrationForm from '../components/RegistrationForm.vue'

const router = useRouter()

function onSuccess(payload) {
  sessionStorage.setItem('registration:result', JSON.stringify(payload))
  router.push('/register/success?flow=b2b')
}
</script>
