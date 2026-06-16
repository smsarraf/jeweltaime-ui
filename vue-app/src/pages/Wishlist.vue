<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Wishlist</li>
        </ol>
      </nav>
    </div>

    <!-- Not Logged In -->
    <section v-if="!isLoggedIn" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <i class="fa-regular fa-heart text-muted" style="font-size: 4rem; margin-bottom: 1.5rem;"></i>
            <h3 class="mb-3">Please Sign In</h3>
            <p class="mb-5">Sign in to view and manage your wishlist.</p>
            <router-link to="/signin" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Sign In</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty Wishlist -->
    <section v-else-if="wishlistStore.items.length === 0" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <i class="fa-regular fa-heart text-muted" style="font-size: 4rem; margin-bottom: 1.5rem;"></i>
            <h3 class="mb-4">Your wishlist is empty</h3>
            <p class="mb-5">Browse our products and add items you love to your wishlist.</p>
            <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Browse Products</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Wishlist Items -->
    <section v-else class="carttablewrap py-7">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1 class="mnHding fw-normal mb-7">My Wishlist ({{ wishlistStore.totalItems }})</h1>
          </div>
        </div>
        <div class="row">
          <div v-for="item in wishlistStore.items" :key="item.id" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-6">
            <div class="productColumn text-center text-decoration-none position-relative d-block overflow-hidden border pb-4">
              <div class="imgHolder mb-2">
                <router-link :to="`/products/${item.slug || item.id}`">
                  <img :src="item.image || 'https://placehold.co/305x305'" class="w-100 img-fluid" :alt="item.name">
                </router-link>
                <button class="btn btn-sm position-absolute top-0 end-0 m-2 border-0 bg-white rounded-circle" @click="removeItem(item.id)" title="Remove from wishlist">
                  <i class="fa-solid fa-times text-danger"></i>
                </button>
              </div>
              <strong class="d-block mb-1 fw-normal pcTitle">{{ item.category }}</strong>
              <h3 class="fw-light pcHeading mb-1 px-2">
                <router-link :to="`/products/${item.slug || item.id}`" class="text-decoration-none">{{ item.name }}</router-link>
              </h3>
              <h4 class="fw-normal pcPrice mb-3">{{ currencyStore.formatPrice(item.price || 0) }}</h4>
              <button class="btn btn-dark btn-sm fw-medium text-uppercase px-4 py-2" @click="moveToCart(item)">
                <i class="fa-solid fa-cart-plus me-2"></i>Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import { useCurrencyStore } from '../stores/currencyStore'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

const isLoggedIn = computed(() => wishlistStore.isLoggedIn())

const removeItem = async (productId) => {
  await wishlistStore.toggleWishlist({ id: productId })
}

const moveToCart = (product) => {
  cartStore.addToCart(product)
  removeItem(product.id)
  const cartOffcanvas = document.getElementById('filtersProduct')
  if (cartOffcanvas && typeof window.bootstrap !== 'undefined') {
    const bsOffcanvas = new window.bootstrap.Offcanvas(cartOffcanvas)
    bsOffcanvas.show()
  }
}
</script>

<style scoped>
.productColumn .imgHolder {
  position: relative;
  overflow: hidden;
}
.productColumn .pcTitle {
  color: #666;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.productColumn .pcHeading {
  font-size: 1rem;
  line-height: 1.3;
}
.productColumn .pcPrice {
  font-size: 1.1rem;
}
</style>