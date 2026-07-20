<template>
  <main>
    <!-- Banner Header matching shop-right-sidebar.html -->
    <header class="bannerHead bannerheader w-100 overflow-hidden position-relative d-flex text-center">
      <div class="alignHolder w-100 d-flex">
        <div class="align my-auto py-2 w-100">
          <div class="container headingHead">
            <h1 class="hhHeading HDii">{{ pageTitle }}</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb justify-content-center">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none">Home</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link to="/products" class="text-decoration-none">Shop</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ pageTitle }}</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <span class="bgCover w-100 h-100 position-absolute bhBgImage" style="background-image: url(https://cdn.jeweltaime.com/img63.jpg);"></span>
    </header>

    <section class="itemContentBlock pt-8 pb-10 pt-lg-14 pb-lg-14">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-3">
            <aside class="shopSidebar">
              <div class="widget">
                <h3 class="widgetHeading fw-normal mb-3">Categories</h3>
                <ul class="list-unstyled catList">
                  <li v-for="cat in allCategories" :key="cat.id">
                    <router-link :to="`/category/${cat.slug}`">{{ cat.name }}</router-link>
                    <ul v-if="cat.children && cat.children.length" class="list-unstyled ps-3 mt-1 mb-2">
                      <li v-for="child in cat.children" :key="child.id">
                        <router-link :to="`/category/${child.slug}`" class="small">{{ child.name }}</router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <!-- Price Range Filter -->
              <div class="widget mt-5">
                <h3 class="widgetHeading fw-normal mb-3">Price Range</h3>
                <div class="d-flex align-items-center gap-2">
                  <input type="number" class="form-control form-control-sm rounded-0" v-model="priceMin" placeholder="Min" min="0" @change="onFilterChange">
                  <span class="text-muted">–</span>
                  <input type="number" class="form-control form-control-sm rounded-0" v-model="priceMax" placeholder="Max" min="0" @change="onFilterChange">
                </div>
                <div v-if="priceMin || priceMax" class="mt-2">
                  <small class="text-muted cursor-pointer" style="cursor: pointer;" @click="clearPriceFilter">Clear</small>
                </div>
              </div>
              <!-- In Stock Filter -->
              <div class="widget mt-4">
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="inStockOnly" v-model="inStockOnly" @change="onFilterChange">
                  <label class="form-check-label fw-normal" for="inStockOnly">In Stock Only</label>
                </div>
              </div>
            </aside>
          </div>
          <div class="col-12 col-lg-9">
            <header class="showhead d-flex flex-wrap justify-content-between mb-7">
              <p class="mb-0">Showing {{ filteredProducts.length }} of {{ allProducts.length }} results</p>
              <select class="form-select w-auto" v-model="sortBy" @change="fetchProducts">
                <option value="name,asc">Name: A to Z</option>
                <option value="name,desc">Name: Z to A</option>
                <option value="basePriceUsd,asc">Price: Low to High</option>
                <option value="basePriceUsd,desc">Price: High to Low</option>
              </select>
            </header>

            <div v-if="isLoading" class="text-center py-10">
              <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading products...</p>
            </div>

            <div v-else-if="error" class="text-center py-10">
              <p class="text-danger">{{ error }}</p>
              <button class="btn btn-dark btn-sm" @click="fetchProducts">Retry</button>
            </div>

            <div v-else-if="products.length === 0" class="text-center py-10">
              <p class="text-muted">No products found.</p>
            </div>

            <div v-else class="row row-gap-5">
              <div class="col-12 col-sm-6 col-xl-4" v-for="product in filteredProducts" :key="product.id">
                <ProductCard :product="formatProduct(product)" />
              </div>
            </div>

            <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-8">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 0 }">
                  <a class="page-link" href="javascript:void(0);" @click="goToPage(currentPage - 1)">Previous</a>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page - 1 }">
                  <a class="page-link" href="javascript:void(0);" @click="goToPage(page - 1)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                  <a class="page-link" href="javascript:void(0);" @click="goToPage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useCategoryStore } from '../stores/categoryStore'
import axios from 'axios'

const route = useRoute()
const categoryStore = useCategoryStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const products = ref([])
const totalProducts = ref(0)
const totalPages = ref(0)
const currentPage = ref(0)
const pageSize = 12
const sortBy = ref('name,asc')
const isLoading = ref(false)
const error = ref('')

// --- Client-side Filters ---
const priceMin = ref(null)
const priceMax = ref(null)
const inStockOnly = ref(false)

const allProducts = computed(() => products.value)

const filteredProducts = computed(() => {
  let result = allProducts.value

  // Price range filter
  const min = Number(priceMin.value)
  const max = Number(priceMax.value)
  if (!isNaN(min)) {
    result = result.filter(p => (p.basePriceUsd || 0) >= min)
  }
  if (!isNaN(max)) {
    result = result.filter(p => (p.basePriceUsd || 0) <= max)
  }

  // In-stock only filter
  if (inStockOnly.value) {
    result = result.filter(p => {
      const qty = p.stockQuantity ?? p.inventoryQuantity ?? p.availableStock
      return qty === undefined || qty === null || qty > 0
    })
  }

  return result
})

function onFilterChange() {
  // Filters are reactive via computed — trigger re-render
}

function clearPriceFilter() {
  priceMin.value = null
  priceMax.value = null
}

const slug = computed(() => route.params.slug || 'all')

const allCategories = computed(() => categoryStore.getRootCategories)

const pageTitle = computed(() => {
  if (!slug.value || slug.value === 'all') return 'All Products'
  const cat = categoryStore.getCategoryBySlug(slug.value)
  return cat ? cat.name : slug.value.charAt(0).toUpperCase() + slug.value.slice(1)
})

function findCategory(slug) {
  return categoryStore.getCategoryBySlug(slug)
}

function formatProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.sku || product.id,
    category: product.categoryName || 'Jewelry',
    price: product.basePriceUsd || 0,
    thumbnail: product.thumbnailUrl || '',
    image: product.thumbnailUrl || 'https://placehold.co/305x305',
    sku: product.sku
  }
}

async function fetchProducts() {
  isLoading.value = true
  error.value = ''

  try {
    const category = findCategory(slug.value)
    let response

    if (category && category.id) {
      // Fetch products by category
      response = await axios.get(`${API_BASE}/api/v1/products/category/${category.id}`, {
        params: {
          page: currentPage.value,
          size: pageSize
        }
      })
    } else if (slug.value && slug.value !== 'all') {
      // Search products by keyword
      response = await axios.get(`${API_BASE}/api/v1/products/search`, {
        params: { keyword: slug.value }
      })
      // Search returns array, wrap in pagination format
      if (Array.isArray(response.data)) {
        response.data = {
          content: response.data,
          totalElements: response.data.length,
          totalPages: 1
        }
      }
    } else {
      // Fetch all products
      response = await axios.get(`${API_BASE}/api/v1/products`, {
        params: {
          page: currentPage.value,
          size: pageSize,
          sort: [sortBy.value]
        }
      })
    }

    if (response.data) {
      const data = response.data
      if (Array.isArray(data)) {
        products.value = data
        totalProducts.value = data.length
        totalPages.value = 1
      } else {
        products.value = data.content || []
        totalProducts.value = data.totalElements || 0
        totalPages.value = data.totalPages || 0
      }
    }
  } catch (e) {
    console.warn('Failed to fetch products:', e.message)
    error.value = 'Failed to load products. Please try again.'
    // Fallback to demo products
    products.value = [
      { id: 1, name: 'Cross Stripes & Stone Bracelet', sku: 'BR001', categoryName: 'BRACELETS', basePriceUsd: 169.00 },
      { id: 2, name: 'Echoes Necklace Extension Piece', sku: 'NK002', categoryName: 'CHARM AND DANGLES', basePriceUsd: 199.00 },
      { id: 3, name: 'Four-Leaf Clover Rings', sku: 'RG003', categoryName: 'RINGS', basePriceUsd: 99.00 },
      { id: 4, name: 'Cross of Light Pendant', sku: 'NK004', categoryName: 'NECKLACES', basePriceUsd: 79.00 },
      { id: 5, name: 'Diamond Bow Bracelets', sku: 'BR005', categoryName: 'BRACELETS', basePriceUsd: 120.00 },
      { id: 6, name: 'Golden Earrings', sku: 'ER006', categoryName: 'EARRINGS', basePriceUsd: 85.00 }
    ].map(p => formatProduct(p))
    totalProducts.value = products.value.length
  } finally {
    isLoading.value = false
  }
}

function goToPage(page) {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
    fetchProducts()
    window.scrollTo(0, 0)
  }
}

onMounted(() => {
  categoryStore.loadCategories()
  fetchProducts()
})

watch(() => route.params.slug, () => {
  currentPage.value = 0
  fetchProducts()
})
</script>