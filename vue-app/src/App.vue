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
    <Footer class="d-none d-md-block" />
    <div class="d-md-none bg-dark text-white py-4 px-3 mt-5 mobile-footer-compact">
      <div class="text-center small mb-3">
        <img src="/images/logo.png" alt="JewelT'Aime" style="height: 24px; filter: brightness(0) invert(1);">
      </div>
      <div class="d-flex justify-content-center flex-wrap gap-3 mb-2">
        <router-link to="/policies/privacy" class="text-white-50 small text-decoration-none">Privacy</router-link>
        <router-link to="/policies/terms" class="text-white-50 small text-decoration-none">Terms</router-link>
        <router-link to="/policies/returns" class="text-white-50 small text-decoration-none">Returns</router-link>
        <router-link to="/contact" class="text-white-50 small text-decoration-none">Contact</router-link>
      </div>
      <p class="text-white-50 small text-center mb-0">&copy; {{ new Date().getFullYear() }} JewelT'Aime</p>
    </div>
    <MobileBottomNav />
    <CookieConsent />
    <AppModal />
    <GemsBotChat />
    <CartToast :visible="cartToastVisible" message="Added to cart!" :sub-message="cartToastSub" @update:visible="cartToastVisible = $event" />
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import CookieConsent from './components/CookieConsent.vue'
import AppModal from './components/AppModal.vue'
import GemsBotChat from './components/GemsBotChat.vue'
import CartToast from './components/CartToast.vue'
import { useCurrencyStore } from './stores/currencyStore'
import { useLocationStore } from './stores/locationStore'
import { useWishlistStore } from './stores/wishlistStore'
import { useSiteSettingsStore } from './stores/siteSettingsStore'

const currencyStore = useCurrencyStore()
const locationStore = useLocationStore()
const wishlistStore = useWishlistStore()
const siteSettings = useSiteSettingsStore()

// Cart toast state — provided to all child components for triggering
const cartToastVisible = ref(false)
const cartToastSub = ref('')
provide('showCartToast', (subMsg = '') => {
  cartToastSub.value = subMsg
  cartToastVisible.value = true
})

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

/* ==============================================
   Mobile Native-App Global Styles
   ============================================== */
html {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-y: none;
  /* Momentum/elastic scroll on iOS */
  -webkit-overflow-scrolling: touch;
}

body {
  overscroll-behavior-y: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Prevent pull-to-refresh (PWA feel) */
  overflow-y: auto;
}

/* Safe area insets for notched devices */
#pageWrapper {
  padding-top: env(safe-area-inset-top, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

@media (max-width: 767.98px) {
  #pageWrapper {
    /* Space for the fixed bottom nav bar */
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 16px));
  }

  /* Native-style scrolling containers */
  .page-transition-wrapper {
    min-height: 70vh;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
}

/* Remove default focus outlines on touch devices, add custom ones */
@media (pointer: coarse) {
  *:focus {
    outline: none;
  }
}

/* Smooth momentum scroll for all scrollable elements */
* {
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection on repeated taps (app-like) */
@media (max-width: 767.98px) {
  a, button, .nav-item {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}

/* ==============================================
   Mobile App-Screen Page Styles (All Pages)
   ============================================== */
@media (max-width: 767.98px) {
  /* --- Remove desktop cruft --- */
  .breadcrumb,
  nav[aria-label="breadcrumb"] {
    display: none !important;
  }

  /* Banner headers — compact for mobile */
  .bannerHead,
  .bannerheader {
    min-height: 120px !important;
    max-height: 160px !important;
  }
  .bannerHead .hhHeading,
  .bannerheader .hhHeading {
    font-size: 1.5rem !important;
  }
  .bannerHead .HDii,
  .bannerheader .HDii {
    font-size: 1.4rem !important;
  }

  /* Product grids — 2 columns */
  .itemContentBlock .row-cols-3 > *,
  .itemContentBlock .col-xl-4,
  .isoContentHolder .col-sm-6 {
    width: 50% !important;
    flex: 0 0 50% !important;
    max-width: 50% !important;
  }

  /* Hide sidebar on product listing */
  .shopSidebar,
  aside.shopSidebar,
  .col-lg-3:has(.shopSidebar) {
    display: none !important;
  }
  .itemContentBlock .col-lg-9 {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  /* Full-width containers on mobile */
  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* Compact section spacing */
  section,
  .itemContentBlock,
  .collectionBlock {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }

  /* Compact page headings */
  h1.mnHding,
  .mnHding {
    font-size: 1.4rem !important;
    margin-bottom: 1.5rem !important;
  }

  /* Featured products filter tabs — scrollable */
  .cbFiltersList,
  .isoFiltersList {
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    gap: 1rem !important;
    padding-bottom: 8px;
    scrollbar-width: none;
  }
  .cbFiltersList::-webkit-scrollbar,
  .isoFiltersList::-webkit-scrollbar {
    display: none;
  }
  .cbFiltersList li,
  .isoFiltersList li {
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* --- Cart: Card-based layout on mobile --- */
  .carttablewrap .table-responsive {
    display: none !important;
  }
  .carttablewrap .row > .col-xl-9 {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  /* Cart item cards */
  .cart-item-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 0.5px solid rgba(0,0,0,0.06);
  }
  .cart-item-card img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .cart-item-card .item-info {
    flex: 1;
    min-width: 0;
  }
  .cart-item-card .item-name {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cart-item-card .item-meta {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 6px;
  }
  .cart-item-card .item-price {
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 6px;
  }
  .cart-item-card .qty-control {
    display: inline-flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
  .cart-item-card .qty-control button {
    width: 32px;
    height: 32px;
    border: none;
    background: #f5f5f5;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cart-item-card .qty-control input {
    width: 40px;
    text-align: center;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    background: transparent;
  }
  .cart-item-card .remove-btn {
    margin-left: auto;
    color: #ccc;
    font-size: 1.2rem;
    padding: 4px;
    background: none;
    border: none;
  }

  /* Cart sidebar (totals) — full width, no offset */
  .cartSide {
    margin-left: 0 !important;
    border-radius: 12px;
    margin-top: 1rem;
  }

  /* Coupon form — stack */
  .couponform {
    width: 100%;
  }

  /* Checkout — full-width form fields */
  .checkout-page .col-lg-7,
  .checkout-page .col-lg-5 {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  /* Home categories — 3 per row */
  .categoriesBlock .chCol {
    width: 33.33% !important;
    flex: 0 0 33.33% !important;
  }
  .categoriesBlock .ctHeading {
    font-size: 0.7rem !important;
  }
  .categoriesBlock .imgHolder {
    width: 60px !important;
    height: 60px !important;
  }

  /* Product card sizing */
  .productColumn .imgHolder {
    border-radius: 8px;
    overflow: hidden;
  }
  .productColumn .pcHeading {
    font-size: 0.85rem !important;
  }
  .productColumn .pcPrice {
    font-size: 0.85rem !important;
  }

  /* Form inputs — iOS-style */
  input.form-control,
  select.form-select,
  textarea.form-control {
    border-radius: 10px !important;
    padding: 12px 16px !important;
    font-size: 1rem !important;
    border: 1px solid #e0e0e0 !important;
    -webkit-appearance: none;
  }
  input.form-control:focus,
  select.form-select:focus,
  textarea.form-control:focus {
    border-color: #000 !important;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.08) !important;
  }

  /* Buttons — full-width on mobile */
  button.btn,
  a.btn {
    border-radius: 10px !important;
    font-weight: 500 !important;
    padding: 12px 24px !important;
  }

  /* Remove desktop horizontal rules on mobile */
  hr.my-0 {
    display: none !important;
  }

  /* Sign-in/Register pages — full-width cards */
  .signin-page .col-md-6,
  .register-page .col-md-6 {
    width: 100% !important;
  }

  /* Promo banner compact */
  .badgerIIAsideBlock {
    padding: 0.5rem 0 !important;
  }
  .badgerIIAsideBlock .babHeading {
    font-size: 0.85rem !important;
  }

  /* Trust badges — 2 per row */
  .featuresBlock ul {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1.5rem 0.5rem !important;
  }
  .featuresBlock .fbbHeading {
    font-size: 0.85rem !important;
  }

  /* Intro slider — compact height */
  .introBlock .ibsColumn {
    flex-direction: column-reverse !important;
  }
  .introBlock .ibsColumn .imgHolder {
    max-height: 200px !important;
    overflow: hidden;
  }
  .introBlock .ibsColumn .imgHolder img {
    object-fit: cover;
    height: 200px !important;
  }
  .introBlock .pddngS {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
  .introBlock .hhHeadingI {
    font-size: 1.3rem !important;
  }
}
</style>
