<template>
  <main>
    <section class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>
          <p class="mt-2 text-muted">Loading order confirmation...</p>
        </div>

        <div v-else-if="error" class="text-center py-10">
          <i class="fa-solid fa-circle-exclamation text-danger" style="font-size: 4rem;"></i>
          <h3 class="mt-3">Unable to load order confirmation</h3>
          <p class="text-muted">{{ error }}</p>
          <button class="btn btn-outline-dark rounded-0" @click="load">Retry</button>
        </div>

        <div v-else-if="order" class="row">
          <div class="col-12 text-center mb-5">
            <i class="fa-solid fa-circle-check text-success" style="font-size: 4.5rem;"></i>
            <h2 class="mt-3 mb-2">Order placed successfully</h2>
            <p class="mb-0">Order ID: <strong>#{{ order.id }}</strong></p>
          </div>

          <div class="col-12 col-lg-8">
            <div class="border p-4 mb-4">
              <h5 class="mb-3">Order Summary</h5>
              <div class="d-flex justify-content-between mb-2"><span>Status</span><OrderStatusBadge :status="order.status" /></div>
              <div class="d-flex justify-content-between mb-2"><span>Shipping</span><span>{{ order.shipperName || 'N/A' }} - {{ order.shippingMethodName || 'N/A' }}</span></div>
              <div class="d-flex justify-content-between mb-2"><span>Tracking</span><span>{{ order.shippingTrackingNumber || 'Not assigned yet' }}</span></div>
              <div class="d-flex justify-content-between"><span>Shipping cost</span><span>{{ currencyStore.formatPrice(order.shippingCost || 0) }}</span></div>
            </div>

            <div class="border p-4 mb-4">
              <h5 class="mb-3">Payment Summary</h5>
              <div class="d-flex justify-content-between mb-2"><span>Term</span><span>{{ order.paymentTerm || 'IMMEDIATE' }}</span></div>
              <div class="d-flex justify-content-between mb-2"><span>Gateway</span><span>{{ order.paymentGatewayName || `#${order.paymentGatewayId || '-'}` }}</span></div>
              <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>{{ currencyStore.formatPrice(pricing.itemsSubtotal) }}</span></div>
              <div class="d-flex justify-content-between mb-2"><span>Shipping</span><span>{{ currencyStore.formatPrice(pricing.shippingCost) }}</span></div>
              <div class="d-flex justify-content-between mb-2"><span>Tax (%)</span><span>{{ displayTaxPercentage }}%</span></div>
              <div class="d-flex justify-content-between mb-2"><span>Tax Amount</span><span>{{ currencyStore.formatPrice(displayTaxAmount) }}</span></div>
              <div class="d-flex justify-content-between"><strong>Final Total</strong><strong>{{ currencyStore.formatPrice(displayFinalTotal) }}</strong></div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="border p-4 mb-4">
              <h5 class="mb-3">Invoice</h5>
              <template v-if="invoice">
                <div class="mb-2">Invoice #: <strong>{{ invoice.invoiceNumber }}</strong></div>
                <div class="mb-2"><InvoiceStatusBadge :status="invoice.status" /></div>
                <div class="small mb-1">Tax: {{ currencyStore.formatPrice(invoice.taxAmount || displayTaxAmount) }}</div>
                <div class="small mb-2">Total: {{ currencyStore.formatPrice(invoice.grandTotal || displayFinalTotal) }}</div>
                <button class="btn btn-outline-dark btn-sm rounded-0" @click="goInvoice">View Invoice Details</button>
              </template>
              <template v-else>
                <p class="text-muted small mb-2">Invoice is being prepared. This can take a moment after order placement.</p>
                <button class="btn btn-outline-dark btn-sm rounded-0" @click="loadInvoice">Retry Invoice Fetch</button>
              </template>
            </div>

            <div class="d-grid gap-2">
              <button class="btn btn-dark rounded-0" @click="goOrder">View Order Details</button>
              <router-link to="/products" class="btn btn-outline-dark rounded-0">Continue Shopping</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import { getOrderById } from '../services/orderService'
import { getInvoiceByOrderId } from '../services/invoiceService'
import OrderStatusBadge from '../components/OrderStatusBadge.vue'
import InvoiceStatusBadge from '../components/InvoiceStatusBadge.vue'
import { getOrderPricingSummary } from '../utils/orderPricing'

const route = useRoute()
const router = useRouter()
const currencyStore = useCurrencyStore()

const loading = ref(false)
const error = ref('')
const order = ref(null)
const invoice = ref(null)
const pricing = computed(() => getOrderPricingSummary(order.value || {}))
const displayTaxPercentage = computed(() => Number(pricing.value.taxPercentage || 0).toFixed(2))
const displayTaxAmount = computed(() => Number(pricing.value.taxAmount || 0))
const displayFinalTotal = computed(() => Number(pricing.value.finalTotal || 0))

async function loadInvoice() {
  try {
    invoice.value = await getInvoiceByOrderId(route.params.id)
  } catch {
    invoice.value = null
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    order.value = await getOrderById(route.params.id)
    await loadInvoice()
  } catch (e) {
    error.value = e.response?.data?.message || 'Unable to fetch order confirmation.'
  } finally {
    loading.value = false
  }
}

function goOrder() {
  router.push(`/orders/${route.params.id}`)
}

function goInvoice() {
  if (!invoice.value?.id) return
  router.push(`/invoices/${invoice.value.id}`)
}

onMounted(load)
</script>
