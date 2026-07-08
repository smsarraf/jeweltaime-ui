<template>
  <main>
    <section class="carttablewrap py-7">
      <div class="container">
        <router-link to="/invoices" class="text-decoration-none fw-medium">&larr; Back to Invoices</router-link>

        <div v-if="loading" class="text-center py-8">
          <div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>
        </div>

        <div v-else-if="error" class="alert alert-warning rounded-0 mt-4">
          {{ error }} <button class="btn btn-link p-0 align-baseline" @click="load">Retry</button>
        </div>

        <div v-else-if="invoice" class="border p-4 mt-4">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
            <div>
              <h1 class="h3 mb-1">Invoice #{{ invoice.invoiceNumber }}</h1>
              <div class="text-muted small">Order #{{ invoice.orderId || '-' }}</div>
            </div>
            <InvoiceStatusBadge :status="invoice.status" />
          </div>

          <div class="row mb-4 g-3">
            <div class="col-12 col-md-6">
              <h6>Invoice To</h6>
              <p class="mb-0 small">{{ invoice.billToName || invoice.customerName || 'Customer' }}</p>
              <p class="mb-0 small">{{ invoice.billToAddress || invoice.shippingAddress || '-' }}</p>
            </div>
            <div class="col-12 col-md-6">
              <h6>Pay To</h6>
              <p class="mb-0 small">{{ invoice.payToName || 'JewelT\'Aime' }}</p>
              <p class="mb-0 small">{{ invoice.payToAddress || 'Accounts Department' }}</p>
            </div>
          </div>

          <div class="table-responsive mb-4">
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-center">Qty</th>
                  <th class="text-end">Unit</th>
                  <th class="text-end">Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in (invoice.items || [])" :key="item.id || idx">
                  <td>{{ item.description || item.name || `Item ${idx + 1}` }}</td>
                  <td class="text-center">{{ item.quantity || 1 }}</td>
                  <td class="text-end">{{ currencyStore.formatPrice(item.unitPrice || 0) }}</td>
                  <td class="text-end">{{ currencyStore.formatPrice((item.lineTotal || ((item.unitPrice || 0) * (item.quantity || 1)))) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row justify-content-end">
            <div class="col-12 col-md-5">
              <div class="d-flex justify-content-between mb-1"><span>Subtotal</span><span>{{ currencyStore.formatPrice(invoice.subTotal || invoice.subtotal || 0) }}</span></div>
              <div class="d-flex justify-content-between mb-1"><span>Tax</span><span>{{ currencyStore.formatPrice(invoice.taxTotal || invoice.tax || 0) }}</span></div>
              <div class="d-flex justify-content-between mb-1"><span>Shipping</span><span>{{ currencyStore.formatPrice(invoice.shippingTotal || invoice.shipping || 0) }}</span></div>
              <hr>
              <div class="d-flex justify-content-between"><strong>Grand Total</strong><strong>{{ currencyStore.formatPrice(invoice.grandTotal || 0) }}</strong></div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-outline-dark rounded-0" @click="printStub">Download / Print</button>
            <router-link to="/orders" class="btn btn-dark rounded-0">View Related Orders</router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import { getInvoiceById } from '../services/invoiceService'
import InvoiceStatusBadge from '../components/InvoiceStatusBadge.vue'

const route = useRoute()
const currencyStore = useCurrencyStore()

const invoice = ref(null)
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    invoice.value = await getInvoiceById(route.params.id)
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load invoice details.'
  } finally {
    loading.value = false
  }
}

function printStub() {
  window.print()
}

onMounted(load)
</script>
