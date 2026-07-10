<template>
  <div class="b2b-my-quotes-page">
    <div class="page-header">
      <div class="container">
        <h1>My Quote Requests</h1>
        <p class="subtitle">Track and manage your B2B quote requests</p>
      </div>
    </div>

    <div class="container">
      <!-- Status Filters -->
      <div class="filters-section">
        <div class="btn-group status-filters flex-wrap" role="group">
          <button
            v-for="filter in statusFilters"
            :key="filter.value"
            :class="['btn', activeFilter === filter.value ? 'btn-primary' : 'btn-outline-primary']"
            @click="setFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ quotes.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item pending">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-item quoted">
          <span class="stat-value">{{ quotedCount }}</span>
          <span class="stat-label">Quoted</span>
        </div>
        <div class="stat-item accepted">
          <span class="stat-value">{{ acceptedCount }}</span>
          <span class="stat-label">Accepted</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div v-for="i in 3" :key="i" class="skeleton-item">
          <div class="skeleton-line w-75"></div>
          <div class="skeleton-line w-50"></div>
          <div class="skeleton-line w-100"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <h4>⚠️ Unable to load quote requests</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchQuotes">Retry</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredQuotes.length === 0" class="empty-state">
        <i class="bi bi-inbox"></i>
        <h3>No Quote Requests Yet</h3>
        <p>You haven't submitted any quote requests. Browse our catalog and add products to get started.</p>
        <router-link to="/b2b/products" class="btn btn-primary">
          <i class="bi bi-grid"></i> Browse Products
        </router-link>
      </div>

      <!-- Quotes List -->
      <div v-else class="quotes-list">
        <div v-for="quote in filteredQuotes" :key="quote.id" class="quote-card">
          <div class="quote-header">
            <div class="quote-number">{{ quote.quoteNumber }}</div>
            <div :class="['badge', getStatusClass(quote.status)]">
              {{ getStatusLabel(quote.status) }}
            </div>
          </div>

          <div class="quote-items-preview">
            <span v-for="item in (quote.items || []).slice(0, 3)" :key="item.id" class="item-tag">
              {{ item.productName }} ({{ item.requestedQuantity }})
            </span>
            <span v-if="quote.items && quote.items.length > 3" class="item-tag more">
              +{{ quote.items.length - 3 }} more
            </span>
          </div>

          <div class="quote-details-row">
            <div class="detail">
              <span class="label">Total (Retail est.):</span>
              <span class="value">{{ formatPrice(quote.subtotalAmount) }}</span>
            </div>
            <div class="detail">
              <span class="label">Submitted:</span>
              <span class="value">{{ formatDate(quote.createdAt) }}</span>
            </div>
          </div>

          <div v-if="quote.status === 'QUOTED'" class="quoted-info">
            <span class="quoted-price">Quoted: {{ formatPrice(quote.totalAmount) }}</span>
            <span class="valid-until">Valid until: {{ formatDate(quote.validUntil) }}</span>
          </div>

          <div v-if="quote.status === 'CONVERTED'" class="converted-info">
            <i class="bi bi-check-circle-fill"></i>
            <span>Converted to Order #ORD-{{ quote.convertedOrderId }}</span>
          </div>

          <div v-if="quote.status === 'REJECTED'" class="rejected-info">
            <i class="bi bi-x-circle-fill"></i>
            <span>{{ quote.adminNotes || 'Request declined' }}</span>
          </div>

          <div v-if="quote.status === 'EXPIRED'" class="expired-info">
            <i class="bi bi-clock"></i>
            <span>Expired on {{ formatDate(quote.validUntil) }}. Please submit a new request.</span>
          </div>

          <div class="quote-actions">
            <router-link :to="`/b2b/quotes/${quote.id}`" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-eye"></i> View Details
            </router-link>
            <button v-if="quote.status === 'QUOTED'" class="btn btn-success btn-sm" @click="acceptQuote(quote)">
              <i class="bi bi-check-lg"></i> Accept Quote
            </button>
            <button v-if="quote.status === 'EXPIRED'" class="btn btn-outline-secondary btn-sm" @click="requestNewQuote(quote)">
              <i class="bi bi-arrow-counterclockwise"></i> Request New Quote
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-section justify-content-center d-flex mt-4">
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
            </li>
            <li v-for="page in displayedPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link" @click="goToPage(page)">{{ page + 1 }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
              <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { b2bQuoteService } from '../services/b2bQuoteService'
import { useModal } from '../composables/useModal'

const router = useRouter()
const { showModal, confirmModal } = useModal()

const quotes = ref([])
const loading = ref(false)
const error = ref(null)
const activeFilter = ref('ALL')
const currentPage = ref(0)
const totalPages = ref(0)

const statusFilters = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Quoted', value: 'QUOTED' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Expired', value: 'EXPIRED' }
]

const filteredQuotes = computed(() => {
  if (activeFilter.value === 'ALL') return quotes.value
  return quotes.value.filter(q => q.status === activeFilter.value)
})

const pendingCount = computed(() => quotes.value.filter(q => q.status === 'PENDING').length)
const quotedCount = computed(() => quotes.value.filter(q => q.status === 'QUOTED').length)
const acceptedCount = computed(() => quotes.value.filter(q => ['ACCEPTED', 'CONVERTED'].includes(q.status)).length)

onMounted(() => {
  fetchQuotes()
})

async function fetchQuotes() {
  loading.value = true
  error.value = null
  try {
    const response = await b2bQuoteService.getMyQuotes({
      page: currentPage.value,
      size: 10,
      sort: 'createdAt,desc'
    })
    quotes.value = response.content || []
    totalPages.value = response.totalPages || 0
  } catch (err) {
    error.value = err.message || 'Failed to load quotes'
  } finally {
    loading.value = false
  }
}

function setFilter(filter) {
  activeFilter.value = filter
}

function getStatusClass(status) {
  const map = { PENDING: 'bg-info', QUOTED: 'bg-success', ACCEPTED: 'bg-primary', REJECTED: 'bg-danger', EXPIRED: 'bg-secondary', CONVERTED: 'bg-success' }
  return map[status] || 'bg-secondary'
}

function getStatusLabel(status) {
  const map = { PENDING: '⏳ PENDING', QUOTED: '💲 QUOTED', ACCEPTED: '✓ ACCEPTED', REJECTED: '✗ REJECTED', EXPIRED: '⏰ EXPIRED', CONVERTED: '📦 CONVERTED' }
  return map[status] || status
}

async function acceptQuote(quote) {
  const confirmed = await confirmModal({
    title: 'Accept Quote',
    message: `Accept quote ${quote.quoteNumber} for ${formatPrice(quote.totalAmount)}? This will create an order.`,
    confirmText: 'Yes',
    cancelText: 'No',
    variant: 'success'
  })
  if (!confirmed) return
  try {
    await b2bQuoteService.acceptQuote(quote.id)
    await fetchQuotes()
    showModal({
      title: 'Success',
      message: 'Quote accepted! Order is being created.',
      variant: 'success'
    })
  } catch (err) {
    showModal({
      title: 'Error',
      message: err.message || 'Failed to accept quote',
      variant: 'danger'
    })
  }
}

function requestNewQuote(quote) {
  router.push('/b2b/products')
}

function formatPrice(price) {
  if (price === null || price === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  let start = Math.max(0, currentPage.value - Math.floor(maxDisplayed / 2))
  let end = Math.min(totalPages.value, start + maxDisplayed)
  start = Math.max(0, end - maxDisplayed)
  for (let i = start; i < end; i++) pages.push(i)
  return pages
})

function goToPage(page) {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchQuotes()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.b2b-my-quotes-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}
.page-header h1 { margin: 0; font-size: 2.5rem; font-weight: 700; }
.subtitle { margin: 0.5rem 0 0; opacity: 0.9; font-size: 1.1rem; }
.filters-section { margin-bottom: 1.5rem; }
.status-filters { width: 100%; }
.status-filters .btn { flex: 1; }
.stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-item {
  flex: 1;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.stat-value { display: block; font-size: 1.75rem; font-weight: 700; color: #333; }
.stat-label { font-size: 0.875rem; color: #666; }
.stat-item.pending .stat-value { color: #17a2b8; }
.stat-item.quoted .stat-value { color: #28a745; }
.stat-item.accepted .stat-value { color: #007bff; }
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.empty-state i { font-size: 4rem; color: #ccc; margin-bottom: 1rem; }
.empty-state h3 { color: #333; margin-bottom: 0.5rem; }
.empty-state p { color: #666; margin-bottom: 1.5rem; }
.quote-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.quote-number { font-family: monospace; font-size: 1.1rem; font-weight: 700; color: #667eea; }
.quote-items-preview { margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.item-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #555;
}
.item-tag.more { background: #e8f4fd; color: #0c5460; }
.quote-details-row { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
.detail .label { font-size: 0.875rem; color: #666; margin-right: 0.5rem; }
.detail .value { font-weight: 600; }
.quoted-info {
  background: #d4edda;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.quoted-price { font-weight: 700; color: #155724; }
.valid-until { color: #155724; }
.converted-info {
  background: #d4edda;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #155724;
  margin-bottom: 0.75rem;
}
.rejected-info {
  background: #f8d7da;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #721c24;
  margin-bottom: 0.75rem;
}
.expired-info {
  background: #e2e3e5;
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #383d41;
  margin-bottom: 0.75rem;
}
.quote-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.skeleton-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>