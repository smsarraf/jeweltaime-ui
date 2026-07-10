<template>
  <main>
    <section class="carttablewrap py-7">
      <div class="container">
        <router-link to="/orders" class="text-decoration-none fw-medium">&larr; Back to Orders</router-link>

        <div v-if="loading" class="text-center py-8">
          <div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>
          <p class="mt-2 text-muted">Loading order details...</p>
        </div>

        <div v-else-if="error" class="alert alert-warning rounded-0 mt-4">
          {{ error }} <button class="btn btn-link p-0 align-baseline" @click="fetchOrder">Retry</button>
        </div>

        <div v-else-if="order" class="row mt-4 g-4">
          <div class="col-12">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h1 class="mnHding fw-normal mb-0">Order #{{ order.id }}</h1>
              <OrderStatusBadge :status="order.status" />
            </div>
          </div>

          <div class="col-12 col-lg-8">
            <div class="border p-4 mb-4">
              <h5 class="mb-3">Items</h5>
              <div class="table-responsive">
                <table class="table align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th class="text-center">Qty</th>
                      <th class="text-end">Unit</th>
                      <th class="text-end">Line</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items || []" :key="item.id || `${item.productId}-${item.giftBoxId || ''}-${item.giftCardId || ''}`">
                      <td>
                        {{ item.productName || `Product #${item.productId}` }}
                        <small v-if="item.giftBoxId || item.giftCardId || item.giftNoteText" class="d-block text-muted">
                          <span v-if="item.giftBoxId">Gift Box #{{ item.giftBoxId }}</span>
                          <span v-if="item.giftCardId" class="ms-1">Gift Card #{{ item.giftCardId }}</span>
                          <span v-if="item.giftNoteText" class="d-block">Note: {{ item.giftNoteText }}</span>
                        </small>
                      </td>
                      <td class="text-center">{{ item.quantity || 0 }}</td>
                      <td class="text-end">{{ currencyStore.formatPrice(item.unitPriceAtTime || item.unitPrice || 0) }}</td>
                      <td class="text-end">{{ currencyStore.formatPrice((item.unitPriceAtTime || item.unitPrice || 0) * (item.quantity || 0)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="border p-4 mb-4">
              <h5 class="mb-3">Shipping</h5>
              <p class="mb-1"><strong>Address:</strong> {{ order.shippingAddress || 'N/A' }}</p>
              <p class="mb-1"><strong>Shipper:</strong> {{ order.shipperName || 'N/A' }}</p>
              <p class="mb-1"><strong>Method:</strong> {{ order.shippingMethodName || 'N/A' }}</p>
              <p class="mb-0"><strong>Tracking Number:</strong> {{ order.shippingTrackingNumber || 'Not assigned yet' }}</p>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="border p-4 mb-4">
              <h5 class="mb-3">Payment</h5>
              <p class="mb-1"><strong>Term:</strong> {{ order.paymentTerm || 'IMMEDIATE' }}</p>
              <p class="mb-1"><strong>Gateway:</strong> {{ order.paymentGatewayName || `#${order.paymentGatewayId || '-'}` }}</p>
              <p class="mb-3"><strong>Paid:</strong> {{ isPaid ? 'Yes' : 'Pending' }}</p>
              <div class="d-flex justify-content-between mb-1"><span>Subtotal</span><span>{{ currencyStore.formatPrice(pricing.itemsSubtotal) }}</span></div>
              <div class="d-flex justify-content-between mb-1"><span>Shipping</span><span>{{ currencyStore.formatPrice(pricing.shippingCost) }}</span></div>
              <div class="d-flex justify-content-between mb-1"><span>Tax (%)</span><span>{{ displayTaxPercentage }}%</span></div>
              <div class="d-flex justify-content-between mb-1"><span>Tax Amount</span><span>{{ currencyStore.formatPrice(displayTaxAmount) }}</span></div>
              <div class="d-flex justify-content-between"><strong>Final Total</strong><strong>{{ currencyStore.formatPrice(displayFinalTotal) }}</strong></div>
            </div>

            <div class="border p-4">
              <h5 class="mb-3">Linked Invoice</h5>
              <template v-if="invoice">
                <p class="mb-1"><strong>Invoice #:</strong> {{ invoice.invoiceNumber }}</p>
                <p class="mb-1"><InvoiceStatusBadge :status="invoice.status" /></p>
                <p class="mb-1"><strong>Due Date:</strong> {{ formatDate(invoice.dueDate) }}</p>
                <p class="mb-1"><strong>Tax:</strong> {{ currencyStore.formatPrice(invoice.taxAmount || displayTaxAmount) }}</p>
                <p class="mb-3"><strong>Total:</strong> {{ currencyStore.formatPrice(invoice.grandTotal || displayFinalTotal) }}</p>
                <router-link :to="`/invoices/${invoice.id}`" class="btn btn-outline-dark btn-sm rounded-0">View Invoice Details</router-link>
              </template>
              <template v-else>
                <p class="text-muted small mb-2">Invoice is being prepared.</p>
                <button class="btn btn-outline-dark btn-sm rounded-0" @click="fetchInvoice">Retry</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import { getOrderById } from '../services/orderService'
import { getInvoiceByOrderId } from '../services/invoiceService'
import OrderStatusBadge from '../components/OrderStatusBadge.vue'
import InvoiceStatusBadge from '../components/InvoiceStatusBadge.vue'
import { getOrderPricingSummary } from '../utils/orderPricing'

const route = useRoute()
const currencyStore = useCurrencyStore()

const order = ref(null)
const invoice = ref(null)
const loading = ref(false)
const error = ref('')
const pricing = computed(() => getOrderPricingSummary(order.value || {}))

const isPaid = computed(() => {
  const s = String(order.value?.status || '').toUpperCase()
  return ['PAID', 'DELIVERED'].includes(s)
})
const displayTaxPercentage = computed(() => Number(pricing.value.taxPercentage || 0).toFixed(2))
const displayTaxAmount = computed(() => Number(pricing.value.taxAmount || 0))
const displayFinalTotal = computed(() => Number(pricing.value.finalTotal || 0))

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchInvoice() {
  try {
    invoice.value = await getInvoiceByOrderId(route.params.id)
  } catch {
    invoice.value = null
  }
}

async function fetchOrder() {
  loading.value = true
  error.value = ''
  try {
    order.value = await getOrderById(route.params.id)
    await fetchInvoice()
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load order details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)
</script>
