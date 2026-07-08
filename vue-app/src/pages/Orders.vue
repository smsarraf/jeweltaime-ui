<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">Home</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">My Orders</li>
        </ol>
      </nav>
    </div>

    <section class="carttablewrap py-7">
      <div class="container">
        <div v-if="!isLoggedIn" class="text-center py-10">
          <h3 class="mb-3">Please Sign In</h3>
          <p class="mb-4">Sign in to view your orders.</p>
          <router-link to="/signin" class="btn btn-dark rounded-0">Sign In</router-link>
        </div>

        <div v-else-if="loading" class="row g-3">
          <div v-for="i in 3" :key="`order-skeleton-${i}`" class="col-12">
            <div class="border p-4 placeholder-glow"><span class="placeholder col-12"></span></div>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-warning rounded-0">
          {{ error }} <button class="btn btn-link p-0 align-baseline" @click="fetchOrders">Retry</button>
        </div>

        <div v-else-if="orders.length === 0" class="text-center py-10">
          <i class="fa-solid fa-box-open text-muted" style="font-size: 3.5rem;"></i>
          <h3 class="mt-3">No Orders Yet</h3>
          <router-link to="/products" class="btn btn-dark rounded-0 mt-3">Browse Products</router-link>
        </div>

        <div v-else>
          <h1 class="mnHding fw-normal mb-5">My Orders ({{ orders.length }})</h1>
          <div v-for="row in orders" :key="row.id" class="border p-4 mb-3">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <div class="fw-medium">Order #{{ row.id }}</div>
                <small class="text-muted">{{ formatDate(row.createdAt) }}</small>
              </div>
              <OrderStatusBadge :status="row.status" />
            </div>
            <div class="row mt-3 g-3">
              <div class="col-6 col-md-3">
                <small class="text-muted d-block">Items</small>
                <strong>{{ row.items?.length || 0 }}</strong>
              </div>
              <div class="col-6 col-md-3">
                <small class="text-muted d-block">Shipping</small>
                <strong>{{ currencyStore.formatPrice(row.shippingCost || 0) }}</strong>
              </div>
              <div class="col-6 col-md-3">
                <small class="text-muted d-block">Total</small>
                <strong>{{ currencyStore.formatPrice(getOrderPricingSummary(row).finalTotal) }}</strong>
              </div>
              <div class="col-6 col-md-3 text-md-end">
                <router-link :to="`/orders/${row.id}`" class="btn btn-outline-dark btn-sm rounded-0">View Details</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCurrencyStore } from '../stores/currencyStore'
import { useOrders } from '../composables/useOrders'
import { getCurrentUserId } from '../services/apiConfig'
import OrderStatusBadge from '../components/OrderStatusBadge.vue'
import { useAuthSession } from '../composables/useAuthSession'
import { getOrderPricingSummary } from '../utils/orderPricing'

const currencyStore = useCurrencyStore()
const { orders, loading, error, loadOrders } = useOrders()
const { isLoggedIn } = useAuthSession()

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchOrders() {
  await loadOrders(getCurrentUserId())
}

onMounted(fetchOrders)
</script>
