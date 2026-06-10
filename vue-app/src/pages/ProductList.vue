<template>
  <main>
      <header class="pageMainHead d-flex position-relative bgCover w-100 text-white" style="background-image: url(https://placehold.co/1920x300);">
          <div class="align-self-center text-center w-100">
              <div class="container">
                  <h1 class="pageHeading mb-3">{{ categoryTitle }}</h1>
                  <nav aria-label="breadcrumb">
                      <ol class="breadcrumb d-flex justify-content-center mb-0">
                          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                          <li class="breadcrumb-item"><router-link to="/products">Shop</router-link></li>
                          <li class="breadcrumb-item active" aria-current="page">{{ categoryTitle }}</li>
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
                                  <li><router-link to="/category/necklaces">Necklaces</router-link></li>
                                  <li><router-link to="/category/bracelets">Bracelets</router-link></li>
                                  <li><router-link to="/category/earrings">Earrings</router-link></li>
                                  <li><router-link to="/category/rings">Rings</router-link></li>
                                  <li><router-link to="/category/charms">Charms</router-link></li>
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()

const categoryId = computed(() => route.params.categoryId || 'all')
const categoryTitle = computed(() => {
  if (categoryId.value === 'all') return 'All Products'
  return categoryId.value.charAt(0).toUpperCase() + categoryId.value.slice(1)
})

const products = ref([
  {
      id: 1,
      name: 'Cross Stripes & Stone Bracelet',
      category: 'BRACELETS',
      price: 169.00,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 2,
      name: 'Echoes Necklace Extension Piece',
      category: 'CHARM AND DANGLES',
      price: 199.00,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 3,
      name: 'Four-Leaf Clover Rings',
      category: 'RINGS',
      price: 99.00,
      originalPrice: 129.00,
      sale: true,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 4,
      name: 'Cross of Light Pendant',
      category: 'NECKLACES',
      price: 79.00,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 5,
      name: 'Diamond Bow Bracelets',
      category: 'BRACELETS',
      price: 120.00,
      image: 'https://placehold.co/305x305'
  },
  {
      id: 6,
      name: 'Golden Earrings',
      category: 'EARRINGS',
      price: 85.00,
      image: 'https://placehold.co/305x305'
  }
])
</script>
