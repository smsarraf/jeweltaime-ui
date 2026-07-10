<template>
  <main>
    <section class="registerWrap py-7 py-md-14">
      <div class="container text-center">
        <div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>
        <p class="text-muted mt-3 mb-0">Redirecting to registration...</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  router.replace('/register/user')
})
</script>
