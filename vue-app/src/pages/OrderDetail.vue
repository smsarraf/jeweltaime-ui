<template>
  <main>
    <section class="carttablewrap py-7">
      <div class="container">
        <div class="row mb-6">
          <div class="col-12">
            <router-link to="/orders" class="text-decoration-none fw-medium">&larr; Back to Orders</router-link>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-10">
          <div class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading order details...</p>
        </div>

        <!-- Not Found -->
        <div v-else-if="error" class="text-center py-10">
          <i class="fa-solid fa-circle-exclamation text-muted" style="font-size: 4rem; margin-bottom: 1.5rem;"></i>
          <h3 class="mb-3">Order not found</h3>
          <p class="text-muted mb-5">{{ error }}</p>
          <router-link to="/orders" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">My Orders</router-link>
        </div>

        <!-- Order Detail -->
        <div v-else-if="order" class="row">
          <div class="col-12">
            <h1 class="mnHding fw-normal mb-6">Order #{{ order.id }}</h1>
          </div>
          <div class="col-12 col-lg-8">
            <div class="card rounded-0 border mb-6">
              <div class="card-header bg-white py-3 px-4">
                <h5 class="fw-medium mb-0">Order Items</h5>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-borderless mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th class="fw-medium py-3 px-4">Product</th>
                        <th class="fw-medium py-3 px-4 text-center">Quantity</th>
                        <th class="fw-medium py-3 px-4 text-end">Unit Price</th>
                        <th class="fw-medium py-3 px-4 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in order.items" :key="item.id || item.productId" class="border-top">
                          <td class="py-3 px-4">
                            <router-link :to="`/products/${item.productId}/${(item.productName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`" class="text-decoration-none">{{ item.productName || `Product #${item.productId}` }}</router-link>
                          </td>
                        <td class="py-3 px-4 text-center">{{ item.quantity }}</td>
                        <td class="py-3 px-4 text-end">{{ currencyStore.formatPrice(item.unitPriceAtTime || item.unitPrice || 0) }}</td>
                        <td class="py-3 px-4 text-end">{{ currencyStore.formatPrice((item.unitPriceAtTime || item.unitPrice || 0) * item.quantity) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <!-- Order Status -->
            <div class="card rounded-0 border mb-4">
              <div class="card-header bg-white py-3 px-4">
                <h5 class="fw-medium mb-0">Order Status</h5>
              </div>
              <div class="card-body px-4 py-3">
                <div class="mb-3">
                  <span :class="statusBadgeClass(order.status)">{{ order.status || 'N/A' }}</span>
                </div>
                <p class="small text-muted mb-0">Placed on {{ formatDate(order.createdAt) }}</p>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="card rounded-0 border mb-4">
              <div class="card-header bg-white py-3 px-4">
                <h5 class="fw-medium mb-0">Order Summary</h5>
              </div>
              <div class="card-body px-4 py-3">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Subtotal</span>
                  <span>{{ currencyStore.formatPrice(order.totalUsdPrice || 0) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2" v-if="order.totalUsdPriceAfterDiscount && order.totalUsdPriceAfterDiscount !== order.totalUsdPrice">
                  <span class="text-muted small">Discount</span>
                  <span class="text-success">-{{ currencyStore.formatPrice((order.totalUsdPrice || 0) - (order.totalUsdPriceAfterDiscount || 0)) }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>{{ currencyStore.formatPrice(order.totalUsdPriceAfterDiscount || order.totalUsdPrice || 0) }}</strong>
                </div>
              </div>
            </div>

            <!-- Shipping Info -->
            <div class="card rounded-0 border mb-4">
              <div class="card-header bg-white py-3 px-4">
                <h5 class="fw-medium mb-0">Shipping</h5>
              </div>
              <div class="card-body px-4 py-3">
                <p class="small mb-1"><strong>Address:</strong> {{ order.shippingAddress || 'N/A' }}</p>
                <p class="small mb-0" v-if="order.shippingTrackingNumber">
                  <strong>Tracking:</strong> {{ order.shippingTrackingNumber }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import axios from 'axios'

const route = useRoute()
const currencyStore = useCurrencyStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const order = ref(null)
const isLoading = ref(true)
const error = ref('')

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusBadgeClass(status) {
  if (!status) return 'badge bg-light text-dark rounded-0'
  const s = status.toLowerCase()
  const map = {
    ordered: 'badge bg-warning text-dark rounded-0',
    preparing: 'badge bg-info text-dark rounded-0',
    ready_for_shipping: 'badge bg-primary rounded-0',
    shipped: 'badge bg-dark text-white rounded-0',
    delivered: 'badge bg-success rounded-0',
    cancelled: 'badge bg-danger rounded-0',
    qc_pending: 'badge bg-info rounded-0',
    qc_rejected: 'badge bg-danger rounded-0',
    order_to_manufacture: 'badge bg-secondary rounded-0'
  }
  return map[s] || 'badge bg-light text-dark rounded-0'
}

async function fetchOrder() {
  isLoading.value = true
  error.value = ''

  try {
    const orderId = route.params.id
    const token = localStorage.getItem('authToken')

    const response = await axios.get(`${API_BASE}/api/v1/orders/${orderId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })

    if (response.data) {
      order.value = response.data
    } else {
      error.value = 'Order not found.'
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load order details.'
    console.warn('Failed to fetch order:', e.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
.badge {
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
}
</style>