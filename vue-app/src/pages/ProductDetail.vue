<template>
  <main>
      <!-- Banner Header matching shop-right-sidebar.html -->
      <header class="bannerHead bannerheader w-100 overflow-hidden position-relative d-flex text-center">
          <div class="alignHolder w-100 d-flex">
              <div class="align my-auto py-2 w-100">
                  <div class="container headingHead">
                      <h1 class="hhHeading HDii">{{ product.name || 'Product Details' }}</h1>
                      <nav aria-label="breadcrumb">
                          <ol class="breadcrumb justify-content-center">
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
          <span class="bgCover w-100 h-100 position-absolute bhBgImage" :style="{ backgroundImage: `url('${categoryBanner || 'https://cdn.jeweltaime.com/img63.jpg'}')` }"></span>
      </header>

      <!-- Product Details Area -->
      <div class="twoColumns w-100 position-relative overflow-hidden py-6 py-md-8 py-xl-10">
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
                          <!-- Bootstrap Carousel with auto-scroll -->
                          <div id="productCarousel" class="carousel slide mb-4" data-bs-ride="carousel" data-bs-interval="3000">
                              <!-- Indicators -->
                              <div class="carousel-indicators">
                                  <button v-for="(img, index) in productImages" :key="'ind-' + index"
                                      type="button"
                                      data-bs-target="#productCarousel"
                                      :data-bs-slide-to="index"
                                      :class="{ active: index === activeSlide }"
                                      :aria-current="index === activeSlide ? 'true' : undefined"
                                      :aria-label="'Slide ' + (index + 1)"
                                      @click="activeSlide = index">
                                  </button>
                              </div>
                              <!-- Slides -->
                              <div class="carousel-inner">
                                  <div v-for="(img, index) in productImages" :key="'slide-' + index"
                                      class="carousel-item" :class="{ active: index === activeSlide }">
                                      <img :src="img" class="d-block w-100 img-fluid" :alt="product.name + ' - Image ' + (index + 1)">
                                  </div>
                              </div>
                              <!-- Controls -->
                              <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                  <span class="visually-hidden">Previous</span>
                              </button>
                              <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                  <span class="visually-hidden">Next</span>
                              </button>
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
                                  <h3 class="HPrice fw-normal mb-4">{{ currencyStore.formatPrice(displayPrice) }}</h3>
                                  <!-- Variant Selector (only shown when multiple variants exist) -->
                                  <div v-if="product.variants && product.variants.length > 1" class="mb-4">
                                      <strong class="d-block mb-2 fw-normal">Variants:</strong>
                                      <div class="d-flex flex-wrap gap-2">
                                          <button v-for="variant in product.variants" :key="variant.id"
                                              type="button"
                                              class="btn position-relative px-3 py-2"
                                              :class="selectedVariantId === variant.id ? 'btn-dark' : 'btn-outline-dark'"
                                              @click="selectVariant(variant.id)">
                                              {{ variant.variantName }}
                                              <span v-if="variant.additionalPrice > 0"
                                                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                                  style="font-size: 0.65rem;">
                                                  +{{ currencyStore.formatPrice(variant.additionalPrice) }}
                                              </span>
                                          </button>
                                      </div>
                                      <small v-if="selectedVariant" class="d-block mt-2 text-muted">
                                          Selected: <strong>{{ selectedVariant.variantName }}</strong>
                                          <span v-if="selectedVariant.additionalPrice > 0"> (+{{ currencyStore.formatPrice(selectedVariant.additionalPrice) }})</span>
                                      </small>
                                  </div>
                                  <p class="fw-light mb-1">
                                      {{ product.description || 'This regulator has a rolled diaphragm and high flow rate with reduced pressure drop. It has an excellent degree of condensation.' }}
                                  </p>
                                  <strong class="TxtPro">Availability: <span class="productStock fw-normal">In Stock</span></strong>
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
                                      <li v-if="socialLinks.facebook">
                                        <a :href="facebookShareUrl" target="_blank" rel="noopener" class="text-decoration-none"><i class="icomoon-facebook facebookIcn"></i></a>
                                      </li>
                                      <li v-if="socialLinks.twitter">
                                        <a :href="twitterShareUrl" target="_blank" rel="noopener" class="text-decoration-none"><i class="icomoon-twitter twitterIcn"></i></a>
                                      </li>
                                      <li v-if="socialLinks.instagram">
                                        <a :href="socialLinks.instagram" target="_blank" rel="noopener" class="text-decoration-none"><i class="icomoon-instagram instagramIcn"></i></a>
                                      </li>
                                      <li v-if="socialLinks.pinterest">
                                        <a :href="pinterestShareUrl" target="_blank" rel="noopener" class="text-decoration-none"><i class="icomoon-pinterest pinterestIcn"></i></a>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>

                      <!-- Accordion Section (inside product info column like shop-accordion.html) -->
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
                  </div>
              </div>
          </div>
      </div>

      <!-- Newsletter / Discount Section matching shop-right-sidebar.html -->
      <aside class="discountAsideBlock text-center w-100 position-relative py-6 py-lg-9 py-xl-15">
          <div class="container">
              <div class="row">
                  <div class="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
                      <div class="px-xl-6 px-xxl-16">
                          <h3 class="sabHeading fw-light mb-4">End of Summer!<br> <span class="fw-medium">Up to 20% off</span> on all items.</h3>
                          <form action="#" class="subscribeForm" @submit.prevent>
                              <div class="d-flex flex-column flex-sm-row mb-4">
                                  <input type="email" class="form-control border-0" placeholder="Email address">
                                  <button type="submit" class="btn btnTheme border-0 text-uppercase">Signup</button>
                              </div>
                              <label class="d-block fw-normal">Sign up to our Newsletter and get the discount code.</label>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </aside>

      <!-- Features Block matching shop-right-sidebar.html -->
      <aside class="featuresBlock text-center w-100 position-relative py-9">
          <div class="container">
              <ul class="list-unstyled d-flex flex-wrap justify-content-around gap-1 mb-0">
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-01.svg" width="37" height="30" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Free Shipping</h3>
                      <h4 class="fbbSubheading fw-light mb-0">For all orders over $100</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-02.svg" width="37" height="33" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">30 Days Return</h3>
                      <h4 class="fbbSubheading fw-light mb-0">For an Exchange Product</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-03.svg" width="37" height="29" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Secured Payment</h3>
                      <h4 class="fbbSubheading fw-light mb-0">Payment Cards Accepted</h4>
                  </li>
                  <li>
                      <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
                          <img src="/images/ico-04.svg" width="37" height="37" alt="icon">
                      </i>
                      <h3 class="fbbHeading fw-normal mb-0">Support 24/7</h3>
                      <h4 class="fbbSubheading fw-light mb-0">Contact us Anytime.</h4>
                  </li>
              </ul>
          </div>
      </aside>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCurrencyStore } from '../stores/currencyStore'
import { useSiteSettingsStore } from '../stores/siteSettingsStore'
import { useCategoryStore } from '../stores/categoryStore'
import { toSlug } from '../utils/slug'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const currencyStore = useCurrencyStore()
const siteSettings = useSiteSettingsStore()
const categoryStore = useCategoryStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const socialLinks = computed(() => ({
  facebook: siteSettings.facebookLink,
  twitter: siteSettings.twitterLink,
  instagram: siteSettings.instagramLink,
  pinterest: siteSettings.pinterestLink
}))

const quantity = ref(1)
const activeSlide = ref(0)
const selectedVariantId = ref(null)
const isLoading = ref(false)
const error = ref('')

const product = ref({
  id: '',
  name: '',
  category: '',
  categoryId: null,
  price: 0,
  thumbnailUrl: '',
  sku: '',
  description: '',
  supplierName: '',
  variants: [],
  media: []
})

// Route is /products/:id/:slug — id is always available as a numeric param
const productId = computed(() => route.params.id)
const productSlug = computed(() => route.params.slug || '')

const isWishlisted = computed(() => wishlistStore.isInWishlist(product.value.id))

const shareUrl = computed(() => encodeURIComponent(window.location.href))
const shareTitle = computed(() => encodeURIComponent(product.value.name))

const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${shareUrl.value}`)
const twitterShareUrl = computed(() => `https://twitter.com/intent/tweet?url=${shareUrl.value}&text=${shareTitle.value}`)
const pinterestShareUrl = computed(() => `https://pinterest.com/pin/create/button/?url=${shareUrl.value}&description=${shareTitle.value}`)

// Category banner for header background (1920x300) — uses category store for real banner images
const categoryBanner = computed(() => {
  // Direct ID lookup is most reliable
  if (product.value.categoryId) {
    const cat = categoryStore.getCategoryById(product.value.categoryId)
    if (cat?.bannerUrl) return cat.bannerUrl
  }
  // Fallback slug-based lookup
  if (product.value.category) {
    const slugCandidates = [
      product.value.category.toLowerCase().replace(/[\s&]+/g, '-'),
      product.value.category.toLowerCase().replace(/\s+/g, '-'),
      product.value.category.replace(/\s+/g, '')
    ]
    for (const slug of slugCandidates) {
      const cat = categoryStore.getCategoryBySlug(slug)
      if (cat?.bannerUrl) return cat.bannerUrl
    }
  }
  return null
})

// Selected variant object
const selectedVariant = computed(() => {
  if (!selectedVariantId.value) return null
  return product.value.variants.find(v => v.id === selectedVariantId.value) || null
})

// Display price: base + variant additional
const displayPrice = computed(() => {
  const base = product.value.price || 0
  const additional = selectedVariant.value?.additionalPrice || 0
  return base + additional
})

// Product images for carousel — uses variant media if selected, else base media, fallback to thumbnailUrl
const productImages = computed(() => {
  const fallback = product.value.thumbnailUrl || 'https://placehold.co/685x685'
  if (selectedVariant.value?.media?.length) {
    return selectedVariant.value.media
      .filter(m => m.type === 'IMAGE')
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(m => m.url || fallback)
  }
  if (product.value.media?.length) {
    return product.value.media
      .filter(m => m.type === 'IMAGE')
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(m => m.url || fallback)
  }
  return [fallback, fallback, fallback, fallback]
})

function selectVariant(variantId) {
  selectedVariantId.value = selectedVariantId.value === variantId ? null : variantId
  activeSlide.value = 0
  nextTick(() => {
    const carouselEl = document.getElementById('productCarousel')
    if (carouselEl && window.bootstrap) {
      const carousel = window.bootstrap.Carousel.getOrCreateInstance(carouselEl)
      carousel.to(0)
    }
  })
}

const productSlugDisplay = computed(() => {
  if (product.value.name) {
    return toSlug(product.value.name)
  }
  return ''
})

// Navigate carousel to specific slide
function goToSlide(index) {
  activeSlide.value = index
  const carouselEl = document.getElementById('productCarousel')
  if (carouselEl && window.bootstrap) {
    const carousel = window.bootstrap.Carousel.getOrCreateInstance(carouselEl)
    carousel.to(index)
  }
}

// Sync activeSlide when Bootstrap carousel auto-scrolls
function onCarouselSlide(event) {
  activeSlide.value = event.to
}

function initCarouselListener() {
  nextTick(() => {
    const carouselEl = document.getElementById('productCarousel')
    if (carouselEl) {
      carouselEl.addEventListener('slid.bs.carousel', onCarouselSlide)
    }
  })
}

function removeCarouselListener() {
  const carouselEl = document.getElementById('productCarousel')
  if (carouselEl) {
    carouselEl.removeEventListener('slid.bs.carousel', onCarouselSlide)
  }
}

async function fetchProduct() {
  isLoading.value = true
  error.value = ''

  const id = productId.value
  if (!id) {
    isLoading.value = false
    error.value = 'Product not found.'
    return
  }

  try {
    // Call API directly with the numeric id from route param
    const response = await axios.get(`${API_BASE}/api/v1/products/${id}`)
    if (response.data) {
      const p = response.data
      product.value = {
        id: p.id,
        name: p.name,
        category: p.categoryName || 'Jewelry',
        categoryId: p.categoryId || null,
        price: p.basePriceUsd || 0,
        thumbnailUrl: p.thumbnailUrl || '',
        sku: p.sku || '',
        description: p.shortDescription || p.description || '',
        supplierName: p.supplierName || '',
        variants: (p.variants || []).map(v => ({
          id: v.id,
          variantName: v.variantName,
          additionalPrice: v.additionalPrice || 0,
          media: (v.media || []).map(m => ({
            id: m.id, type: m.type, url: m.url, isPrimary: m.isPrimary, sortOrder: m.sortOrder
          }))
        })),
        media: (p.media || []).map(m => ({
          id: m.id, type: m.type, url: m.url, isPrimary: m.isPrimary, sortOrder: m.sortOrder
        }))
      }
      // Auto-select single variant, reset for multiple
      selectedVariantId.value = (p.variants || []).length === 1 ? p.variants[0].id : null
    }
  } catch (e) {
    console.warn('Failed to fetch product:', e.message)
    // Fallback to demo product
    product.value = {
      id: productId.value,
      name: 'Blue Stripes & Stone Bracelet',
      category: 'BRACELETS',
      price: 199.00,
      thumbnailUrl: '',
      sku: 'DEMO-001',
      description: 'Cookie dragee croissant dessert. Powder marshmallow pie wafer dessert sweet roll tootsie roll cupcake.',
      supplierName: 'Demo Supplier'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  categoryStore.loadCategories()
  fetchProduct()
  initCarouselListener()
})

onBeforeUnmount(() => {
  removeCarouselListener()
})

// Re-init carousel listener after product loads (DOM updates)
watch(() => isLoading.value, (newVal) => {
  if (!newVal) {
    activeSlide.value = 0
    initCarouselListener()
  }
})

watch(() => route.params.id, () => {
  removeCarouselListener()
  fetchProduct()
})

const addToCart = () => {
  const variant = selectedVariant.value
  const itemToAdd = {
    id: product.value.id,
    name: product.value.name + (variant ? ` - ${variant.variantName}` : ''),
    category: product.value.category,
    price: displayPrice.value,
    image: productImages.value[0] || product.value.thumbnailUrl,
    sku: product.value.sku,
    variantId: variant?.id || null,
    variantName: variant?.variantName || null,
    quantity: quantity.value
  }
  
  // Use composite key for variant items
  const cartKey = variant ? `${itemToAdd.id}-v${variant.id}` : String(itemToAdd.id)
  const existingItem = cartStore.items.find(item => {
    const ik = item.variantId ? `${item.id}-v${item.variantId}` : String(item.id)
    return ik === cartKey
  })
  if (existingItem) {
    cartStore.updateQuantity(existingItem.id, existingItem.quantity + itemToAdd.quantity)
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
  const variant = selectedVariant.value
  const itemToAdd = {
    id: product.value.id,
    name: product.value.name + (variant ? ` - ${variant.variantName}` : ''),
    category: product.value.category,
    price: displayPrice.value,
    image: productImages.value[0] || product.value.thumbnailUrl,
    sku: product.value.sku,
    variantId: variant?.id || null,
    variantName: variant?.variantName || null,
    quantity: quantity.value
  }

  const cartKey = variant ? `${itemToAdd.id}-v${variant.id}` : String(itemToAdd.id)
  const existingItem = cartStore.items.find(item => {
    const ik = item.variantId ? `${item.id}-v${item.variantId}` : String(item.id)
    return ik === cartKey
  })
  if (existingItem) {
    cartStore.updateQuantity(existingItem.id, existingItem.quantity + itemToAdd.quantity)
  } else {
    cartStore.items.push(itemToAdd)
  }

  router.push('/checkout')
}
</script>