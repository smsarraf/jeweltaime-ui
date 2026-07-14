<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
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
            <p class="mb-5">Sign in to view your dashboard.</p>
            <router-link to="/signin" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Sign In</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Content -->
    <section v-else class="py-7">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-12 col-lg-3 mb-6 mb-lg-0">
            <div class="card rounded-0 border">
              <div class="card-body text-center py-6">
                <div class="avatar-placeholder rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                  {{ userInitial }}
                </div>
                <h5 class="fw-medium mb-1">{{ userData?.firstName }} {{ userData?.lastName }}</h5>
                <p class="text-muted small mb-0">{{ userData?.email }}</p>
              </div>
              <div class="list-group list-group-flush rounded-0">
                <router-link to="/dashboard" class="list-group-item list-group-item-action d-flex align-items-center py-3 active">
                  <i class="fa-solid fa-gauge-high me-3"></i> Dashboard
                </router-link>
                <router-link to="/profile" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                  <i class="fa-solid fa-user me-3"></i> My Profile
                </router-link>
                <!-- B2B-specific navigation links -->
                <template v-if="isB2BUser">
                  <router-link to="/b2b/products" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                    <i class="fa-solid fa-store me-3"></i> B2B Catalog
                  </router-link>
                  <router-link to="/b2b/quotes" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                    <i class="fa-solid fa-file-invoice me-3"></i> My Quotes
                  </router-link>
                  <router-link to="/b2b/quote-cart" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                    <i class="fa-solid fa-cart-plus me-3"></i> Quote Cart
                  </router-link>
                </template>
                <!-- Regular user navigation links -->
                <template v-else>
                  <router-link to="/orders" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                    <i class="fa-solid fa-box me-3"></i> My Orders
                  </router-link>
                  <router-link to="/invoices" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                    <i class="fa-regular fa-file-lines me-3"></i> My Invoices
                  </router-link>
                </template>
                <router-link to="/wishlist" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                  <i class="fa-regular fa-heart me-3"></i> Wishlist
                </router-link>
                <a href="javascript:void(0);" class="list-group-item list-group-item-action d-flex align-items-center py-3 text-danger" @click="handleLogout">
                  <i class="fa-solid fa-sign-out-alt me-3"></i> Sign Out
                </a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-12 col-lg-9">
            <!-- Stats Cards -->
            <div class="row mb-6">
              <div class="col-12 col-sm-4 mb-4 mb-sm-0">
                <div class="card rounded-0 border text-center py-4">
                  <div class="card-body">
                    <h3 class="fw-bold mb-1">{{ orders.length }}</h3>
                    <p class="text-muted small mb-0">Total Orders</p>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4 mb-4 mb-sm-0">
                <div class="card rounded-0 border text-center py-4">
                  <div class="card-body">
                    <h3 class="fw-bold mb-1 text-success">{{ activeOrders.length }}</h3>
                    <p class="text-muted small mb-0">Active Orders</p>
                  </div>
                </div>
              </div>
              <div class="col-12 col-sm-4">
                <div class="card rounded-0 border text-center py-4">
                  <div class="card-body">
                    <h3 class="fw-bold mb-1 text-danger">{{ cancelledOrders.length }}</h3>
                    <p class="text-muted small mb-0">Cancelled</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Orders -->
            <div class="card rounded-0 border">
              <div class="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 class="fw-medium mb-0">Recent Orders</h5>
                <router-link to="/orders" class="btn btn-outline-dark btn-sm rounded-0">View All</router-link>
              </div>
              <div class="card-body p-0">
                <div v-if="isLoadingOrders" class="text-center py-5">
                  <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted small">Loading orders...</p>
                </div>
                <div v-else-if="orders.length === 0" class="text-center py-5">
                  <i class="fa-solid fa-box-open text-muted" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                  <p class="mb-0">No orders yet.</p>
                  <router-link to="/products" class="btn btn-dark btn-sm mt-3 rounded-0">Start Shopping</router-link>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-borderless mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th class="fw-medium py-3 px-4">Order ID</th>
                        <th class="fw-medium py-3 px-4">Date</th>
                        <th class="fw-medium py-3 px-4">Total</th>
                        <th class="fw-medium py-3 px-4">Status</th>
                        <th class="fw-medium py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in paginatedOrders" :key="order.id" class="border-top">
                        <td class="py-3 px-4">
                          <router-link :to="`/orders/${order.id}`" class="text-decoration-none fw-medium">#{{ order.id }}</router-link>
                        </td>
                        <td class="py-3 px-4">{{ formatDate(order.createdAt) }}</td>
                        <td class="py-3 px-4">{{ currencyStore.formatPrice(getOrderPricingSummary(order).finalTotal) }}</td>
                        <td class="py-3 px-4">
                          <span :class="statusBadgeClass(order.status)">{{ order.status }}</span>
                        </td>
                        <td class="py-3 px-4">
                          <button
                            v-if="canCancel(order.status)"
                            class="btn btn-outline-danger btn-sm rounded-0"
                            @click="cancelOrder(order.id)"
                            :disabled="cancellingId === order.id"
                          >
                            <span v-if="cancellingId === order.id">
                              <span class="spinner-border spinner-border-sm me-1" role="status"></span>Cancelling...
                            </span>
                            <span v-else>Cancel</span>
                          </button>
                          <router-link
                            v-else
                            :to="`/orders/${order.id}`"
                            class="btn btn-outline-dark btn-sm rounded-0"
                          >
                            View
                          </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Pagination -->
                  <div v-if="totalPages > 1" class="d-flex justify-content-center py-3 border-top">
                    <nav>
                      <ul class="pagination pagination-sm mb-0">
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
              </div>
            </div>
          </div>
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
import { clearAuth } from '../utils/auth'
import { useAuthSession } from '../composables/useAuthSession'
import { getOrderPricingSummary } from '../utils/orderPricing'
import { useModal } from '../composables/useModal'

const router = useRouter()
const currencyStore = useCurrencyStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const { showModal, confirmModal } = useModal()

const { isLoggedIn, user: userData } = useAuthSession()

const isB2BUser = computed(() => {
  if (!userData.value) {
    // Fallback to separately stored roles key
    try {
      const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]')
      return Array.isArray(storedRoles) && storedRoles.some(r => {
        const roleName = typeof r === 'string' ? r : (r.name || r.authority || '')
        return roleName === 'B2B_USER' || roleName === 'ROLE_B2B_USER'
      })
    } catch {
      return false
    }
  }
  // Check authorities array (Spring Security GrantedAuthority format)
  const authorities = userData.value.authorities || []
  if (Array.isArray(authorities) && authorities.some(r => {
    const roleName = typeof r === 'string' ? r : (r.authority || r.name || '')
    return roleName === 'B2B_USER' || roleName === 'ROLE_B2B_USER'
  })) return true
  // Check single role object (User.role)
  if (userData.value.role) {
    const roleName = typeof userData.value.role === 'string' ? userData.value.role : (userData.value.role.name || '')
    return roleName === 'B2B_USER' || roleName === 'ROLE_B2B_USER'
  }
  // Check roles array (fallback)
  const roles = userData.value.roles || []
  if (Array.isArray(roles) && roles.some(r => {
    const roleName = typeof r === 'string' ? r : (r.name || r.authority || '')
    return roleName === 'B2B_USER' || roleName === 'ROLE_B2B_USER'
  })) return true
  // Final fallback - check separately stored roles from localStorage
  try {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]')
    return Array.isArray(storedRoles) && storedRoles.some(r => {
      const roleName = typeof r === 'string' ? r : (r.name || r.authority || '')
      return roleName === 'B2B_USER' || roleName === 'ROLE_B2B_USER'
    })
  } catch {
    return false
  }
})

const userInitial = computed(() => {
  if (userData.value?.firstName) return userData.value.firstName.charAt(0).toUpperCase()
  return 'U'
})

const orders = ref([])
const isLoadingOrders = ref(false)
const cancellingId = ref(null)
const currentPage = ref(1)
const pageSize = 5

const activeOrders = computed(() => orders.value.filter(o => !['cancelled', 'delivered', 'refunded'].includes(o.status)))
const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'))
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
    shipped: 'badge bg-dark text-white rounded-0',
    delivered: 'badge bg-success rounded-0',
    cancelled: 'badge bg-danger rounded-0',
    qc_pending: 'badge bg-info rounded-0',
    qc_rejected: 'badge bg-danger rounded-0',
    order_to_manufacture: 'badge bg-secondary rounded-0'
  }
  return map[s] || 'badge bg-light text-dark rounded-0'
}

function canCancel(status) {
  if (!status) return false
  const s = status.toLowerCase()
  return ['ordered', 'preparing'].includes(s)
}

async function fetchOrders() {
  if (!isLoggedIn.value) return
  isLoadingOrders.value = true
  try {
    const token = localStorage.getItem('authToken')
    const userId = userData.value?.id
    if (!userId) {
      orders.value = []
      return
    }
    const response = await axios.get(`${API_BASE}/api/v1/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 0, size: 20, sort: ['createdAt,desc'] }
    })
    if (response.data && response.data.content) {
      orders.value = response.data.content
    }
  } catch (error) {
    console.warn('Failed to fetch orders:', error.message)
  } finally {
    isLoadingOrders.value = false
  }
}

async function cancelOrder(orderId) {
  const confirmed = await confirmModal({
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order?',
    confirmText: 'Yes',
    cancelText: 'No',
    variant: 'danger'
  })
  if (!confirmed) return
  cancellingId.value = orderId
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.patch(`${API_BASE}/api/v1/orders/${orderId}/status`, null, {
      params: { status: 'CANCELLED' },
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data) {
      const idx = orders.value.findIndex(o => o.id === orderId)
      if (idx !== -1) {
        orders.value[idx] = response.data
      }
    }
  } catch (error) {
    showModal({
      title: 'Error',
      message: error.response?.data?.error || error.response?.data?.message || 'Failed to cancel order.',
      variant: 'danger'
    })
  } finally {
    cancellingId.value = null
  }
}

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('authToken')
    if (token) {
      await axios.post(`${API_BASE}/api/v1/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  } catch (e) {
    // Silent fail — clear local state regardless
  }
  clearAuth()
  router.push('/')
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.list-group-item.active {
  background-color: #000;
  border-color: #000;
}
.badge {
  font-weight: 400;
  padding: 0.4rem 0.75rem;
}
.avatar-placeholder {
  line-height: 80px;
}
</style>