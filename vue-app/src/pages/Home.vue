<template>
  <main>
    <!-- Banner Slider from ERP -->
    <section class="introBlock position-relative overflow-hidden w-100">
      <div class="container-fluid px-lgwd-18">
        <div class="ibSliderII">
          <div v-if="banners.length > 0">
            <article class="ibsColumn ibsColII d-md-flex justify-content-md-center bgclr" v-for="(banner, idx) in banners" :key="banner.id">
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
            <article class="ibsColumn ibsColII d-md-flex justify-content-md-center bgclr2">
              <div class="col-12 col-md-5 py-5 my-md-auto pddngS">
                <div class="ahAlign">
                  <h1 class="hhHeadingI fw-normal mb-1">Pearls Spring<br>Collections</h1>
                  <span class="subHeading d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">Revitalizing Supreme</span>
                  <strong class="subTitle d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">60% OFF Summer Sale</strong>
                  <router-link to="/products" class="btn btnThemeOutlined py-2 py-lg-3 px-6 px-lg-9" data-hover="Shop Now">
                    <span class="btnText">Shop Now</span>
                  </router-link>
                </div>
              </div>
              <div class="col-12 col-md-7 imgHolder iMgII">
                <img src="https://placehold.co/1000x600" class="w-100" alt="image description">
              </div>
            </article>
            <article class="ibsColumn ibsColII d-md-flex justify-content-md-center bgclr3">
              <div class="col-12 col-md-5 py-5 my-md-auto pddngS">
                <div class="ahAlign">
                  <h1 class="hhHeadingI fw-normal mb-1">Crown Brighter<br>Collections</h1>
                  <span class="subHeading d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">Pavé diamonds sets</span>
                  <strong class="subTitle d-block fw-light mb-2 mb-lg-3 mb-lgwd-5">Buy with 30% Discount</strong>
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

    <!-- Featured Products from ERP API -->
    <section class="collectionBlock position-relative w-100 overflow-hidden py-6 py-md-10 py-lg-15">
      <div class="container">
        <header class="headingHead text-center mb-9">
          <h2 class="position-relative fw-normal hhHeading patternActive d-flex justify-content-center align-items-center gap-4 mb-4">Featured Products</h2>
          <ul class="list-unstyled cbFiltersList gap-2 gap-md-5 d-flex isoFiltersList flex-wrap justify-content-center">
            <li :class="{ active: activeFilter === 'newArrivals' }">
              <a href="javascript:void(0);" @click="setFilter('newArrivals')">New Arrivals</a>
            </li>
            <li :class="{ active: activeFilter === 'mostPopular' }">
              <a href="javascript:void(0);" @click="setFilter('mostPopular')">Most Popular</a>
            </li>
            <li :class="{ active: activeFilter === 'bestSeller' }">
              <a href="javascript:void(0);" @click="setFilter('bestSeller')">Best Seller</a>
            </li>
          </ul>
        </header>
        <div class="row d-block isoContentHolder">
          <div class="col-12 col-sm-6 col-xl-3 isoCol mb-5" v-for="product in featuredProducts" :key="product.id">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- Ad Block: Summer Sale Banner -->
    <section class="adBlock w-100 overflow-hidden pb-6 py-xl-8">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="contentblock position-relative">
              <div class="txtblock text-center">
                <h2 class="adHeading text-uppercase fw-normal text-white mb-1">Ready, Set, <br class="d-none d-xl-block"> Summer!</h2>
                <span class="adSub d-block fw-light text-white mb-4">Avon Flourish Honey Blossom Set</span>
                <strong class="adtxt d-block text-white mb-3 mb-lg-7">Buy 1 Get 1 Free</strong>
                <router-link to="/products" class="btn btnTheme fw-normal px-5 px-lg-9">Shop Now</router-link>
              </div>
              <span class="position-absolute w-100 h-100 bgCover ibBgImage" style="background-image: url('https://placehold.co/1370x450');"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Product Sections: Necklaces -->
    <section class="collectionBlock position-relative w-100 overflow-hidden py-6 py-md-7">
      <div class="container">
        <header class="headingHead text-center mb-8">
          <h2 class="hhHeading fw-normal mb-2">Necklaces</h2>
          <router-link to="/category/necklaces" class="btnHeader fw-normal text-decoration-none">Show All Products</router-link>
        </header>
        <div class="row">
          <div class="col-lg-4 col-xl-3 pe-6 d-none d-lg-block">
            <article class="bannerColumn colII position-relative w-100 d-flex flex-column overflow-hidden">
              <div class="py-2 py-lg-5 py-xl-10 px-4 px-lg-8 txt position-absolute">
                <h2 class="bcHeading fw-normal text-white mb-2">
                  <span class="d-block">New Earrings Arrival</span>
                </h2>
                <router-link to="/category/earrings" class="btn-link btnLink fw-normal d-inline-block align-end text-decoration-none">SHOP MORE</router-link>
              </div>
              <span class="bgCover bcImage position-absolute w-100 h-100" style="background-image: url('https://placehold.co/305x410');"></span>
            </article>
          </div>
          <div class="col-12 col-lg-8 col-xl-9">
            <div class="slidersColsHolder">
              <div class="nlSlider">
                <div class="schCol" v-for="product in necklacesProducts" :key="product.id">
                  <ProductCard :product="product" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Product Sections: Charm & Dangles -->
    <section class="collectionBlock position-relative w-100 overflow-hidden py-6 py-md-8">
      <div class="container">
        <header class="headingHead text-center mb-8">
          <h2 class="hhHeading fw-normal mb-2">Charm & Dangles</h2>
          <router-link to="/category/charms-dangles" class="btnHeader fw-normal text-decoration-none">Show All Products</router-link>
        </header>
        <div class="row">
          <div class="col-lg-4 col-xl-3 pe-6 d-none d-lg-block">
            <article class="bannerColumn colII position-relative w-100 d-flex flex-column overflow-hidden">
              <div class="py-2 py-lg-5 py-xl-10 px-4 px-lg-8 txt position-absolute">
                <h2 class="bcHeading fw-normal text-white mb-2">
                  <span class="d-block">Best Diamond Sets 2020</span>
                </h2>
                <router-link to="/products" class="btn-link btnLink fw-normal d-inline-block align-end text-decoration-none">SHOP MORE</router-link>
              </div>
              <span class="bgCover bcImage position-absolute w-100 h-100" style="background-image: url('https://placehold.co/305x410');"></span>
            </article>
          </div>
          <div class="col-12 col-lg-8 col-xl-9">
            <div class="slidersColsHolder">
              <div class="nlSlider">
                <div class="schCol" v-for="product in charmsProducts" :key="product.id">
                  <ProductCard :product="product" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Product Sections: Bracelets & Rings -->
    <section class="collectionBlock position-relative w-100 overflow-hidden py-6 py-md-7">
      <div class="container">
        <header class="headingHead text-center mb-8">
          <h2 class="hhHeading fw-normal mb-2">Bracelets & Rings</h2>
          <router-link to="/products" class="btnHeader fw-normal text-decoration-none">Show All Products</router-link>
        </header>
        <div class="row">
          <div class="col-lg-4 col-xl-3 pe-6 d-none d-lg-block">
            <article class="bannerColumn colII position-relative w-100 d-flex flex-column overflow-hidden">
              <div class="py-2 py-lg-5 py-xl-10 px-4 px-lg-8 txt position-absolute">
                <h2 class="bcHeading fw-normal text-white mb-2">
                  <span class="d-block">Diamond Bow Bracelets</span>
                </h2>
                <router-link to="/products" class="btn-link btnLink fw-normal d-inline-block align-end text-decoration-none">SHOP MORE</router-link>
              </div>
              <span class="bgCover bcImage position-absolute w-100 h-100" style="background-image: url('https://placehold.co/305x410');"></span>
            </article>
          </div>
          <div class="col-12 col-lg-8 col-xl-9">
            <div class="slidersColsHolder">
              <div class="nlSlider">
                <div class="schCol" v-for="product in braceletsRingsProducts" :key="product.id">
                  <ProductCard :product="product" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="container pt-md-6"><hr></div>

    <!-- Brands / Sponsors Section -->
    <aside class="sponsorsBlock w-100 position-relative overflow-hidden py-8 text-center">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <header class="headingHead text-center mb-8">
              <h2 class="hhHeading fw-normal mb-0">Only best brands</h2>
            </header>
          </div>
        </div>
        <div class="logosSlider">
          <div v-for="n in 12" :key="n" class="logoWrap d-flex align-items-center justify-content-center">
            <span class="w-100">
              <img src="https://placehold.co/115x40" class="img-fluid" alt="brand logo">
            </span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Newsletter Signup -->
    <aside class="signupAsideBlock overflow-hidden w-100 position-relative">
      <div class="newsCol">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h3 class="sabHeading fw-normal mb-6">End of Summer! <br>Up to 40% off on all items.</h3>
              <form action="#" class="subscribeForm mb-3" @submit.prevent="onNewsletterSubmit">
                <div v-if="newsletterMessage" class="alert" :class="newsletterMessageType" role="alert">
                  <small>{{ newsletterMessage }}</small>
                </div>
                <div class="d-flex flex-column flex-sm-row gap-2">
                  <input v-model="newsletterEmail" type="email" class="form-control border-0 bg-light" placeholder="Email address" required>
                  <button type="submit" class="btn btnTheme text-uppercase fw-medium" :disabled="newsletterSubmitting">
                    <span v-if="newsletterSubmitting"><span class="spinner-border spinner-border-sm me-1" role="status"></span>Subscribing...</span>
                    <span v-else>SUBSCRIBE</span>
                  </button>
                </div>
              </form>
              <p class="d-block">Sign up to our Newsletter and get the discount code!</p>
            </div>
          </div>
        </div>
        <span class="position-absolute w-100 h-100 bgCover ibBgImage" style="background-image: url('https://placehold.co/1920x420');"></span>
      </div>
    </aside>

    <!-- Blog / Journal Section -->
    <section class="blogsBlock position-relative w-100 overflow-hidden py-6 py-lg-9 py-xl-17">
      <div class="container">
        <header class="headingHead text-center mb-8">
          <h2 class="hhHeading fw-normal">Read Journal</h2>
          <p>Latest trends and inspirations in fashion design.</p>
        </header>
        <div class="row row-gap-6">
          <div class="col-12 col-md-6 col-lg-4" v-for="post in blogPosts" :key="post.id">
            <router-link :to="`/blog/${post.slug}`" class="blogColumn overflow-hidden d-block text-decoration-none">
              <div class="imgHolder mb-5 position-relative">
                <img :src="post.coverImageUrl || 'https://placehold.co/435x285'" class="img-fluid w-100" :alt="post.title">
                <strong class="position-absolute fw-medium text-uppercase blgTag py-1 px-2">{{ post.tags && post.tags.length ? post.tags[0] : 'Journal' }}</strong>
              </div>
              <div class="blgTitle mb-2">
                <strong class="blgAuthor fw-normal">{{ post.author?.username || post.author?.fullName || 'Author' }}</strong>
                <span class="fw-normal"> — </span>
                <time class="fw-normal" :datetime="post.publishDate || post.createdAt">{{ formatDate(post.publishDate || post.createdAt) }}</time>
              </div>
              <h3 class="fw-medium blgHeading mb-4">{{ post.title }}</h3>
              <span class="btnLink">Continue Reading</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Instagram Feed Section -->
    <aside class="feedAsideBlock position-relative bgclr w-100 overflow-hidden py-6 py-lg-9 py-xl-15">
      <div class="container">
        <header class="headingHead text-center mb-8">
          <h2 class="hhHeading fw-normal">Follow Us on Instagram</h2>
          <p>{{ siteSettings.instagramLink || '@jeweltaime' }}</p>
        </header>
        <div class="row row-gap-4">
          <div class="col-6 col-sm-4 col-lg-2" v-for="n in 6" :key="n">
            <a :href="siteSettings.instagramLink || 'javascript:void(0);'" class="figColumn d-block text-decoration-none overflow-hidden" target="_blank" rel="noopener">
              <img src="https://placehold.co/210x210" class="img-fluid object-fit-cover w-100 h-100" alt="Instagram post">
            </a>
          </div>
        </div>
      </div>
    </aside>

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
import { useSiteSettingsStore } from '../stores/siteSettingsStore'
import { subscribeToNewsletter, buildSubscribePayload } from '../services/newsletterService'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const categoryStore = useCategoryStore()
const siteSettings = useSiteSettingsStore()

const activeFilter = ref('newArrivals')
const banners = ref([])
const popularCategories = ref([])
const featuredProducts = ref([])
const allLoadedProducts = ref([])
const blogPosts = ref([])

// Category-specific product sections
const necklacesProducts = ref([])
const charmsProducts = ref([])
const braceletsRingsProducts = ref([])

// Newsletter
const newsletterEmail = ref('')
const newsletterSubmitting = ref(false)
const newsletterMessage = ref('')
const newsletterMessageType = ref('')

function setFilter(filter) {
  activeFilter.value = filter
  if (allLoadedProducts.value.length > 0) {
    if (filter === 'newArrivals') {
      featuredProducts.value = allLoadedProducts.value.slice(0, 4)
    } else if (filter === 'mostPopular') {
      featuredProducts.value = [...allLoadedProducts.value].sort((a, b) => (b.basePriceUsd || 0) - (a.basePriceUsd || 0)).slice(0, 4)
    } else if (filter === 'bestSeller') {
      featuredProducts.value = [...allLoadedProducts.value].sort((a, b) => (a.name || '').localeCompare(b.name || '')).slice(0, 4)
    }
  }
}

function formatProduct(product) {
  const mediaList = product.media || []
  const firstImage = mediaList.length > 0 ? mediaList[0].url || mediaList[0].imageUrl || '' : ''
  const thumbnail = product.thumbnailUrl || firstImage || ''
  return {
    id: product.id,
    name: product.name,
    slug: product.sku || String(product.id),
    category: product.categoryName || 'Jewelry',
    price: product.basePriceUsd || 0,
    thumbnail: thumbnail,
    image: thumbnail || 'https://placehold.co/305x305',
    sku: product.sku
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
}

async function fetchProductsByCategory(categoryId, limit = 4) {
  try {
    const res = await axios.get(`${API_BASE}/api/v1/products/category/${categoryId}`, {
      params: { page: 1, size: limit }
    })
    const data = res.data
    const products = data.content || (Array.isArray(data) ? data : [])
    return products.map(formatProduct)
  } catch {
    return []
  }
}

async function onNewsletterSubmit() {
  const email = newsletterEmail.value.trim()
  if (!email) return

  newsletterMessage.value = ''
  newsletterSubmitting.value = true

  try {
    const payload = buildSubscribePayload({ email, name: '' })
    await subscribeToNewsletter(payload)
    newsletterMessage.value = 'Thank you for subscribing to our newsletter!'
    newsletterMessageType.value = 'alert-success'
    newsletterEmail.value = ''
  } catch (error) {
    const backendMsg = error?.response?.data?.message || error?.response?.data?.error
    if (backendMsg && backendMsg.toLowerCase().includes('already')) {
      newsletterMessage.value = 'This email is already subscribed to our newsletter.'
      newsletterMessageType.value = 'alert-info'
    } else {
      newsletterMessage.value = 'Subscription failed. Please try again later.'
      newsletterMessageType.value = 'alert-danger'
    }
  } finally {
    newsletterSubmitting.value = false
  }
}

onMounted(async () => {
  // Load site settings for Instagram link
  siteSettings.loadSettings()

  // Fetch active banners from ERP
  try {
    const res = await axios.get(`${API_BASE}/api/v1/banners/active`)
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      banners.value = res.data
    }
  } catch (e) {
    banners.value = []
  }

  // Fetch categories from categoryStore
  await categoryStore.loadCategories()
  const rootCats = categoryStore.getRootCategories
  if (rootCats.length > 0) {
    popularCategories.value = rootCats.slice(0, 6).map(c => ({
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
      allLoadedProducts.value = products.map(formatProduct)
      featuredProducts.value = allLoadedProducts.value.slice(0, 4)
    }
  } catch (e) {
    featuredProducts.value = []
  }

  // Fetch category-specific products by looking up category IDs from store
  const necklacesCat = categoryStore.getCategoryBySlug('necklaces')
  if (necklacesCat) {
    necklacesProducts.value = await fetchProductsByCategory(necklacesCat.id, 4)
  }

  const charmsCat = categoryStore.getCategoryBySlug('charms-dangles')
  if (charmsCat) {
    charmsProducts.value = await fetchProductsByCategory(charmsCat.id, 3)
  }

  // For bracelets & rings, fetch from both categories
  const braceletsCat = categoryStore.getCategoryBySlug('bracelets')
  const ringsCat = categoryStore.getCategoryBySlug('rings')
  const br1 = braceletsCat ? await fetchProductsByCategory(braceletsCat.id, 2) : []
  const br2 = ringsCat ? await fetchProductsByCategory(ringsCat.id, 2) : []
  braceletsRingsProducts.value = [...br1, ...br2].slice(0, 3)

  // Fetch blog posts
  try {
    const res = await axios.get(`${API_BASE}/api/v1/blogs/published`, {
      params: { page: 0, size: 3 }
    })
    if (res.data) {
      const data = res.data
      blogPosts.value = data.content || (Array.isArray(data) ? data : [])
    }
  } catch (e) {
    blogPosts.value = []
  }
})
</script>