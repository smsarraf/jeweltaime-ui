<template>
  <main>
    <!-- Banner Slider from ERP -->
    <section class="introBlock position-relative overflow-hidden w-100">
      <div class="container-fluid px-lgwd-18">
        <div class="ibSliderII">
          <div v-if="banners.length > 0">
            <article class="ibsColumn ibsColII d-md-flex justify-content-md-center bgclr" v-for="banner in banners" :key="banner.id">
              <div class="col-12 col-md-5 py-5 my-md-auto pddngS">
                <div class="ahAlign">
                  <h1 class="hhHeadingI fw-normal mb-1">{{ banner.title || 'Limited Edition Cage Rings' }}</h1>
                  <span class="subHeading d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">{{ banner.subtitle || 'World-class diamond' }}</span>
                  <strong class="subTitle d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">{{ banner.specialText || "Mother's Day Special" }}</strong>
                  <router-link :to="banner.targetUrl || '/products'" class="btn btnThemeOutlined py-2 py-lg-3 px-6 px-lg-9" data-hover="Shop Now">
                    <span class="btnText">{{ banner.buttonText || 'Shop Now' }}</span>
                  </router-link>
                </div>
              </div>
              <div class="col-12 col-md-7 imgHolder iMgII">
                <img :src="banner.imageUrl || 'https://placehold.co/1000x600'" class="w-100" :alt="banner.title || 'Banner'">
              </div>
            </article>
          </div>
          <!-- Fallback when no banners -->
          <div v-else>
            <article class="ibsColumn ibsColII d-md-flex justify-content-md-center bgclr">
              <div class="col-12 col-md-5 py-5 my-md-auto pddngS">
                <div class="ahAlign">
                  <h1 class="hhHeadingI fw-normal mb-1">Limited Edition<br>Cage Rings</h1>
                  <span class="subHeading d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">World-class diamond</span>
                  <strong class="subTitle d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">Mother's Day Special</strong>
                  <router-link to="/products" class="btn btnThemeOutlined py-2 py-lg-3 px-6 px-lg-9" data-hover="Shop Now">
                    <span class="btnText">Shop Now</span>
                  </router-link>
                </div>
              </div>
              <div class="col-12 col-md-7 imgHolder iMgII">
                <img src="https://placehold.co/1000x600" class="w-100" alt="image description">
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Categories from ERP API -->
    <section class="categoriesBlock position-relative w-100 overflow-hidden pt-4 pt-xl-14">
      <div class="container">
        <header class="headingHead text-center mb-8">
          <h2 class="hhHeading fw-normal">Popular Categories</h2>
        </header>
        <div class="colsHolder d-flex flex-wrap justify-content-center">
          <div v-for="cat in popularCategories" :key="cat.id" class="chCol d-flex">
            <router-link :to="`/category/${cat.slug}`" class="catColumn d-block w-100 text-center">
              <div class="imgHolder mx-auto mb-5">
                <img :src="cat.thumbnailUrl || 'https://placehold.co/185x185'" class="w-100 h-100 object-fit-cover" :alt="cat.name">
              </div>
              <h3 class="ctHeading d-inline-block text-uppercase align-top">{{ cat.name.toUpperCase() }}</h3>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Promo Banner -->
    <aside class="badgerIIAsideBlock text-center pt-3">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="babWrapper d-flex align-items-center flex-wrap justify-content-center py-3 px-2">
              <i class="fa-solid fa-tag fa-flip-horizontal babIcn mb-2 mb-md-0 me-md-3"></i>
              <h3 class="mb-0 babHeading fw-light mb-2 mb-md-0 me-md-3">Super discount for your first purchase</h3>
              <a href="javascript:void(0);" class="btn text-uppercase fw-normal mb-2 mb-md-0 me-md-3 py-2">FREE15FIRST</a>
              <p class="mb-0">Use discount code in checkout!</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Featured Products from ERP API (first 4 products) -->
    <section class="collectionBlock position-relative w-100 overflow-hidden py-6 py-md-10 py-lg-15">
      <div class="container">
        <header class="headingHead text-center mb-9">
          <h2 class="position-relative fw-normal hhHeading patternActive d-flex justify-content-center align-items-center gap-4 mb-4">Featured Products</h2>
        </header>
        <ul class="list-unstyled cbFiltersList gap-2 gap-md-5 d-flex isoFiltersList flex-wrap justify-content-center">
          <li class="active">
            <a href="javascript:void(0);">New Arrivals</a>
          </li>
          <li class="">
            <a href="javascript:void(0);" data-filter=".popular">Most Popular</a>
          </li>
          <li class="">
            <a href="javascript:void(0);" data-filter=".bestSeller">Best Seller</a>
          </li>
        </ul>
        <div class="row d-block isoContentHolder">
          <div class="col-12 col-sm-6 col-xl-3 isoCol bestSeller popular mb-5" v-for="product in featuredProducts" :key="product.id">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Badges (static) -->
    <aside class="featuresBlock text-center w-100 position-relative py-9">
      <div class="container">
        <ul class="list-unstyled d-flex flex-wrap justify-content-around gap-1 mb-0">
          <li>
            <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
              <img src="/images/ico-01.svg" width="37" height="30" alt="icon">
            </i>
            <h3 class="fbbHeading fw-normal mb-0">Free Shipping</h3>
            <h4 class="fbbSubheading fw-light mb-0">For all orders over $100</h4>
          </li>
          <li>
            <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
              <img src="/images/ico-02.svg" width="37" height="33" alt="icon">
            </i>
            <h3 class="fbbHeading fw-normal mb-0">30 Days Return</h3>
            <h4 class="fbbSubheading fw-light mb-0">For an Exchange Product</h4>
          </li>
          <li>
            <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
              <img src="/images/ico-03.svg" width="37" height="29" alt="icon">
            </i>
            <h3 class="fbbHeading fw-normal mb-0">Secured Payment</h3>
            <h4 class="fbbSubheading fw-light mb-0">Payment Cards Accepted</h4>
          </li>
          <li>
            <i class="icnWrap d-flex align-items-center justify-content-center mx-auto mb-1">
              <img src="/images/ico-04.svg" width="37" height="37" alt="icon">
            </i>
            <h3 class="fbbHeading fw-normal mb-0">Support 24/7</h3>
            <h4 class="fbbSubheading fw-light mb-0">Contact us Anytime.</h4>
          </li>
        </ul>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useCategoryStore } from '../stores/categoryStore'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const categoryStore = useCategoryStore()

const banners = ref([])
const popularCategories = ref([])
const featuredProducts = ref([])

function formatProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.sku || String(product.id),
    category: product.categoryName || 'Jewelry',
    price: product.basePriceUsd || 0,
    thumbnail: product.thumbnailUrl || '',
    image: product.thumbnailUrl || 'https://placehold.co/305x305',
    sku: product.sku
  }
}

onMounted(async () => {
  // Fetch active banners from ERP
  try {
    const res = await axios.get(`${API_BASE}/api/v1/banners/active`)
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      banners.value = res.data
    }
  } catch (e) {
    banners.value = []
  }

  // Fetch categories from categoryStore (always calls API, no cache)
  await categoryStore.loadCategories()
  const rootCats = categoryStore.getRootCategories
  if (rootCats.length > 0) {
    popularCategories.value = rootCats.slice(0, 5).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      thumbnailUrl: c.thumbnailUrl || ''
    }))
  }

  // Fetch featured products from ERP (first page, 4 items)
  try {
    const res = await axios.get(`${API_BASE}/api/v1/products`, {
      params: { page: 0, size: 4, sort: ['createdAt,desc'] }
    })
    if (res.data) {
      const data = res.data
      const products = data.content || (Array.isArray(data) ? data : [])
      featuredProducts.value = products.slice(0, 4).map(formatProduct)
    }
  } catch (e) {
    featuredProducts.value = []
  }
})
</script>