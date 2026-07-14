<template>
  <div id="pageWrapper">
    <Header />
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'page-fade-slide'" mode="out-in">
        <div :key="route.path" class="page-transition-wrapper">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
    <Footer />
    <CookieConsent />
    <AppModal />
    <GemsBotChat />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CookieConsent from './components/CookieConsent.vue'
import AppModal from './components/AppModal.vue'
import GemsBotChat from './components/GemsBotChat.vue'
import { useCurrencyStore } from './stores/currencyStore'
import { useLocationStore } from './stores/locationStore'
import { useWishlistStore } from './stores/wishlistStore'
import { useSiteSettingsStore } from './stores/siteSettingsStore'

const currencyStore = useCurrencyStore()
const locationStore = useLocationStore()
const wishlistStore = useWishlistStore()
const siteSettings = useSiteSettingsStore()

onMounted(() => {
  // Silent init: locations (cached, non-blocking)
  locationStore.loadAllLocations()
  // Determine currency based on IP
  currencyStore.determineCurrency()
  // Load wishlist (from server if logged in, else local cache)
  wishlistStore.fetchWishlist()
  // Load site settings (cached, refreshed in background)
  siteSettings.loadSettings()
})
</script>

<style>
/* Global styles */

/* ==============================================
   Page Transition Animations
   ============================================== */
.page-fade-slide-enter-active,
.page-fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.page-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Alternative: fade-only transition for lighter pages */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Ensure the transition wrapper doesn't cause layout issues */
.page-transition-wrapper {
  min-height: 60vh;
}
</style>
