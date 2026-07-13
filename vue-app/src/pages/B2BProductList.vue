<template>
  <div class="b2b-product-list-page">
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <h1>B2B Product Catalog</h1>
        <p class="subtitle">Browse products and request custom pricing for bulk orders</p>
      </div>
    </div>

    <div class="container">
      <!-- B2B Quote Cart Link -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <div class="view-toggle btn-group btn-group-sm" role="group">
            <button class="btn" :class="viewMode === 'grid' ? 'btn-dark' : 'btn-outline-dark'" @click="viewMode = 'grid'" title="Grid"><i class="fa-solid fa-th"></i></button>
            <button class="btn" :class="viewMode === 'list' ? 'btn-dark' : 'btn-outline-dark'" @click="viewMode = 'list'" title="List"><i class="fa-solid fa-list"></i></button>
          </div>
          <span class="text-muted small">{{ visibleProducts.length }} products</span>
        </div>
        <router-link to="/b2b/quote-cart" class="btn btn-outline-primary btn-sm"><i class="bi bi-cart-plus"></i> View Quote Cart</router-link>
      </div>
      <!-- Search and Filters -->
      <div class="filters-section mb-4">
        <div class="row">
          <div class="col-md-8">
            <div class="input-group">
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Search products by name or SKU..." @input="debouncedSearch" />
              <button class="btn btn-primary" @click="searchProducts"><i class="bi bi-search"></i> Search</button>
            </div>
          </div>
          <div class="col-md-4">
            <select v-model="selectedCategory" class="form-select" @change="filterByCategory">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="row">
          <div v-for="i in 6" :key="i" class="col-lg-4 col-md-6 mb-4">
            <div class="product-card-skeleton">
              <div class="skeleton-image"></div>
              <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <h4>Unable to load products</h4>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadProducts">Retry</button>
      </div>

      <!-- Products: Grid View -->
      <div v-else-if="products.length > 0 && viewMode === 'grid'" class="products-grid">
        <div v-for="product in visibleProducts" :key="product.id" class="product-card">
          <div class="product-image">
            <img v-if="product.primaryImageUrl || product.thumbnailUrl" :src="product.primaryImageUrl || product.thumbnailUrl" :alt="product.name" />
            <div v-else class="no-image"><i class="bi bi-image"></i></div>
          </div>
          <div class="product-info">
            <h3 class="product-name clickable-name" @click="openProductDetail(product)">{{ product.name }}</h3>
            <p class="product-sku">SKU: {{ product.sku }}</p>
            <div class="pricing-section">
              <div class="retail-price">
                <span class="label">Retail:</span>
                <span class="price strikethrough" v-if="product.hasB2bPricing">{{ formatPrice(product.basePriceUsd) }}</span>
                <span class="price" v-else>{{ formatPrice(product.basePriceUsd) }}</span>
              </div>
              <div v-if="product.hasB2bPricing && product.b2bUnitPrice" class="b2b-price">
                <span class="label">B2B:</span>
                <span class="price">{{ formatPrice(product.b2bUnitPrice) }}</span>
                <span class="discount-badge" v-if="product.b2bDiscountPercentage">{{ product.b2bDiscountPercentage }}% off</span>
              </div>
              <div v-else class="no-b2b-price"><span class="text-muted small">Retail applies</span></div>
            </div>
            <div v-if="product.b2bMinQuantity" class="min-qty-badge"><i class="bi bi-box-seam"></i> Min: {{ product.b2bMinQuantity }} units</div>
          </div>
          <div class="product-actions">
            <div class="quantity-selector">
              <label>Qty (min {{ product.b2bMinQuantity || 1 }}):</label>
              <div class="input-group hide-spinners">
                <button class="btn btn-outline-secondary" type="button" @click="updateQuantity(product, -1)">-</button>
                <input v-model="productQuantities[product.id]" type="number" class="form-control text-center" :min="product.b2bMinQuantity || 1" @change="validateQuantity(product)" />
                <button class="btn btn-outline-secondary" type="button" @click="updateQuantity(product, 1)">+</button>
              </div>
            </div>
            <button class="btn btn-primary btn-add-to-quote" @click="addToQuoteCart(product)"><i class="bi bi-cart-plus"></i> Add to Quote</button>
          </div>
        </div>
      </div>

      <!-- Products: List View -->
      <div v-else-if="products.length > 0 && viewMode === 'list'" class="products-list">
        <div v-for="product in visibleProducts" :key="product.id" class="product-list-row">
          <div class="product-list-image">
            <img v-if="product.primaryImageUrl || product.thumbnailUrl" :src="product.primaryImageUrl || product.thumbnailUrl" :alt="product.name" />
            <div v-else class="no-image"><i class="bi bi-image"></i></div>
          </div>
          <div class="product-list-info">
            <h3 class="product-name clickable-name" @click="openProductDetail(product)">{{ product.name }}</h3>
            <p class="product-sku">SKU: {{ product.sku }} <span v-if="product.categoryName">| {{ product.categoryName }}</span></p>
            <p class="product-desc-short">{{ product.shortDescription || '' }}</p>
            <div v-if="product.b2bMinQuantity" class="min-qty-badge"><i class="bi bi-box-seam"></i> Min: {{ product.b2bMinQuantity }} units</div>
          </div>
          <div class="product-list-pricing">
            <div class="pricing-section mb-0">
              <div class="retail-price">
                <span class="label">Retail:</span>
                <span class="price strikethrough" v-if="product.hasB2bPricing">{{ formatPrice(product.basePriceUsd) }}</span>
                <span class="price" v-else>{{ formatPrice(product.basePriceUsd) }}</span>
              </div>
              <div v-if="product.hasB2bPricing && product.b2bUnitPrice" class="b2b-price">
                <span class="label">B2B:</span>
                <span class="price">{{ formatPrice(product.b2bUnitPrice) }}</span>
                <span class="discount-badge" v-if="product.b2bDiscountPercentage">{{ product.b2bDiscountPercentage }}% off</span>
              </div>
            </div>
          </div>
          <div class="product-list-actions">
            <div class="input-group hide-spinners mb-2">
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="updateQuantity(product, -1)">-</button>
              <input v-model="productQuantities[product.id]" type="number" class="form-control text-center" :min="product.b2bMinQuantity || 1" @change="validateQuantity(product)" />
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="updateQuantity(product, 1)">+</button>
            </div>
            <button class="btn btn-primary btn-sm w-100" @click="addToQuoteCart(product)"><i class="bi bi-cart-plus"></i> Add to Quote</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="bi bi-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-section">
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

      <!-- Volume Discount Info -->
      <div class="volume-discount-info">
        <h4>📋 Volume Discount Tiers (B2B):</h4>
        <ul>
          <li>1-9 units: Retail price (no B2B pricing configured)</li>
          <li>10-49 units: 15% off retail</li>
          <li>50+ units: 25% off retail</li>
        </ul>
      </div>
    </div>

    <!-- Product Detail Modal with Carousel & Accordion -->
    <div v-if="selectedProduct" class="modal-overlay" @click.self="closeModal">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedProduct.name }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <!-- Left: Carousel -->
              <div class="col-md-6 mb-3 mb-md-0">
                <div id="modalCarousel" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-indicators">
                    <button v-for="(img, idx) in modalImages" :key="'i'+idx" type="button" data-bs-target="#modalCarousel" :data-bs-slide-to="idx" :class="{ active: idx === modalActiveSlide }" @click="modalActiveSlide = idx"></button>
                  </div>
                  <div class="carousel-inner">
                    <div v-for="(img, idx) in modalImages" :key="'s'+idx" class="carousel-item" :class="{ active: idx === modalActiveSlide }">
                      <img :src="img" class="d-block w-100" :alt="selectedProduct.name + ' ' + idx" style="max-height:450px;object-fit:contain;">
                    </div>
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#modalCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
                  <button class="carousel-control-next" type="button" data-bs-target="#modalCarousel" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
                </div>
                <div v-if="modalImages.length > 1" class="d-flex gap-2 mt-2 flex-wrap">
                  <div v-for="(img, idx) in modalImages" :key="'t'+idx" class="modal-thumb" :class="{ active: idx === modalActiveSlide }" @click="modalActiveSlide = idx">
                    <img :src="img" style="width:60px;height:60px;object-fit:cover;cursor:pointer;border:2px solid transparent;border-radius:4px;">
                  </div>
                </div>
              </div>
              <!-- Right: Info -->
              <div class="col-md-6">
                <h4 class="fw-bold mb-1">{{ selectedProduct.name }}</h4>
                <p class="text-muted mb-2">SKU: {{ selectedProduct.sku }}</p>
                <div v-if="selectedProduct.b2bMinQuantity" class="min-qty-badge mb-3"><i class="bi bi-box-seam"></i> Min. order: {{ selectedProduct.b2bMinQuantity }} units</div>

                <!-- Pricing -->
                <div class="pricing-section mb-3 p-3 bg-light rounded">
                  <div class="retail-price mb-1"><span class="fw-medium">Retail Price:</span> <span class="price" :class="{ strikethrough: selectedProduct.hasB2bPricing }">{{ formatPrice(selectedProduct.basePriceUsd) }}</span></div>
                  <div v-if="selectedProduct.hasB2bPricing && selectedProduct.b2bUnitPrice" class="b2b-price">
                    <span class="fw-medium">B2B Price:</span> <span class="price fs-5 fw-bold text-success">{{ formatPrice(selectedProduct.b2bUnitPrice) }}</span>
                    <span class="discount-badge" v-if="selectedProduct.b2bDiscountPercentage">{{ selectedProduct.b2bDiscountPercentage }}% off</span>
                  </div>
                  <div v-else class="text-muted small">Retail price applies</div>
                </div>

                <!-- Accordion: Description + Additional Info -->
                <div class="accordion mb-3" id="modalAccordion">
                  <div class="accordion-item">
                    <h2 class="accordion-header"><button class="accordion-button py-2" type="button" data-bs-toggle="collapse" data-bs-target="#modalDesc">Description</button></h2>
                    <div id="modalDesc" class="accordion-collapse collapse show" data-bs-parent="#modalAccordion">
                      <div class="accordion-body py-2">{{ selectedProduct.shortDescription || selectedProduct.longDescription || 'No description available.' }}</div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header"><button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target="#modalInfo">Additional Information</button></h2>
                    <div id="modalInfo" class="accordion-collapse collapse" data-bs-parent="#modalAccordion">
                      <div class="accordion-body py-2">
                        <table class="table table-bordered mb-0 small">
                          <tbody>
                            <tr><th class="py-2 px-3 fw-medium">SKU</th><td class="py-2 px-3">{{ selectedProduct.sku }}</td></tr>
                            <tr><th class="py-2 px-3 fw-medium">Category</th><td class="py-2 px-3">{{ selectedProduct.categoryName || 'N/A' }}</td></tr>
                            <tr><th class="py-2 px-3 fw-medium">Min. Order</th><td class="py-2 px-3">{{ selectedProduct.b2bMinQuantity || 'N/A' }}</td></tr>
                            <tr v-if="selectedProduct.jewelleryWeightKg"><th class="py-2 px-3 fw-medium">Weight (kg)</th><td class="py-2 px-3">{{ selectedProduct.jewelleryWeightKg }}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Single product -->
                <template v-if="!selectedProduct.variants || selectedProduct.variants.length === 0">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <label class="fw-medium mb-0">Quantity:</label>
                    <div class="input-group hide-spinners" style="max-width:140px;">
                      <button class="btn btn-outline-secondary" type="button" @click="modalQuantity = Math.max(selectedProduct.b2bMinQuantity || 1, modalQuantity - 1)">-</button>
                      <input v-model.number="modalQuantity" type="number" class="form-control text-center" :min="selectedProduct.b2bMinQuantity || 1" />
                      <button class="btn btn-outline-secondary" type="button" @click="modalQuantity = Math.max(selectedProduct.b2bMinQuantity || 1, modalQuantity + 1)">+</button>
                    </div>
                  </div>
                  <button class="btn btn-primary w-100 py-2" @click="addModalToQuote(selectedProduct, modalQuantity, null)"><i class="bi bi-cart-plus"></i> Add to Quote Cart</button>
                </template>

                <!-- Variants with per-variant qty -->
                <template v-else>
                  <div class="mb-3">
                    <h6 class="fw-medium mb-2">Variants (min {{ selectedProduct.b2bMinQuantity || 1 }} total):</h6>
                    <div class="variant-qty-list">
                      <div v-for="variant in selectedProduct.variants" :key="variant.id" class="variant-qty-row">
                        <span class="variant-name">{{ variant.variantName }}</span>
                        <span class="variant-price">+{{ formatPrice(variant.additionalPrice) }}</span>
                        <div class="input-group hide-spinners variant-qty-input">
                          <button class="btn btn-outline-secondary btn-sm" type="button" @click="variantQty[variant.id] = Math.max(0, (variantQty[variant.id] || 0) - 1)">-</button>
                          <input v-model.number="variantQty[variant.id]" type="number" class="form-control text-center" min="0" />
                          <button class="btn btn-outline-secondary btn-sm" type="button" @click="variantQty[variant.id] = Math.max(0, (variantQty[variant.id] || 0) + 1)">+</button>
                        </div>
                      </div>
                    </div>
                    <div class="variant-total-qty">
                      <strong>Total: {{ totalSelectedQty }}</strong>
                      <span v-if="totalSelectedQty < (selectedProduct.b2bMinQuantity || 1)" class="text-danger ms-2">(Need at least {{ selectedProduct.b2bMinQuantity || 1 }})</span>
                    </div>
                  </div>
                  <button class="btn btn-primary w-100 py-2" :disabled="totalSelectedQty < (selectedProduct.b2bMinQuantity || 1)" @click="addAllVariantsToQuote"><i class="bi bi-cart-plus"></i> Add All to Quote Cart</button>
                </template>

                <!-- Share -->
                <div class="d-flex align-items-center gap-3 mt-3 pt-3 border-top">
                  <span class="fw-medium small">Share:</span>
                  <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl" target="_blank" class="text-decoration-none text-dark"><i class="fa-brands fa-facebook-f"></i></a>
                  <a :href="'https://twitter.com/intent/tweet?url=' + currentUrl + '&text=' + selectedProduct.name" target="_blank" class="text-decoration-none text-dark"><i class="fa-brands fa-twitter"></i></a>
                  <a :href="'https://pinterest.com/pin/create/button/?url=' + currentUrl + '&description=' + selectedProduct.name" target="_blank" class="text-decoration-none text-dark"><i class="fa-brands fa-pinterest-p"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuoteStore } from '../stores/quoteStore'
import { useCategoryStore } from '../stores/categoryStore'
import axios from 'axios'
import { useModal } from '../composables/useModal'

const router = useRouter()
const quoteStore = useQuoteStore()
const categoryStore = useCategoryStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const { showModal } = useModal()

const viewMode = ref('grid')

const products = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(0)
const totalPages = ref(0)
const productQuantities = ref({})

const selectedProduct = ref(null)
const modalQuantity = ref(1)
const variantQty = ref({})
const modalActiveSlide = ref(0)

const modalImages = computed(() => {
  const p = selectedProduct.value
  if (!p) return ['https://via.placeholder.com/600x400?text=No+Image']
  const imgs = []
  if (p.primaryImageUrl) imgs.push(p.primaryImageUrl)
  if (p.thumbnailUrl && !imgs.includes(p.thumbnailUrl)) imgs.push(p.thumbnailUrl)
  if (p.media && Array.isArray(p.media)) {
    p.media.forEach(m => {
      const u = m.url?.startsWith('http') ? m.url : `${API_BASE}${m.url}`
      if (!imgs.includes(u)) imgs.push(u)
    })
  }
  return imgs.length > 0 ? imgs : ['https://via.placeholder.com/600x400?text=No+Image']
})

const currentUrl = computed(() => typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '')

watch(selectedProduct, (p) => {
  modalActiveSlide.value = 0
  if (p && p.variants && p.variants.length > 0) {
    const q = {}; p.variants.forEach(v => { q[v.id] = 0 }); variantQty.value = q
  } else { variantQty.value = {}; modalQuantity.value = p?.b2bMinQuantity || 1 }
})

const totalSelectedQty = computed(() => Object.values(variantQty.value).reduce((s, q) => s + (Number(q) || 0), 0))

onMounted(() => { loadCategories(); loadProducts() })

let searchTimeout
const debouncedSearch = () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { currentPage.value = 0; loadProducts() }, 500) }

async function loadCategories() {
  try { await categoryStore.loadCategories(); categories.value = categoryStore.getRootCategories }
  catch (err) { console.error('Failed to load categories:', err) }
}

async function loadProducts() {
  loading.value = true; error.value = null
  try {
    const token = localStorage.getItem('authToken')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const p = currentPage.value, sz = 12
    let url = `${API_BASE}/api/v1/b2b/catalog`
    const params = { page: p, size: sz }
    if (selectedCategory.value) { url = `${API_BASE}/api/v1/b2b/catalog/category/${selectedCategory.value}` }
    else if (searchQuery.value) { params.keyword = searchQuery.value }
    else { params.sort = ['createdAt,desc'] }
    const resp = await axios.get(url, { headers, params })
    if (resp.data?.content) { products.value = resp.data.content; totalPages.value = resp.data.totalPages || 0 }
    else if (Array.isArray(resp.data)) { products.value = resp.data; totalPages.value = 1 }
    else { products.value = []; totalPages.value = 0 }
  } catch (err) { error.value = err.message || 'Failed'; products.value = []; totalPages.value = 0 }
  finally { loading.value = false }
}

function searchProducts() { currentPage.value = 0; loadProducts() }
function filterByCategory() { currentPage.value = 0; loadProducts() }
function updateQuantity(product, delta) {
  const cur = productQuantities.value[product.id] || 1; const min = product.b2bMinQuantity || 1
  productQuantities.value[product.id] = Math.max(min, (cur || min) + delta)
}
function validateQuantity(product) {
  const min = product.b2bMinQuantity || 1
  if (!productQuantities.value[product.id] || productQuantities.value[product.id] < min) productQuantities.value[product.id] = min
}
function openProductDetail(product) { selectedProduct.value = product }
function closeModal() { selectedProduct.value = null; variantQty.value = {} }

function addModalToQuote(product, qty, variant) {
  const up = product.hasB2bPricing && product.b2bUnitPrice ? product.b2bUnitPrice : product.basePriceUsd
  quoteStore.addToQuote({ productId: product.id, productName: product.name, productSku: product.sku, price: up, quantity: qty, variantId: variant?.id || null, variantName: variant?.variantName || null, notes: '' })
  showModal({ title: 'Added', message: 'Product added to quote cart!', variant: 'success' }); closeModal()
}

function addAllVariantsToQuote() {
  if (!selectedProduct.value) return
  if (totalSelectedQty.value < (selectedProduct.value.b2bMinQuantity || 1)) {
    showModal({
      title: 'Minimum Quantity',
      message: `Total must be at least ${selectedProduct.value.b2bMinQuantity || 1} units.`,
      variant: 'warning'
    })
    return
  }
  const prod = selectedProduct.value; const added = []
  prod.variants.forEach(v => {
    const q = Number(variantQty.value[v.id] || 0)
    if (q > 0) {
      const vp = prod.hasB2bPricing && prod.b2bUnitPrice ? prod.b2bUnitPrice + (v.additionalPrice || 0) : prod.basePriceUsd + (v.additionalPrice || 0)
      quoteStore.addToQuote({ productId: prod.id, productName: prod.name, productSku: v.sku || prod.sku, price: vp, quantity: q, variantId: v.id, variantName: v.variantName, notes: '' })
      added.push(v.variantName)
    }
  })
  showModal({ title: 'Added', message: `Added ${totalSelectedQty.value} items (${added.join(', ')}) to quote cart!`, variant: 'success' }); closeModal()
}

function addToQuoteCart(product) {
  const q = productQuantities.value[product.id] || product.b2bMinQuantity || 1
  const up = product.hasB2bPricing && product.b2bUnitPrice ? product.b2bUnitPrice : product.basePriceUsd
  quoteStore.addToQuote({ productId: product.id, productName: product.name, productSku: product.sku, price: up, quantity: q, variantId: null, variantName: null, notes: '' })
  productQuantities.value[product.id] = product.b2bMinQuantity || 1
  showModal({ title: 'Added', message: 'Product added to quote cart!', variant: 'success' })
}

const visibleProducts = computed(() => { if (!products.value) return []; return products.value.filter(p => p.b2bAvailable === true) })

function formatPrice(price) {
  if (price === null || price === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const displayedPages = computed(() => {
  const pages = []; const maxD = 5
  let s = Math.max(0, currentPage.value - Math.floor(maxD / 2))
  let e = Math.min(totalPages.value, s + maxD)
  s = Math.max(0, e - maxD)
  for (let i = s; i < e; i++) pages.push(i)
  return pages
})

function goToPage(page) { if (page >= 0 && page < totalPages.value) { currentPage.value = page; loadProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }) } }
</script>

<style scoped>
.b2b-product-list-page { min-height: 100vh; background-color: #f8f9fa; }
.page-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem 0; margin-bottom: 2rem; }
.page-header h1 { margin: 0; font-size: 2.5rem; font-weight: 700; }
.subtitle { margin: 0.5rem 0 0; opacity: 0.9; font-size: 1.1rem; }
.filters-section { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 2rem; margin-bottom: 2rem; }
.product-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
.product-image { height: 220px; overflow: hidden; background: #f8f9fa; }
.product-image img { width: 100%; height: 100%; object-fit: cover; }
.no-image { display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem; color: #ccc; }
.product-info { padding: 1.2rem; }
.clickable-name { cursor: pointer; color: #667eea !important; }
.clickable-name:hover { color: #764ba2 !important; text-decoration: underline; }
.product-name { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.35rem; }
.product-sku { font-size: 0.8rem; color: #666; margin-bottom: 0.75rem; }
.pricing-section { margin-bottom: 0.75rem; }
.retail-price, .b2b-price { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
.retail-price .label, .b2b-price .label { font-size: 0.8rem; color: #666; }
.retail-price .price { font-size: 0.95rem; font-weight: 600; }
.b2b-price .price { font-size: 1rem; font-weight: 700; color: #28a745; }
.discount-badge { background: #28a745; color: white; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
.no-b2b-price { padding: 0.3rem; background: #f8f9fa; border-radius: 4px; }
.strikethrough { text-decoration: line-through; color: #999 !important; }
.min-qty-badge { display: inline-flex; align-items: center; gap: 0.3rem; background: #e8f4fd; color: #0056b3; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.product-actions { padding: 0 1.2rem 1.2rem; }
.quantity-selector { margin-bottom: 0.75rem; }
.quantity-selector label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.35rem; }
.quantity-selector .input-group { max-width: 150px; }
.quantity-selector input { text-align: center; }
.btn-add-to-quote { width: 100%; padding: 0.6rem; font-weight: 600; }
.empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 8px; }
.empty-state i { font-size: 4rem; color: #ccc; margin-bottom: 1rem; }
.empty-state h3 { color: #333; margin-bottom: 0.5rem; }
.empty-state p { color: #666; }
.pagination-section { display: flex; justify-content: center; margin: 2rem 0; }
.volume-discount-info { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }

/* List View */
.products-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
.product-list-row { display: flex; align-items: center; gap: 1rem; background: white; border-radius: 8px; padding: 0.75rem 1rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.product-list-image { width: 100px; min-width: 100px; height: 100px; border-radius: 6px; overflow: hidden; background: #f8f9fa; }
.product-list-image img { width: 100%; height: 100%; object-fit: cover; }
.product-list-info { flex: 1; min-width: 0; }
.product-list-info .product-name { font-size: 1rem; margin-bottom: 0.2rem; }
.product-list-info .product-sku { font-size: 0.75rem; margin-bottom: 0.2rem; }
.product-desc-short { font-size: 0.8rem; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-list-pricing { min-width: 130px; text-align: right; }
.product-list-actions { min-width: 140px; }

/* Skeleton */
.product-card-skeleton { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.skeleton-image { height: 220px; background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200%100%; animation: skeleton-loading 1.5s infinite; }
.skeleton-content { padding: 1.5rem; }
.skeleton-title { height: 24px; background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200%100%; animation: skeleton-loading 1.5s infinite; border-radius:4px; margin-bottom:1rem; }
.skeleton-text { height: 16px; background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200%100%; animation: skeleton-loading 1.5s infinite; border-radius:4px; margin-bottom:0.5rem; }
.skeleton-text.short { width: 60%; }
@keyframes skeleton-loading { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }

/* Spinner hide */
.hide-spinners input[type="number"]::-webkit-inner-spin-button,
.hide-spinners input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.hide-spinners input[type="number"] { -moz-appearance: textfield; }

/* Modal */
.modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:1050; padding:1rem; }
.modal-dialog { max-width:1000px; width:100%; max-height:92vh; overflow-y:auto; }
.modal-content { background:white; border-radius:10px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.25); }
.modal-header { padding:1rem 1.5rem; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; }
.modal-header .modal-title { font-size:1.3rem; font-weight:700; }
.modal-body { padding:1.5rem; }
.modal-thumb.active img { border-color:#667eea !important; }

/* Variant qty */
.variant-qty-list { display:flex; flex-direction:column; gap:0.4rem; margin-bottom:0.5rem; }
.variant-qty-row { display:flex; align-items:center; gap:0.75rem; padding:0.5rem; background:#f8f9fa; border-radius:6px; }
.variant-qty-row .variant-name { font-weight:600; min-width:90px; font-size:0.85rem; }
.variant-qty-row .variant-price { color:#28a745; font-weight:600; font-size:0.8rem; min-width:50px; }
.variant-qty-input { max-width:130px; margin-left:auto; }
.variant-qty-input input { text-align:center; min-width:40px; }
.variant-total-qty { padding:0.4rem 0; border-top:1px solid #eee; margin-top:0.4rem; }
</style>