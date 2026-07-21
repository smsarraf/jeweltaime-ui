<template>
  <div class="b2b-quote-cart-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1>Quote Cart</h1>
        <p class="subtitle">Review items and submit a quote request</p>
      </div>
    </div>

    <div class="container">
      <!-- Info Banner -->
      <div class="info-banner">
        <i class="bi bi-info-circle"></i>
        <span>
          Your quote request will be reviewed by our B2B team. You will receive pricing within 24-48 business hours.
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="loading-state text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Processing...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="alert alert-danger">
        <h4>Error</h4>
        <p>{{ store.error }}</p>
        <button class="btn btn-primary" @click="store.setError(null)">Dismiss</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="store.items.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-cart-x"></i>
        </div>
        <h3>Your quote cart is empty</h3>
        <p>Browse our catalog and add products to get started.</p>
        <router-link to="/b2b/products" class="btn btn-primary">
          <i class="bi bi-grid"></i> Browse Products
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="row">
          <div class="col-lg-8">
            <!-- Quote Items -->
            <div v-for="item in store.items" :key="store.getItemKey(item)" class="cart-item">
              <div class="item-details">
                <h4>{{ item.productName }}</h4>
                <p class="item-sku">SKU: {{ item.productSku }}</p>
                <p v-if="item.variantName" class="item-variant">Variant: {{ item.variantName }}</p>
                
                <div class="item-pricing">
                  <span class="retail-label">Est. Retail:</span>
                  <span class="retail-price">{{ formatPrice(item.retailUnitPrice) }}/unit</span>
                  <span class="line-total">Line Total (Retail): {{ formatPrice(item.retailUnitPrice * item.quantity) }}</span>
                </div>

                <div class="item-notes">
                  <label>Notes for this item:</label>
                  <input
                    v-model="item.notes"
                    type="text"
                    class="form-control"
                    placeholder="e.g., Need by end of month, specific packaging, etc."
                    @input="updateItemNotes(item)"
                  />
                </div>
              </div>

              <div class="item-actions">
                <div class="quantity-controls">
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="decreaseQuantity(item)"
                  >
                    -
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="increaseQuantity(item)"
                  >
                    +
                  </button>
                </div>
                <button
                  class="btn btn-danger btn-sm mt-2"
                  @click="removeItem(item)"
                >
                  <i class="bi bi-trash"></i> Remove
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <!-- Order Summary -->
            <div class="order-summary">
              <h3>Quote Summary</h3>
              <div class="summary-row">
                <span>Items ({{ store.totalItems }})</span>
                <span>{{ formatPrice(store.subtotal) }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row total">
                <span>Estimated Subtotal (Retail)</span>
                <span>{{ formatPrice(store.subtotal) }}</span>
              </div>
              <p class="text-muted small mt-2">
                *Final pricing will be provided in the admin quote response
              </p>
            </div>

            <!-- Notes Section -->
            <div class="notes-section">
              <h4>Notes for B2B Team</h4>
              <textarea
                v-model="store.notes"
                class="form-control"
                rows="4"
                placeholder="e.g., We are planning a seasonal promotion and need competitive pricing. Please include bulk discounts if available."
              ></textarea>
            </div>

            <!-- Shipping Address -->
            <div class="shipping-section">
              <h4>Shipping Address</h4>
              <!-- Address Mode Selector -->
              <div class="address-mode-selector mb-3">
                <label class="form-check form-check-inline d-flex align-items-center gap-1">
                  <input class="form-check-input" type="radio" value="company" v-model="store.shippingAddressMode" :disabled="!hasCompanyAddress">
                  <span class="form-check-label" :class="{ 'text-muted': !hasCompanyAddress }">Company Address</span>
                </label>
                <label class="form-check form-check-inline d-flex align-items-center gap-1">
                  <input class="form-check-input" type="radio" value="manual" v-model="store.shippingAddressMode">
                  <span class="form-check-label">Manual Entry</span>
                </label>
                <label class="form-check form-check-inline d-flex align-items-center gap-1">
                  <input class="form-check-input" type="radio" value="freeText" v-model="store.shippingAddressMode">
                  <span class="form-check-label">Free Text</span>
                </label>
              </div>

              <!-- Company Address (read-only) -->
              <div v-if="store.shippingAddressMode === 'company'" class="company-address-display border rounded p-3 bg-light">
                <template v-if="companyAddressLoading">
                  <div class="placeholder-glow">
                    <span class="placeholder col-10"></span>
                    <span class="placeholder col-8 mt-1"></span>
                  </div>
                </template>
                <template v-else-if="store.companyAddress">
                  <p class="mb-0 fw-medium">{{ store.companyAddress.companyName }}</p>
                  <p class="mb-0 text-muted small">{{ store.companyAddress.addressLine1 }}</p>
                  <p class="mb-0 text-muted small">
                    <span v-if="store.companyAddress.cityName">{{ store.companyAddress.cityName }}, </span>
                    <span v-if="store.companyAddress.stateName">{{ store.companyAddress.stateName }}, </span>
                    <span v-if="store.companyAddress.countryName">{{ store.companyAddress.countryName }}</span>
                  </p>
                </template>
                <template v-else>
                  <p class="mb-0 text-muted small">No company address on file. Please use manual entry.</p>
                </template>
              </div>

              <!-- Manual Address Entry -->
              <div v-if="store.shippingAddressMode === 'manual'" class="row g-2">
                <div class="col-12 col-md-6">
                  <label class="form-label small mb-1">Country *</label>
                  <select class="form-select form-select-sm rounded-0" v-model="store.manualShippingAddress.countryId" @change="onManualCountryChange">
                    <option value="">Select Country</option>
                    <option v-for="c in locationStore.countries" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label small mb-1">State</label>
                  <select class="form-select form-select-sm rounded-0" v-model="store.manualShippingAddress.stateId" @change="onManualStateChange" :disabled="!store.manualShippingAddress.countryId">
                    <option value="">Select State</option>
                    <option v-for="s in manualStates" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label small mb-1">City</label>
                  <select class="form-select form-select-sm rounded-0" v-model="store.manualShippingAddress.cityId" :disabled="!store.manualShippingAddress.stateId">
                    <option value="">Select City</option>
                    <option v-for="ct in manualCities" :key="ct.id" :value="ct.id">{{ ct.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label small mb-1">Postcode / ZIP *</label>
                  <input type="text" class="form-control form-control-sm rounded-0" v-model="store.manualShippingAddress.zipCode" placeholder="Postcode">
                </div>
                <div class="col-12">
                  <label class="form-label small mb-1">Street Address *</label>
                  <input type="text" class="form-control form-control-sm rounded-0" v-model="store.manualShippingAddress.street" placeholder="Street address">
                </div>
              </div>

              <!-- Free Text (legacy) -->
              <div v-if="store.shippingAddressMode === 'freeText'">
                <textarea
                  v-model="store.shippingAddressText"
                  class="form-control"
                  rows="3"
                  placeholder="Enter your shipping address"
                ></textarea>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <router-link to="/b2b/products" class="btn btn-outline-primary w-100 mb-2">
                <i class="bi bi-arrow-left"></i> Continue Shopping
              </router-link>
              <button
                class="btn btn-success w-100"
                :disabled="isSubmitting"
                @click="submitQuoteRequest"
              >
                <i class="bi bi-send"></i>
                {{ isSubmitting ? 'Submitting...' : 'Submit Quote Request' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuoteStore } from '../stores/quoteStore'
import { b2bQuoteService } from '../services/b2bQuoteService'
import { useModal } from '../composables/useModal'
import { useLocationStore } from '../stores/locationStore'
import axios from 'axios'

const router = useRouter()
const store = useQuoteStore()
const locationStore = useLocationStore()
const isSubmitting = ref(false)
const companyAddressLoading = ref(false)
const hasCompanyAddress = ref(false)
const { showModal } = useModal()
  
  // Load user profile for shipping address
  onMounted(async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!store.shippingAddressText && user.address) {
      store.shippingAddressText = user.address
    }
    // Load company address for B2B users
    await loadCompanyAddress()
    if (!locationStore.loaded) locationStore.loadAllLocations()
  })
  
  const manualStates = computed(() => {
    const countryId = Number(store.manualShippingAddress.countryId || 0)
    return countryId > 0 ? locationStore.getStates(countryId) : []
  })
  
  const manualCities = computed(() => {
    const stateId = Number(store.manualShippingAddress.stateId || 0)
    return stateId > 0 ? locationStore.getCities(stateId) : []
  })
  
  function onManualCountryChange() {
    store.setManualShippingAddress({ stateId: '', cityId: '' })
    const countryId = Number(store.manualShippingAddress.countryId || 0)
    if (countryId > 0) locationStore.loadStates(countryId)
  }
  
  function onManualStateChange() {
    store.setManualShippingAddress({ cityId: '' })
    const stateId = Number(store.manualShippingAddress.stateId || 0)
    if (stateId > 0) locationStore.loadCities(stateId)
  }
  
  async function loadCompanyAddress() {
    companyAddressLoading.value = true
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id
      if (!userId) {
        hasCompanyAddress.value = false
        return
      }
      const token = localStorage.getItem('authToken')
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await axios.get(`${API_BASE}/api/v1/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      const userData = response.data
      if (userData && userData.b2bCompany) {
        const bc = userData.b2bCompany
        store.setCompanyAddress({
          companyName: bc.companyName || '',
          addressLine1: bc.addressLine1 || '',
          countryId: String(bc.countryId || bc.country_id || ''),
          stateId: String(bc.stateId || bc.state_id || ''),
          cityId: String(bc.cityId || bc.city_id || ''),
          countryName: bc.countryName || storageLookup('country', bc.countryId || bc.country_id),
          stateName: bc.stateName || storageLookup('state', bc.stateId || bc.state_id),
          cityName: bc.cityName || storageLookup('city', bc.cityId || bc.city_id)
        })
        hasCompanyAddress.value = true
        // Default to company address if available
        if (!store.shippingAddressText && !store.manualShippingAddress.street) {
          store.shippingAddressMode = 'company'
        }
      } else {
        hasCompanyAddress.value = false
        if (store.shippingAddressMode === 'company') {
          store.shippingAddressMode = 'manual'
        }
      }
    } catch {
      hasCompanyAddress.value = false
    } finally {
      companyAddressLoading.value = false
    }
  }
  
  function storageLookup(type, id) {
    if (!id) return ''
    const numId = Number(id)
    if (!Number.isFinite(numId) || numId <= 0) return ''
    // Use locationStore for name lookups
    if (type === 'country') {
      const found = locationStore.countries.find(c => Number(c.id) === numId)
      return found ? found.name : ''
    }
    if (type === 'state') {
      const found = locationStore.getStates(0).find(s => Number(s.id) === numId)
      if (found) return found.name
      // search across all loaded states
      for (const c of locationStore.countries) {
        const s = locationStore.getStates(c.id).find(s => Number(s.id) === numId)
        if (s) return s.name
      }
      return ''
    }
    if (type === 'city') {
      for (const c of locationStore.countries) {
        for (const s of locationStore.getStates(c.id)) {
          const ct = locationStore.getCities(s.id).find(ct => Number(ct.id) === numId)
          if (ct) return ct.name
        }
      }
      return ''
    }
    return ''
  }

// Increase quantity
function increaseQuantity(item) {
  store.updateQuantity(
    item.productId,
    item.quantity + 1,
    item.variantId
  )
}

// Decrease quantity
function decreaseQuantity(item) {
  if (item.quantity > 1) {
    store.updateQuantity(
      item.productId,
      item.quantity - 1,
      item.variantId
    )
  }
}

// Update item notes
function updateItemNotes(item) {
  store.updateItemNotes(
    item.productId,
    item.notes,
    item.variantId
  )
}

// Remove item
function removeItem(item) {
  store.removeFromQuote(item.productId, item.variantId)
}

// Submit quote request
async function submitQuoteRequest() {
  if (store.items.length === 0) {
    showModal({
      title: 'Empty Cart',
      message: 'Please add items to your quote cart.',
      variant: 'warning'
    })
    return
  }

  const addressText = store.buildShippingAddressText()
  if (!addressText.trim()) {
    showModal({
      title: 'Shipping Address Required',
      message: 'Please enter a shipping address.',
      variant: 'warning'
    })
    return
  }

  isSubmitting.value = true
  store.setLoading(true)
  store.setError(null)

  try {
    const payload = {
      notes: store.notes,
      shippingAddressText: store.buildShippingAddressText(),
      billingAddressText: store.billingAddressText || store.shippingAddressText,
      currencyId: store.currencyId || 1,
      items: store.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        notes: item.notes || null
      }))
    }

    const response = await b2bQuoteService.submitQuoteRequest(payload)
    
    // Clear quote cart after successful submission
    store.clearQuote()
    
    // Navigate to confirmation page
    router.push({
      name: 'B2BQuoteConfirmation',
      query: {
        quoteNumber: response.quoteNumber,
        id: response.id
      }
    })
  } catch (err) {
    store.setError(err.message || 'Failed to submit quote request')
  } finally {
    isSubmitting.value = false
    store.setLoading(false)
  }
}

// Format price
function formatPrice(price) {
  if (price === null || price === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
</script>

<style scoped>
.b2b-quote-cart-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.info-banner {
  background: #e8f4fd;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.info-banner i {
  font-size: 1.5rem;
  color: #0c5460;
}

.info-banner span {
  color: #0c5460;
  font-size: 0.95rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon i {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.cart-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.item-sku,
.item-variant {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.item-pricing {
  margin: 0.75rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.retail-label {
  font-size: 0.875rem;
  color: #666;
}

.retail-price {
  font-weight: 600;
  color: #333;
}

.line-total {
  display: block;
  width: 100%;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.item-notes {
  margin-top: 0.75rem;
}

.item-notes label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #666;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.quantity {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.order-summary {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-summary h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.1rem;
}

.summary-divider {
  border-top: 1px solid #eee;
  margin: 0.75rem 0;
}

.notes-section,
.shipping-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notes-section h4,
.shipping-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.action-buttons {
  margin-top: 1.5rem;
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>