<template>
  <main>
      <header class="d-flex text-center breadCrumbHeader">
          <div class="alignHolder w-100 d-flex">
              <div class="align py-2 w-100">
                  <div class="container">
                      <nav aria-label="breadcrumb">
                          <ol class="breadcrumb">
                              <li class="breadcrumb-item">
                                  <router-link to="/" class="text-decoration-none">Home</router-link>
                              </li>
                              <li class="breadcrumb-item">
                                  <router-link to="/products" class="text-decoration-none">Shop</router-link>
                              </li>
                              <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
                          </ol>
                      </nav>
                  </div>
              </div>
          </div>
      </header>
      <section class="position-relative w-100 overflow-hidden py-2 mb-8 mb-md-10 mb-lg-15 mb-xlwd-19 productDetailsArea border-0">
          <div class="container">
              <div v-if="isLoading" class="text-center py-10">
                  <div class="spinner-border text-dark" role="status">
                      <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted">Loading product...</p>
              </div>
              <div v-else-if="error" class="text-center py-10">
                  <p class="text-danger">{{ error }}</p>
                  <router-link to="/products" class="btn btn-dark">Back to Shop</router-link>
              </div>
              <div v-else class="productsDetailsWrapper WrapII row">
                  <div class="col-12 col-md-6 col-xlwd-6">
                      <div class="images">
                          <div class="preview-image mb-4">
                              <div class="position-relative">
                                  <a :href="product.image" class="sliderImgBtn overflow-hidden lightbox" data-fancybox="true">
                                      <i class="icn icomoon-expand"></i>
                                  </a>
                                  <img class="img w-100 img-fluid sliderImg" :src="product.image" :alt="product.name">
                              </div>
                          </div>
                          <div class="imagesBlock d-flex flex-wrap">
                              <div class="imagsItems me-4 mb-4">
                                  <img class="w-100 img-fluid" :src="product.image" alt="image description">
                              </div>
                              <div class="imagsItems mb-4">
                                  <img class="w-100 img-fluid" :src="product.image" alt="image description">
                              </div>
                              <div class="imagsItems me-4 mb-4">
                                  <img class="w-100 img-fluid" :src="product.image" alt="image description">
                              </div>
                              <div class="imagsItems mb-4">
                                  <img class="w-100 img-fluid" :src="product.image" alt="image description">
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-12 col-md-6 col-xlwd-5">
                      <div class="productInfo mb-7">
                          <div class="productInfodetails py-sm-2 px-sm-1">
                              <div class="productInfoheader mb-6">
                                  <h2 class="PrdutHd fw-normal mb-1">{{ product.name }}</h2>
                                  <div class="d-flex gap-2 align-items-center mb-2">
                                      <ul class="d-flex flex-wrap ratingStar list-unstyled mb-0">
                                          <li class="active"><i class="icomoon-star"></i></li>
                                          <li class="active"><i class="icomoon-star"></i></li>
                                          <li class="active"><i class="icomoon-star"></i></li>
                                          <li class="active"><i class="icomoon-star"></i></li>
                                          <li><i class="icomoon-star"></i></li>
                                      </ul>
                                      <span class="reviewHD fw-normal">(25 Customer reviews)</span>
                                  </div>
                                  <h3 class="HPrice fw-normal mPrb-4">{{ currencyStore.formatPrice(product.price) }}</h3>
                                  <p class="fw-light mb-1">
                                      {{ product.description || 'This regulator has a rolled diaphragm and high flow rate with reduced pressure drop. It has an excellent degree of condensation.' }}
                                  </p>
                                  <strong class="TxtPro">Availability: <span class="productStock fw-normal">In Stock</span></strong>
                                  <div v-if="product.sku" class="mt-2">
                                      <small class="text-muted">SKU: {{ product.sku }}</small>
                                  </div>
                              </div>
                              <div class="mb-6">
                                  <div class="butttonsWraper mb-8">
                                      <div class="d-flex align-items-center mb-4">
                                          <div class="input-group position-relative me-3">
                                              <button class="btn btn-minus border-0" @click="quantity > 1 && quantity--"><i class="fa-solid fa-minus"></i></button>
                                              <input type="text" class="form-control text-center fw-light px-6" min="1" v-model="quantity" readonly>
                                              <button class="btn btn-plus border-0" @click="quantity++"><i class="fa-regular fa-plus"></i></button>
                                          </div>
                                          <a href="javascript:void(0);" class="btn btnTheme submitButton fw-medium text-uppercase" @click="addToCart">Add To Cart</a>
                                      </div>
                                      <a href="javascript:void(0);" class="btn btn-light submitButton btnII fw-medium text-uppercase" @click="buyItNow">BUY IT NOW</a>
                                  </div>
                                  <div class="d-flex btnsWrapper mb-11">
                                      <a href="javascript:void(0);" class="guide-chart-btn wishListBtn text-decoration-none mb-2 mb-sm-0 me-3 me-sm-7 fw-normal" @click="toggleWishlist">
                                          <i :class="isWishlisted ? 'icomoon-heart' : 'icomoon-heart-o'"></i> {{ isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}
                                      </a>
                                      <a href="javascript:void(0);" class="guide-chart-btn sizeBtn fw-normal text-decoration-none">
                                          <i class="icomoon-th-grid"></i> Size Guide
                                      </a>
                                  </div>
                              </div>
                              <ul class="list-unstyled sku-list mb-8 fw-light">
                                  <li class="mb-2">
                                      <span class="productInformation">SKU:</span> 
                                      <span class="productInformationDetails">{{ product.sku || 'N/A' }}</span>
                                  </li>
                                  <li class="mb-2">
                                      <span class="productInformation">Category:</span>
                                      <span class="productInformationDetails">{{ product.category }}</span>
                                  </li>
                              </ul>
                              <div class="d-flex socialNetworksIcons">
                                  <span class="socialHD fw-normal me-3">Share:</span>
                                  <ul class="list-unstyled socialNetworks d-flex flex-wrap gap-4 gap-sm-2 gap-md-4 mb-0">
                                      <li><a href="javascript:void(0);" class="text-decoration-none"><i class="icomoon-facebook facebookIcn"></i></a></li>
                                      <li><a href="javascript:void(0);" class="text-decoration-none"><i class="icomoon-twitter twitterIcn"></i></a></li>
                                      <li><a href="javascript:void(0);" class="text-decoration-none"><i class="icomoon-instagram instagramIcn"></i></a></li>
                                      <li><a href="javascript:void(0);" class="text-decoration-none"><i class="icomoon-pinterest pinterestIcn"></i></a></li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <!-- Accordion Section -->
      <section class="container pb-6 pb-md-8">
          <div class="accordion product-accordion" id="productAccordion">
              <div class="accordion-item">
                  <h2 class="accordion-header" id="headingDesc">
                      <button class="accordion-button fw-normal rounded-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDesc" aria-expanded="true" aria-controls="collapseDesc">
                          Description
                      </button>
                  </h2>
                  <div id="collapseDesc" class="accordion-collapse collapse show" aria-labelledby="headingDesc" data-bs-parent="#productAccordion">
                      <div class="accordion-body">
                          <p>{{ product.description || 'Cookie dragee croissant dessert. Powder marshmallow pie wafer dessert sweet roll tootsie roll cupcake. Tart oat cake lollipop lollipop halvah chupa chups bonbon sugar plum dessert.' }}</p>
                      </div>
                  </div>
              </div>
              <div class="accordion-item">
                  <h2 class="accordion-header" id="headingInfo">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
                          Additional Information
                      </button>
                  </h2>
                  <div id="collapseInfo" class="accordion-collapse collapse" aria-labelledby="headingInfo" data-bs-parent="#productAccordion">
                      <div class="accordion-body mb-6">
                          <table class="table DetalsTable table-bordered mb-0">
                              <tbody>
                                  <tr><th class="text-uppercase fw-medium py-3 px-6">SKU</th><td class="py-3 px-6">{{ product.sku || 'N/A' }}</td></tr>
                                  <tr><th class="text-uppercase fw-medium py-3 px-6">Category</th><td class="py-3 px-6">{{ product.category }}</td></tr>
                                  <tr><th class="text-uppercase fw-medium py-3 px-6">Supplier</th><td class="py-3 px-6">{{ product.supplierName || 'N/A' }}</td></tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCurrencyStore } from '../stores/currencyStore'
import { toSlug } from '../utils/slug'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const currencyStore = useCurrencyStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const quantity = ref(1)
const isLoading = ref(false)
const error = ref('')

const product = ref({
  id: '',
  name: '',
  category: '',
  price: 0,
  image: 'https://placehold.co/685x685',
  sku: '',
  description: '',
  supplierName: ''
})

const productSlug = computed(() => route.params.slug || route.params.id)

/**
 * Extracts the numeric product ID from a slug in the format "product-name-123".
 */
const productId = computed(() => {
  const slug = productSlug.value
  if (!slug) return ''
  // Try to extract trailing numeric ID from slug (e.g., "blue-bracelet-42" → "42")
  const match = slug.match(/-(\d+)$/)
  if (match) return match[1]
  return slug
})

const isWishlisted = computed(() => wishlistStore.isInWishlist(product.value.id))

const productSlugDisplay = computed(() => {
  if (product.value.name) {
    return toSlug(product.value.name)
  }
  return ''
})

async function fetchProduct() {
  isLoading.value = true
  error.value = ''

  try {
    // Extract numeric ID from slug (e.g., "product-name-42" → "42")
    const slug = productSlug.value
    const idMatch = slug.match(/-(\d+)$/)
    const fetchId = idMatch ? idMatch[1] : slug

    const response = await axios.get(`${API_BASE}/api/v1/products/${fetchId}`)
    if (response.data) {
      const p = response.data
      product.value = {
        id: p.id,
        name: p.name,
        category: p.categoryName || 'Jewelry',
        price: p.basePriceUsd || 0,
        image: 'https://placehold.co/685x685',
        sku: p.sku || '',
        description: p.description || '',
        supplierName: p.supplierName || ''
      }
    }
  } catch (e) {
    console.warn('Failed to fetch product:', e.message)
    // Fallback to demo product
    product.value = {
      id: productId.value,
      name: 'Blue Stripes & Stone Bracelet',
      category: 'BRACELETS',
      price: 199.00,
      image: 'https://placehold.co/685x685',
      sku: 'DEMO-001',
      description: 'Cookie dragee croissant dessert. Powder marshmallow pie wafer dessert sweet roll tootsie roll cupcake.',
      supplierName: 'Demo Supplier'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})

watch(() => route.params.slug, () => {
  fetchProduct()
})

const addToCart = () => {
  const itemToAdd = {
    ...product.value,
    quantity: quantity.value
  }
  
  const existingItem = cartStore.items.find(item => item.id === itemToAdd.id)
  if (existingItem) {
    cartStore.updateQuantity(itemToAdd.id, existingItem.quantity + itemToAdd.quantity)
  } else {
    cartStore.items.push(itemToAdd)
  }
  
  const cartOffcanvas = document.getElementById('filtersProduct')
  if (cartOffcanvas && typeof window.bootstrap !== 'undefined') {
    const bsOffcanvas = new window.bootstrap.Offcanvas(cartOffcanvas)
    bsOffcanvas.show()
  }
}

const toggleWishlist = async () => {
  if (!wishlistStore.isLoggedIn()) {
    const currentPath = route.fullPath
    window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`
    return
  }
  await wishlistStore.toggleWishlist(product.value)
}

const buyItNow = () => {
  const itemToAdd = {
    ...product.value,
    quantity: quantity.value
  }

  const existingItem = cartStore.items.find(item => item.id === itemToAdd.id)
  if (existingItem) {
    cartStore.updateQuantity(itemToAdd.id, existingItem.quantity + itemToAdd.quantity)
  } else {
    cartStore.items.push(itemToAdd)
  }

  router.push('/checkout')
}
</script>