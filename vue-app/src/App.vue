<template>
  <div id="pageWrapper">
    <Header />
    <router-view></router-view>
    <Footer />
    <CookieConsent />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CookieConsent from './components/CookieConsent.vue'
import { useCurrencyStore } from './stores/currencyStore'

const currencyStore = useCurrencyStore()

onMounted(() => {
  // Determine currency on app load based on user's location
  currencyStore.determineCurrency()
})
</script>

<style>
/* Global styles */
</style>