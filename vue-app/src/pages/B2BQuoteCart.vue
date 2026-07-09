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
              <textarea
                v-model="store.shippingAddressText"
                class="form-control"
                rows="3"
                placeholder="Enter your shipping address"
              ></textarea>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuoteStore } from '../stores/quoteStore'
import { b2bQuoteService } from '../services/b2bQuoteService'
import { useModal } from '../composables/useModal'

const router = useRouter()
const store = useQuoteStore()
const isSubmitting = ref(false)
const { showModal } = useModal()

// Load user profile for shipping address
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!store.shippingAddressText && user.address) {
    store.shippingAddressText = user.address
  }
})

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

  if (!store.shippingAddressText.trim()) {
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
      shippingAddressText: store.shippingAddressText,
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