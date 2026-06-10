<template>
  <article class="productColumn text-center text-decoration-none position-relative d-block overflow-hidden">
      <div class="imgHolder mb-2">
          <router-link :to="`/products/${product.id || 1}`">
              <img :src="product.image || 'https://placehold.co/305x305'" class="w-100 img-fluid" :alt="product.name">
          </router-link>
          <strong v-if="product.sale" class="position-absolute text-uppercase bg-danger fw-semibold text-white pcTag">-30%</strong>
          <ul class="list-unstyled d-flex flex-column gap-1 pcActionsList">
              <li>
                  <a href="javascript:void(0);" class="rounded-circle d-flex align-items-center justify-content-center">
                      <i class="icomoon-heart-o">
                          <span class="visually-hidden">favourite</span>
                      </i>
                  </a>
              </li>
              <li>
                  <a href="javascript:void(0);" class="rounded-circle d-flex align-items-center justify-content-center">
                      <i class="icomoon-search">
                          <span class="visually-hidden">explore</span>
                      </i>
                  </a>
              </li>
          </ul>
      </div>
      <strong class="d-block mb-1 fw-normal pcTitle">{{ product.category }}</strong>
      <h3 class="fw-light pcHeading mb-1">
          <router-link :to="`/products/${product.id || 1}`" class="text-decoration-none">{{ product.name }}</router-link>
      </h3>
      <h4 class="fw-normal pcPrice mb-0">
          <span v-if="product.sale" class="salePrice">£{{ product.price.toFixed(2) }}</span>
          <span class="regPrice" :class="{'text-decoration-line-through': product.sale, 'ms-2': product.sale}">
              £{{ product.originalPrice ? product.originalPrice.toFixed(2) : product.price.toFixed(2) }}
          </span>
      </h4>
      <button @click="addToCart" class="pcBtnSubmit position-absolute fw-medium p-0 border-0">ADD TO CART</button>
  </article>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  product: {
      type: Object,
      required: true
  }
})

const cartStore = useCartStore()

const addToCart = () => {
  cartStore.addToCart(props.product)
  
  // Show offcanvas via Bootstrap API if needed, 
  // or just let the reactive cart count update.
  const cartOffcanvas = document.getElementById('filtersProduct')
  if (cartOffcanvas) {
      if (typeof window.bootstrap !== 'undefined') {
          const bsOffcanvas = new window.bootstrap.Offcanvas(cartOffcanvas)
          bsOffcanvas.show()
      }
  }
}
</script>
