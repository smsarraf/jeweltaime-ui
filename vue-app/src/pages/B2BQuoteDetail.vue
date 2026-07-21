<template>
  <div class="b2b-quote-detail-page">
    <div class="page-header">
      <div class="container">
        <h1>Quote Request: {{ quote?.quoteNumber || 'Loading...' }}</h1>
        <p class="subtitle">Quote details and actions</p>
      </div>
    </div>

    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading quote details...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger">
        <h4>⚠️ Unable to load quote</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchQuote">Retry</button>
      </div>

      <!-- Quote Content -->
      <div v-else-if="quote" class="quote-content">
        <!-- Status Banner -->
        <div :class="['status-banner', statusBannerClass]">
          <div class="status-info">
            <span class="badge-status">{{ statusWithIcon }}</span>
            <span class="status-date">Submitted: {{ formatDate(quote.createdAt) }}</span>
            <span v-if="quote.validUntil" class="status-date">
              | Valid Until: {{ formatDate(quote.validUntil) }}
            </span>
          </div>

          <!-- Expiry Warning -->
          <div v-if="quote.status === 'QUOTED'" class="expiry-warning">
            <i class="bi bi-exclamation-triangle"></i>
            This quote will expire on {{ formatDate(quote.validUntil) }}. Accept before expiry to lock in these prices.
          </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
          <h3>Items</h3>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Retail Price</th>
                  <th v-if="showQuotedPrices">Quoted Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in quote.items" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <div class="product-name">{{ item.productName }}</div>
                    <div class="product-sku">SKU: {{ item.productSku }}</div>
                    <div v-if="item.variantName" class="product-variant">{{ item.variantName }}</div>
                  </td>
                  <td>{{ item.requestedQuantity }}</td>
                  <td>{{ formatPrice(item.retailUnitPrice) }}</td>
                  <td v-if="showQuotedPrices">
                    <div class="quoted-price-cell">
                      <span>{{ formatPrice(item.quotedUnitPrice) }}</span>
                      <span v-if="item.discountPercentage" class="discount-badge-inline">
                        {{ item.discountPercentage }}% off
                      </span>
                    </div>
                  </td>
                  <td>
                    <span v-if="showQuotedPrices && item.quotedUnitPrice">
                      {{ formatPrice(item.quotedUnitPrice * item.requestedQuantity) }}
                    </span>
                    <span v-else>
                      {{ formatPrice(item.retailUnitPrice * item.requestedQuantity) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section notes-card user-notes grey-notes-color">
          <h3>Summary</h3>
          <div class="summary-row">
            <span>Subtotal (Retail):</span>
            <span>{{ formatPrice(quote.subtotalAmount) }}</span>
          </div>
          <div v-if="showQuotedPrices && quote.discountAmount > 0" class="summary-row discount">
            <span>B2B Discount:</span>
            <span>-{{ formatPrice(quote.discountAmount) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ formatPrice(quote.totalAmount || quote.subtotalAmount) }}</span>
          </div>
          <div v-if="showQuotedPrices && quote.discountAmount > 0" class="savings-text">
            You save: {{ formatPrice(quote.discountAmount) }}
          </div>
        </div>

        <!-- Admin Notes -->
        <div v-if="quote.adminNotes" class="notes-card admin-notes">
          <h4>Admin Notes</h4>
          <p>{{ quote.adminNotes }}</p>
        </div>

        <!-- Your Notes -->
        <div v-if="quote.notes" class="notes-card user-notes">
          <h4>Your Notes</h4>
          <p>{{ quote.notes }}</p>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <!-- PENDING state -->
          <div v-if="quote.status === 'PENDING'" class="text-muted">
            <i class="bi bi-hourglass-split"></i> Awaiting admin review. You will be notified when pricing is ready.
          </div>

          <!-- QUOTED state - Accept/Decline -->
          <div v-if="quote.status === 'QUOTED'" class="d-flex gap-2 flex-wrap">
            <button class="btn btn-success btn-lg" @click="showAcceptModal = true">
              <i class="bi bi-check-lg"></i> Accept Quote
            </button>
            <router-link to="/b2b/quotes" class="btn btn-outline-secondary btn-lg">
              Back to Quotes
            </router-link>
          </div>

          <!-- ACCEPTED state -->
          <div v-if="quote.status === 'ACCEPTED'" class="alert alert-info">
            <i class="bi bi-arrow-repeat"></i> Converting to order... Please wait.
          </div>

          <!-- CONVERTED state -->
          <div v-if="quote.status === 'CONVERTED'" class="alert alert-success">
            <i class="bi bi-check-circle-fill"></i>
            ✓ Converted to Order #ORD-{{ quote.convertedOrderId }}
            <router-link :to="`/orders/${quote.convertedOrderId}`" class="btn btn-outline-primary btn-sm ms-2">
              View Order
            </router-link>
          </div>

          <!-- REJECTED state -->
          <div v-if="quote.status === 'REJECTED'" class="alert alert-danger">
            <i class="bi bi-x-circle-fill"></i> This quote request was declined.
          </div>

          <!-- EXPIRED state -->
          <div v-if="quote.status === 'EXPIRED'" class="alert alert-warning">
            <i class="bi bi-clock"></i> This quote has expired.
            <router-link to="/b2b/products" class="btn btn-outline-primary btn-sm ms-2">
              Request New Quote
            </router-link>
          </div>

          <router-link to="/b2b/quotes" class="btn btn-link mt-2">
            <i class="bi bi-arrow-left"></i> Back to My Quotes
          </router-link>
        </div>
      </div>
    </div>

    <!-- Accept Quote Modal -->
    <div v-if="showAcceptModal" class="modal-overlay" @click.self="showAcceptModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">🛒 Confirm Order</h5>
            <button type="button" class="btn-close" @click="showAcceptModal = false"></button>
          </div>
          <div class="modal-body">
            <p>You are about to accept this quote and create an order.</p>
            <div class="accept-details">
              <div class="accept-row">
                <span>Quote:</span>
                <span class="fw-bold">{{ quote.quoteNumber }}</span>
              </div>
              <div class="accept-row">
                <span>Total:</span>
                <span class="fw-bold text-success">{{ formatPrice(quote.totalAmount) }}</span>
              </div>
              <div class="accept-row">
                <span>Payment Terms:</span>
                <span>NET 30</span>
              </div>
            </div>

            <!-- Shipping Address Selection -->
            <div class="shipping-selector mt-3">
              <h6 class="fw-medium mb-2">Shipping Address</h6>

              <!-- Company Address option -->
              <label class="shipping-option d-block border rounded p-3 mb-2" :class="{ 'border-primary bg-light': addressMode === 'company' }">
                <input class="form-check-input me-2" type="radio" value="company" v-model="addressMode">
                <span class="fw-medium">Use Company Address</span>
                <div v-if="addressMode === 'company' && companyAddress" class="company-addr-display mt-2 ms-4 text-muted small">
                  <p class="mb-0 fw-medium text-dark">{{ companyAddress.companyName }}</p>
                  <p class="mb-0">{{ companyAddress.addressLine1 }}</p>
                  <p class="mb-0">
                    <span v-if="companyAddress.cityName">{{ companyAddress.cityName }}, </span>
                    <span v-if="companyAddress.stateName">{{ companyAddress.stateName }}, </span>
                    <span v-if="companyAddress.countryName">{{ companyAddress.countryName }}</span>
                  </p>
                </div>
                <div v-else-if="addressMode === 'company' && companyAddressLoading" class="mt-2 ms-4">
                  <div class="placeholder-glow">
                    <span class="placeholder col-8"></span>
                    <span class="placeholder col-6 mt-1"></span>
                  </div>
                </div>
              </label>

              <!-- Custom Address option -->
              <label class="shipping-option d-block border rounded p-3 mb-2" :class="{ 'border-primary bg-light': addressMode === 'custom' }">
                <input class="form-check-input me-2" type="radio" value="custom" v-model="addressMode">
                <span class="fw-medium">Enter Custom Address</span>
                <div v-if="addressMode === 'custom'" class="custom-addr-form mt-2 ms-4">
                  <div class="row g-2">
                    <div class="col-12">
                      <label class="form-label small mb-1">Street / Address Line 1</label>
                      <input type="text" class="form-control form-control-sm rounded-0" v-model="customAddress.street" placeholder="Street address">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label small mb-1">City</label>
                      <input type="text" class="form-control form-control-sm rounded-0" v-model="customAddress.city" placeholder="City">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label small mb-1">State / Province</label>
                      <input type="text" class="form-control form-control-sm rounded-0" v-model="customAddress.state" placeholder="State">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label small mb-1">ZIP / Postal Code</label>
                      <input type="text" class="form-control form-control-sm rounded-0" v-model="customAddress.zipCode" placeholder="ZIP">
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label small mb-1">Country <span class="text-danger">*</span></label>
                      <select class="form-select form-select-sm rounded-0" v-model="customAddress.country">
                        <option value="">Select Country...</option>
                        <option v-for="c in countries" :key="c.id" :value="c.name">{{ c.name }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </label>
            </div>

            <p class="mt-3 text-muted small">
              By accepting, you agree to the quoted prices and terms. An order will be created and you will receive an invoice.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showAcceptModal = false" :disabled="accepting">Cancel</button>
            <button class="btn btn-success" @click="handleAccept" :disabled="accepting || !canAccept">
              <span v-if="accepting" class="spinner-border spinner-border-sm me-1"></span>
              {{ accepting ? 'Processing...' : 'Confirm & Create Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { b2bQuoteService } from '../services/b2bQuoteService'
import { useModal } from '../composables/useModal'
import { useLocationStore } from '../stores/locationStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const { showModal } = useModal()
const locationStore = useLocationStore()

const quote = ref(null)
const loading = ref(false)
const error = ref(null)
const showAcceptModal = ref(false)
const accepting = ref(false)

// Shipping address state
const addressMode = ref('company') // 'company' | 'custom'
const companyAddress = ref(null)
const companyAddressLoading = ref(false)
const countries = ref([])
const customAddress = ref({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
})

const canAccept = computed(() => {
  if (addressMode.value === 'custom') {
    return !!customAddress.value.country.trim()
  }
  return true
})

const showQuotedPrices = computed(() => {
  return quote.value && ['QUOTED', 'ACCEPTED', 'CONVERTED'].includes(quote.value.status)
})

const statusBannerClass = computed(() => {
  const map = { PENDING: 'pending', QUOTED: 'quoted', ACCEPTED: 'accepted', CONVERTED: 'converted', REJECTED: 'rejected', EXPIRED: 'expired' }
  return map[quote.value?.status] || ''
})

const statusWithIcon = computed(() => {
  const map = { PENDING: '⏳ PENDING', QUOTED: '💲 QUOTED', ACCEPTED: '✓ ACCEPTED', CONVERTED: '📦 CONVERTED', REJECTED: '✗ REJECTED', EXPIRED: '⏰ EXPIRED' }
  return map[quote.value?.status] || quote.value?.status
})

onMounted(async () => {
  await fetchCountries()
  await fetchQuote()
})

// Watch for modal open to pre-load company address
watch(showAcceptModal, async (isOpen) => {
  if (isOpen && !companyAddress.value && !companyAddressLoading.value) {
    await loadCompanyAddress()
  }
})

async function fetchCountries() {
  if (!locationStore.loaded) await locationStore.loadAllLocations()
  countries.value = locationStore.countries
}

async function loadCompanyAddress() {
  companyAddressLoading.value = true
  try {
    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id
    if (!userId) {
      companyAddress.value = null
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
      companyAddress.value = {
        companyName: bc.companyName || '',
        addressLine1: bc.addressLine1 || '',
        cityName: bc.cityName || '',
        stateName: bc.stateName || '',
        countryName: bc.countryName || ''
      }
      // Pre-populate custom address form with company address as suggestions
      if (!customAddress.value.street) {
        customAddress.value = {
          street: bc.addressLine1 || '',
          city: bc.cityName || '',
          state: bc.stateName || '',
          zipCode: '',
          country: bc.countryName || ''
        }
      }
    } else {
      companyAddress.value = null
    }
  } catch {
    companyAddress.value = null
  } finally {
    companyAddressLoading.value = false
  }
}

async function fetchQuote() {
  const id = route.params.id
  if (!id) {
    error.value = 'Quote ID not found'
    return
  }

  loading.value = true
  error.value = null

  try {
    quote.value = await b2bQuoteService.getQuoteById(id)
  } catch (err) {
    error.value = err.message || 'Failed to load quote'
  } finally {
    loading.value = false
  }
}

async function handleAccept() {
  if (!quote.value) return

  accepting.value = true
  try {
    let shippingAddress = null
    if (addressMode.value === 'custom') {
      shippingAddress = {
        street: customAddress.value.street.trim(),
        city: customAddress.value.city.trim(),
        state: customAddress.value.state.trim(),
        zipCode: customAddress.value.zipCode.trim(),
        country: customAddress.value.country.trim()
      }
    }
    const response = await b2bQuoteService.acceptQuote(quote.value.id, shippingAddress)
    quote.value = response
    showAcceptModal.value = false

    if (response.convertedOrderId) {
      showModal({
        title: 'Success',
        message: `Quote accepted! Order #ORD-${response.convertedOrderId} has been created.`,
        variant: 'success'
      })
      router.push(`/orders/${response.convertedOrderId}`)
    } else {
      showModal({
        title: 'Success',
        message: 'Quote accepted! Order is being created.',
        variant: 'success'
      })
    }
  } catch (err) {
    showModal({
      title: 'Error',
      message: err.message || 'Failed to accept quote',
      variant: 'danger'
    })
  } finally {
    accepting.value = false
  }
}

function formatPrice(price) {
  if (price === null || price === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.b2b-quote-detail-page { min-height: 100vh; background-color: #f8f9fa; }
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}
.page-header h1 { margin: 0; font-size: 2.5rem; font-weight: 700; }
.subtitle { margin: 0.5rem 0 0; opacity: 0.9; font-size: 1.1rem; }

.status-banner {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}
.status-banner.pending { background: #e8f4fd; border: 1px solid #bee5eb; }
.status-banner.quoted { background: #d4edda; border: 1px solid #c3e6cb; }
.status-banner.accepted { background: #cce5ff; border: 1px solid #b8daff; }
.status-banner.converted { background: #d4edda; border: 1px solid #c3e6cb; }
.status-banner.rejected { background: #f8d7da; border: 1px solid #f5c6cb; }
.status-banner.expired { background: #e2e3e5; border: 1px solid #d6d8db; }

.status-info { margin-bottom: 0.75rem; }
.badge-status { font-weight: 700; font-size: 1.1rem; margin-right: 1rem; }
.status-date { color: #666; font-size: 0.9rem; }
.expiry-warning {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 0.75rem;
  border-radius: 6px;
  color: #856404;
}

.grey-notes-color{
  box-shadow: 0 2px 4px slategrey !important;
}

.items-section, .summary-section, .notes-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.items-section h3, .summary-section h3 { font-size: 1.25rem; margin-bottom: 1rem; }
.product-name { font-weight: 600; }
.product-sku, .product-variant { font-size: 0.85rem; color: #666; }
.quoted-price-cell { display: flex; align-items: center; gap: 0.5rem; }
.discount-badge-inline {
  background: #28a745;
  color: white;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
}
.summary-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.summary-row.discount { color: #28a745; }
.summary-divider { border-top: 1px solid #eee; margin: 0.75rem 0; }
.summary-row.total { font-weight: 700; font-size: 1.1rem; }
.savings-text { text-align: right; color: #28a745; font-weight: 600; margin-top: 0.5rem; }
.notes-card h4 { font-size: 1rem; margin-bottom: 0.5rem; }
.admin-notes { border-left: 4px solid #667eea; }
.user-notes { border-left: 4px solid #764ba2; }
.actions-section { margin: 2rem 0; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-dialog { max-width: 500px; width: 100%; margin: 1rem; }
.modal-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.modal-header, .modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header { border-bottom: 1px solid #eee; }
.modal-footer { border-top: 1px solid #eee; gap: 0.5rem; }
.modal-body { padding: 1.5rem; }
.accept-details { background: #f8f9fa; padding: 1rem; border-radius: 6px; }
.accept-row { display: flex; justify-content: space-between; padding: 0.35rem 0; }
</style>