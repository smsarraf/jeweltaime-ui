<template>
  <nav class="mobile-bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
      <span class="nav-icon"><i class="fa-solid fa-house"></i></span>
      <span>Home</span>
    </router-link>
    <router-link to="/products" class="nav-item" :class="{ active: $route.path.startsWith('/products') || $route.path.startsWith('/category') }">
      <span class="nav-icon"><i class="fa-solid fa-compass"></i></span>
      <span>Shop</span>
    </router-link>
    <router-link to="/cart" class="nav-item cart-nav-item" :class="{ active: $route.path === '/cart' }">
      <span class="nav-icon">
        <div class="cart-icon-wrapper">
          <i class="fa-solid fa-bag-shopping"></i>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
        </div>
      </span>
      <span>Cart</span>
    </router-link>
    <router-link to="/wishlist" class="nav-item" :class="{ active: $route.path === '/wishlist' }">
      <span class="nav-icon"><i class="fa-regular fa-heart"></i></span>
      <span>Wishlist</span>
    </router-link>
    <router-link to="/dashboard" class="nav-item" :class="{ active: ['/dashboard', '/profile', '/orders'].includes($route.path) }">
      <span class="nav-icon"><i class="fa-regular fa-circle-user"></i></span>
      <span>{{ isLoggedIn ? 'Account' : 'Sign In' }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { isAuthenticated } from '../utils/auth'

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalCount)
const isLoggedIn = computed(() => isAuthenticated())
</script>

<style scoped>
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1050;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
  padding: 6px 4px env(safe-area-inset-bottom, 8px);
  justify-content: space-around;
  align-items: flex-start;
  height: calc(64px + env(safe-area-inset-bottom, 0px));
}

@media (max-width: 767.98px) {
  .mobile-bottom-nav {
    display: flex;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 8px;
  min-width: 56px;
  text-decoration: none;
  color: #8e8e93;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1px;
  transition: color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
}

.nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.nav-icon i {
  font-size: 22px;
  line-height: 1;
}

.nav-item i {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item.active {
  color: #000;
}

.nav-item.active i {
  transform: scale(1.05);
}

.nav-item:active {
  opacity: 0.6;
}

.nav-item:active i {
  transform: scale(0.92);
}

.cart-icon-wrapper {
  position: relative;
  display: inline-flex;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #ff3b30;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  border: 1.5px solid #fff;
}

</style>
