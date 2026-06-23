<template>
  <article class="productColumn text-center text-decoration-none position-relative d-block overflow-hidden">
    <div class="imgHolder mb-2">
      <router-link :to="`/products/${urlSlug}`">
        <img :src="product.image || 'https://placehold.co/305x305'" class="w-100 img-fluid" :alt="product.name">
      </router-link>
      <strong v-if="product.sale" class="position-absolute text-uppercase bg-danger fw-semibold text-white pcTag">-30%</strong>
      <ul class="list-unstyled d-flex flex-column gap-1 pcActionsList">
        <li>
          <a href="javascript:void(0);" class="rounded-circle d-flex align-items-center justify-content-center" @click="toggleWishlist">
            <i :class="isWishlisted ? 'icomoon-heart' : 'icomoon-heart-o'"><span class="visually-hidden">favourite</span></i>
          </a>
        </li>
        <li>
          <a href="javascript:void(0);" class="rounded-circle d-flex align-items-center justify-content-center">
            <i class="icomoon-search"><span class="visually-hidden">explore</span></i>
          </a>
        </li>
      </ul>
    </div>
    <strong class="d-block mb-1 fw-normal pcTitle">{{ product.category }}</strong>
    <h3 class="fw-light pcHeading mb-1">
      <router-link :to="`/products/${urlSlug}`" class="text-decoration-none">{{ product.name }}</router-link>
    </h3>
    <h4 class="fw-normal pcPrice mb-0">
      <span v-if="product.sale" class="salePrice">{{ currencyStore.formatPrice(product.price) }}</span>
      <span class="regPrice" :class="{'text-decoration-line-through': product.sale, 'ms-2': product.sale}">
        {{ currencyStore.formatPrice(product.originalPrice ? product.originalPrice : product.price) }}
      </span>
    </h4>
    <button @click="addToCart" class="pcBtnSubmit position-absolute fw-medium p-0 border-0">ADD TO CART</button>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCurrencyStore } from '../stores/currencyStore'
import { toSlug } from '../utils/slug'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const currencyStore = useCurrencyStore()

const productId = computed(() => props.product.id || props.product._id)
const isWishlisted = computed(() => wishlistStore.isInWishlist(productId.value))

const urlSlug = computed(() => {
  const slug = toSlug(props.product.name)
  const id = props.product.id || props.product._id
  return id ? `${slug}-${id}` : slug
})

const addToCart = () => {
  cartStore.addToCart(props.product)
  const cartOffcanvas = document.getElementById('filtersProduct')
  if (cartOffcanvas && typeof window.bootstrap !== 'undefined') {
    const bsOffcanvas = new window.bootstrap.Offcanvas(cartOffcanvas)
    bsOffcanvas.show()
  }
}

const toggleWishlist = async () => {
  if (!wishlistStore.isLoggedIn()) {
    window.location.href = '/signin'
    return
  }
  await wishlistStore.toggleWishlist(props.product)
}
</script>