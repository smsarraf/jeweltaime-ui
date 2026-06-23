<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">My Orders</li>
        </ol>
      </nav>
    </div>

    <!-- Not Logged In -->
    <section v-if="!isLoggedIn" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <i class="fa-solid fa-lock text-muted" style="font-size: 4rem; margin-bottom: 1.5rem;"></i>
            <h3 class="mb-3">Please Sign In</h3>
            <p class="mb-5">Sign in to view your orders.</p>
            <router-link to="/signin" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Sign In</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <section v-else-if="isLoading" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <div class="spinner-border text-dark" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading orders...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty Orders -->
    <section v-else-if="orders.length === 0" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <i class="fa-solid fa-box-open text-muted" style="font-size: 4rem; margin-bottom: 1.5rem;"></i>
            <h3 class="mb-4">No Orders Yet</h3>
            <p class="mb-5">You haven't placed any orders yet. Start shopping!</p>
            <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Browse Products</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Orders List -->
    <section v-else class="carttablewrap py-7">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1 class="mnHding fw-normal mb-7">My Orders ({{ orders.length }})</h1>
          </div>
        </div>
        <div class="row">
          <div v-for="order in paginatedOrders" :key="order.id" class="col-12 mb-4">
            <div class="card rounded-0 border">
              <div class="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <strong class="fw-medium">Order #{{ order.id }}</strong>
                  <span class="ms-3 text-muted small">{{ formatDate(order.createdAt) }}</span>
                </div>
                <span :class="statusBadgeClass(order.status)">{{ order.status }}</span>
              </div>
              <div class="card-body px-4 py-3">
                <div class="row">
                  <div class="col-12 col-sm-4 mb-2 mb-sm-0">
                    <small class="text-muted d-block">Total</small>
                    <strong>{{ currencyStore.formatPrice(order.totalUsdPrice || order.total || 0) }}</strong>
                  </div>
                  <div class="col-12 col-sm-4 mb-2 mb-sm-0">
                    <small class="text-muted d-block">Items</small>
                    <strong>{{ order.items?.length || 0 }}</strong>
                  </div>
                  <div class="col-12 col-sm-4 text-sm-end">
                    <router-link :to="`/orders/${order.id}`" class="btn btn-outline-dark btn-sm rounded-0">View Details</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-center py-3">
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link rounded-0" href="javascript:void(0);" @click="currentPage--">&laquo;</a>
              </li>
              <li class="page-item" :class="{ active: currentPage === i }" v-for="i in totalPages" :key="i">
                <a class="page-link rounded-0" href="javascript:void(0);" @click="currentPage = i">{{ i }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link rounded-0" href="javascript:void(0);" @click="currentPage++">&raquo;</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyStore } from '../stores/currencyStore'
import axios from 'axios'

const router = useRouter()
const currencyStore = useCurrencyStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const isLoggedIn = computed(() => !!localStorage.getItem('authToken'))
const orders = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.max(1, Math.ceil(orders.value.length / pageSize)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return orders.value.slice(start, start + pageSize)
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusBadgeClass(status) {
  if (!status) return 'badge bg-light text-dark rounded-0'
  const s = status.toLowerCase()
  const map = {
    ordered: 'badge bg-warning text-dark rounded-0',
    preparing: 'badge bg-info text-dark rounded-0',
    ready_for_shipping: 'badge bg-primary rounded-0',
    shipped: 'badge bg-dark rounded-0',
    delivered: 'badge bg-success rounded-0',
    cancelled: 'badge bg-danger rounded-0',
    qc_pending: 'badge bg-info rounded-0',
    qc_rejected: 'badge bg-danger rounded-0',
    order_to_manufacture: 'badge bg-secondary rounded-0'
  }
  return map[s] || 'badge bg-light text-dark rounded-0'
}

async function fetchOrders() {
  if (!isLoggedIn.value) return
  isLoading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user.id || user.userId
    if (!userId) {
      orders.value = []
      return
    }
    const response = await axios.get(`${API_BASE}/api/v1/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 0, size: 50, sort: ['createdAt,desc'] }
    })
    if (response.data && response.data.content) {
      orders.value = response.data.content
    } else if (Array.isArray(response.data)) {
      orders.value = response.data
    }
  } catch (error) {
    console.warn('Failed to fetch orders:', error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.badge {
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
}
</style>