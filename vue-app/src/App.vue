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
import { useLocationStore } from './stores/locationStore'
import { useWishlistStore } from './stores/wishlistStore'

const currencyStore = useCurrencyStore()
const locationStore = useLocationStore()
const wishlistStore = useWishlistStore()

onMounted(() => {
  // Silent init: locations (cached, non-blocking)
  locationStore.loadAllLocations()
  // Determine currency based on IP
  currencyStore.determineCurrency()
  // Load wishlist (from server if logged in, else local cache)
  wishlistStore.fetchWishlist()
})
</script>

<style>
/* Global styles */
</style>