<template>
  <main>
    <header class="pageMainHead d-flex position-relative bgCover w-100 text-white" style="background-image: url(https://placehold.co/1920x300);">
      <div class="align-self-center text-center w-100">
        <div class="container">
          <h1 class="pageHeading mb-3">{{ pageTitle }}</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb d-flex justify-content-center mb-0">
              <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
              <li class="breadcrumb-item"><router-link to="/products">Shop</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{ pageTitle }}</li>
            </ol>
          </nav>
        </div>
      </div>
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
            </aside>
          </div>
          <div class="col-12 col-lg-9">
            <header class="showhead d-flex flex-wrap justify-content-between mb-7">
              <p class="mb-0">Showing 1–{{ products.length }} of {{ products.length }} results</p>
              <select class="form-select w-auto">
                <option value="1">Default sorting</option>
                <option value="2">Sort by popularity</option>
                <option value="3">Sort by newness</option>
                <option value="4">Sort by price: low to high</option>
                <option value="5">Sort by price: high to low</option>
              </select>
            </header>

            <div class="row row-gap-5">
              <div class="col-12 col-sm-6 col-xl-4" v-for="product in products" :key="product.id">
                <ProductCard :product="product" />
              </div>
            </div>

            <nav aria-label="Page navigation" class="mt-8">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import axios from 'axios'

const route = useRoute()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const allCategories = ref([])
const slug = computed(() => route.params.slug || 'all')

const pageTitle = computed(() => {
  if (!slug.value || slug.value === 'all') return 'All Products'
  const cat = findCategory(slug.value)
  return cat ? cat.name : slug.value.charAt(0).toUpperCase() + slug.value.slice(1)
})

function findCategory(slug) {
  for (const cat of allCategories.value) {
    if (cat.slug === slug) return cat
    const child = cat.children?.find(c => c.slug === slug)
    if (child) return child
  }
  return null
}

const products = ref([
  {
    id: 1,
    name: 'Cross Stripes & Stone Bracelet',
    slug: 'cross-stripes-stone-bracelet',
    category: 'BRACELETS',
    price: 169.00,
    image: 'https://placehold.co/305x305'
  },
  {
    id: 2,
    name: 'Echoes Necklace Extension Piece',
    slug: 'echoes-necklace-extension',
    category: 'CHARM AND DANGLES',
    price: 199.00,
    image: 'https://placehold.co/305x305'
  },
  {
    id: 3,
    name: 'Four-Leaf Clover Rings',
    slug: 'four-leaf-clover-rings',
    category: 'RINGS',
    price: 99.00,
    originalPrice: 129.00,
    sale: true,
    image: 'https://placehold.co/305x305'
  },
  {
    id: 4,
    name: 'Cross of Light Pendant',
    slug: 'cross-of-light-pendant',
    category: 'NECKLACES',
    price: 79.00,
    image: 'https://placehold.co/305x305'
  },
  {
    id: 5,
    name: 'Diamond Bow Bracelets',
    slug: 'diamond-bow-bracelets',
    category: 'BRACELETS',
    price: 120.00,
    image: 'https://placehold.co/305x305'
  },
  {
    id: 6,
    name: 'Golden Earrings',
    slug: 'golden-earrings',
    category: 'EARRINGS',
    price: 85.00,
    image: 'https://placehold.co/305x305'
  }
])

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/categories/all`)
    if (res.data.success) {
      allCategories.value = res.data.data
    }
  } catch (e) {
    // Fallback
  }
})
</script>