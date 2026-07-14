<template>
  <div class="b2b-product-detail-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1>{{ product?.name || 'Loading...' }}</h1>
        <p class="subtitle">B2B Product Details</p>
      </div>
    </div>

    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading product details...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger">
        <h4>Unable to load product</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchProduct">Retry</button>
      </div>

      <!-- Product Content -->
      <div v-else-if="product" class="product-content">
        <div class="row">
          <!-- Product Image -->
          <div class="col-md-6 mb-4">
            <div class="product-image-main">
              <img
                v-if="product.media && product.media.length > 0"
                :src="getProductImage(product.media[0])"
                :alt="product.name"
                class="img-fluid"
              />
              <div v-else class="no-image">
                <i class="bi bi-image"></i>
              </div>
            </div>
            <!-- Thumbnail Gallery -->
            <div v-if="product.media && product.media.length > 1" class="thumbnail-gallery mt-3">
              <div
                v-for="(media, index) in product.media"
                :key="index"
                class="thumbnail-item"
                :class="{ active: selectedImage === index }"
                @click="selectedImage = index"
              >
                <img :src="getProductImage(media)" :alt="`${product.name} ${index + 1}`" />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-md-6">
            <div class="product-info-detail">
              <h2 class="product-name">{{ product.name }}</h2>
              <p class="product-sku">SKU: {{ product.sku }}</p>

              <!-- B2B Badge -->
              <div v-if="product.b2bMinQuantity" class="min-qty-badge mb-3">
                <i class="bi bi-box-seam"></i> Min. order: {{ product.b2bMinQuantity }} units
              </div>

              <!-- Pricing -->
              <div class="pricing-section mb-4">
                <div class="retail-price">
                  <span class="label">Retail Price:</span>
                  <span class="price" :class="{ strikethrough: product.hasB2bPricing }">{{ formatPrice(product.basePriceUsd) }}</span>
                </div>
                <div v-if="product.hasB2bPricing && product.b2bUnitPrice" class="b2b-price">
                  <span class="label">B2B Price:</span>
                  <span class="price">{{ formatPrice(product.b2bUnitPrice) }}</span>
                  <span class="discount-badge" v-if="product.b2bDiscountPercentage">{{ product.b2bDiscountPercentage }}% off</span>
                </div>
                <div v-else class="no-b2b-price">
                  <span class="text-muted">Retail price applies</span>
                </div>
              </div>

              <!-- Description -->
              <div class="description-section mb-4">
                <h4>Description</h4>
                <p>{{ product.shortDescription || product.longDescription || 'No description available.' }}</p>
              </div>

              <!-- Variants -->
              <div v-if="product.variants && product.variants.length > 0" class="variants-section mb-4">
                <h4>Variants</h4>
                <div class="variant-list">
                  <div
                    v-for="variant in product.variants"
                    :key="variant.id"
                    class="variant-item"
                    :class="{ selected: selectedVariant?.id === variant.id }"
                    @click="selectedVariant = variant"
                  >
                    <span class="variant-name">{{ variant.variantName }}</span>
                    <span class="variant-price">{{ formatPrice(variant.additionalPrice) }}</span>
                  </div>
                </div>
              </div>

              <!-- Quantity & Add to Quote -->
              <div class="actions-section">
                <div class="quantity-selector mb-3">
                  <label>Quantity:</label>
                  <div class="input-group" style="max-width: 150px;">
                    <button class="btn btn-outline-secondary" type="button" @click="updateQuantity(-1)">-</button>
                    <input v-model.number="quantity" type="number" class="form-control text-center" min="1" />
                    <button class="btn btn-outline-secondary" type="button" @click="updateQuantity(1)">+</button>
                  </div>
                </div>
                <button class="btn btn-primary btn-lg w-100" @click="addToQuoteCart">
                  <i class="bi bi-cart-plus"></i> Add to Quote Cart
                </button>
              </div>

              <!-- Back link -->
              <router-link to="/b2b/products" class="btn btn-link mt-3">
                <i class="bi bi-arrow-left"></i> Back to B2B Catalog
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuoteStore } from '../stores/quoteStore'
import axios from 'axios'
import { useModal } from '../composables/useModal'

const route = useRoute()
const router = useRouter()
const quoteStore = useQuoteStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const { showModal } = useModal()

const product = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedImage = ref(0)
const selectedVariant = ref(null)
const quantity = ref(1)

onMounted(() => {
  fetchProduct()
})

async function fetchProduct() {
  const id = route.params.id
  if (!id) {
    error.value = 'Product ID not found'
    return
  }

  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('authToken')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await axios.get(`${API_BASE}/api/v1/b2b/catalog/${id}`, { headers })
    product.value = response.data?.data || response.data
  } catch (err) {
    error.value = err.message || 'Failed to load product'
  } finally {
    loading.value = false
  }
}

function updateQuantity(delta) {
  quantity.value = Math.max(1, quantity.value + delta)
}

function addToQuoteCart() {
  if (!product.value) return

  const unitPrice = product.value.hasB2bPricing && product.value.b2bUnitPrice ? product.value.b2bUnitPrice : product.value.basePriceUsd
  quoteStore.addToQuote({
    productId: product.value.id,
    productName: product.value.name,
    productSku: product.value.sku,
    price: unitPrice,
    quantity: quantity.value,
    variantId: selectedVariant.value?.id || null,
    variantName: selectedVariant.value?.variantName || null,
    notes: ''
  })

  quantity.value = 1
  showModal({
    title: 'Added',
    message: 'Product added to quote cart!',
    variant: 'success'
  })
}

function getProductImage(media) {
  if (!media) return ''
  return media.url?.startsWith('http') ? media.url : `${API_BASE}${media.url}`
}

function formatPrice(price) {
  if (price === null || price === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}
</script>

<style scoped>
.b2b-product-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}
.page-header h1 { margin: 0; font-size: 2.5rem; font-weight: 700; }
.subtitle { margin: 0.5rem 0 0; opacity: 0.9; font-size: 1.1rem; }

.product-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-image-main {
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  text-align: center;
}
.product-image-main img { width: 100%; max-height: 500px; object-fit: contain; }
.no-image { padding: 6rem; font-size: 4rem; color: #ccc; }

.thumbnail-gallery { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.thumbnail-item {
  width: 80px; height: 80px;
  border: 2px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
}
.thumbnail-item.active { border-color: #667eea; }
.thumbnail-item img { width: 100%; height: 100%; object-fit: cover; }

.product-name { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
.product-sku { color: #666; margin-bottom: 1.5rem; }

.pricing-section { background: #f8f9fa; padding: 1rem; border-radius: 8px; }
.retail-price, .b2b-price { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.retail-price .label, .b2b-price .label { font-size: 0.9rem; color: #666; }
.retail-price .price { font-size: 1.1rem; font-weight: 600; }
.b2b-price .price { font-size: 1.25rem; font-weight: 700; color: #28a745; }
.discount-badge { background: #28a745; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
.no-b2b-price { padding: 0.5rem; background: #f8f9fa; border-radius: 4px; }

.description-section h4 { font-size: 1.1rem; margin-bottom: 0.75rem; }
.description-section p { color: #555; line-height: 1.6; }

.variants-section h4 { font-size: 1.1rem; margin-bottom: 0.75rem; }
.variant-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.variant-item {
  display: flex; flex-direction: column;
  padding: 0.75rem 1rem;
  border: 2px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 120px;
}
.variant-item.selected { border-color: #667eea; background: #f0f0ff; }
.variant-name { font-weight: 600; font-size: 0.9rem; }
.variant-price { font-size: 0.8rem; color: #666; }

.quantity-selector label { display: block; font-weight: 600; margin-bottom: 0.5rem; }

.strikethrough {
  text-decoration: line-through;
  color: #999 !important;
}

.min-qty-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #e8f4fd;
  color: #0056b3;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
