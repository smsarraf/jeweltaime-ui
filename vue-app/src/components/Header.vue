<template>
    <header id="pageHeader">
        <div class="phTopBar py-2 bg-dark">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-lg-6">
                        <ul class="list-unstyled d-flex flex-wrap gap-3 gap-xlwd-5 justify-content-center justify-content-lg-start mb-0 phtbListInline">
                            <li class="fw-normal text-white">
                                Need help? Call us: <a :href="`tel:${siteSettings.contactInfo ? siteSettings.contactInfo.replace(/[^0-9]/g, '') : '180055553935'}`">{{ siteSettings.contactInfo || '(+800) 1234 5678' }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 d-none d-lg-block">
                        <ul class="list-unstyled d-flex flex-wrap gap-4 gap-xlwd-6 gap-xxl-8 mb-0 phtbListInline justify-content-end fw-normal">
                            <li v-if="!isLoggedIn">
                                <router-link to="/signin?redirect=/b2b/products" class="text-decoration-none fw-medium bulk-order-blink">
                                    <i class="fa-solid fa-truck me-1"></i>Bulk Order / B2B
                                </router-link>
                            </li>
                            <li>
                                <a href="javascript:void(0);">Special Offer</a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">Services</a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">Subscribe</a>
                            </li>
                            <li>
                                <a href="javascript:void(0);">Gift Cards</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="phWrapper pt-2 pt-md-5 pt-xlwd-7 pb-2 pb-md-6">
            <div class="container">
                <div class="row">
                    <div class="col-3 col-md-4 col-lg-4 col-xl-3 col-xlwd-3 position-relative">
                        <ul class="list-unstyled d-flex flex-wrap justify-content-start mb-0 phActionsList gap-sm-4 gap-lg-6 pt-sm-1">
                            <li class="navbar navbar-expand-md p-0 position-static d-md-none">
                                <button class="navbar-toggler border-0 p-0 mainNavigationToggle position-absolute" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                            </li>
                            <li class="d-none d-md-block">
                                <a href="javascript:void(0);" class="d-flex align-items-center">
                                    <i class="fa-solid fa-location-dot mbr"></i>
                                    <span class="txt">Store Locator</span>
                                </a>
                            </li>
                            <li class="d-none d-md-block" data-bs-toggle="offcanvas" data-bs-target="#searchCol" aria-controls="searchCol">
                                <a href="javascript:void(0);" class="d-flex align-items-center">
                                    <i class="icomoon-search mbr"></i>
                                    <span class="txt">Search</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-6 col-md-5 col-lg-3 col-xl-5 col-xlwd-6">
                        <div class="logo text-center mx-auto">
                            <router-link to="/">
                                <img :src="siteSettings.logo || '/images/logo.png'" class="img-fluid" alt="JewelT'Aime">
                            </router-link>
                        </div>
                    </div>
                    <div class="col-3 col-md-3 col-lg-5 col-xl-4 col-xlwd-3">
                        <ul class="list-unstyled d-flex flex-wrap justify-content-end mb-0 phActionsList gap-2 gap-md-4 gap-lg-6 pt-1">
                            <li class="d-none d-sm-block">
                                <router-link to="/wishlist" class="d-flex align-items-center position-relative">
                                    <i class="icomoon-heart-o mbr"></i>
                                    <span class="txt d-none d-lg-block">wishlist</span>
                                    <strong class="phCartBubble phCBII fw-light d-none d-lg-inline-block text-center rounded-circle" v-if="wishlistStore.totalItems > 0">{{ wishlistStore.totalItems }}</strong>
                                </router-link>
                            </li>
                            <li v-if="!isLoggedIn">
                                <router-link to="/signin" class="d-flex align-items-center">
                                    <i class="icomoon-user mbr"></i>
                                    <span class="txt d-none d-lg-block">Sign in</span>
                                </router-link>
                            </li>
                            <li v-else class="dropdown">
                                <a href="javascript:void(0);" class="d-flex align-items-center dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="icomoon-user mbr"></i>
                                    <span class="txt d-none d-lg-block">{{ userName }}</span>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end rounded-0 mt-3 p-0 border">
                                    <li><router-link class="dropdown-item py-3 px-4 fw-light" to="/dashboard"><i class="fa-solid fa-gauge-high me-2"></i>Dashboard</router-link></li>
                                    <li v-if="isB2BUser"><router-link class="dropdown-item py-3 px-4 fw-light" to="/b2b/products"><i class="fa-solid fa-store me-2"></i>B2B Catalog</router-link></li>
                                    <li v-if="isB2BUser"><router-link class="dropdown-item py-3 px-4 fw-light" to="/b2b/quotes"><i class="fa-solid fa-file-invoice me-2"></i>My Quotes</router-link></li>
                                    <li v-if="isB2BUser"><router-link class="dropdown-item py-3 px-4 fw-light" to="/b2b/quote-cart"><i class="fa-solid fa-cart-plus me-2"></i>Quote Cart</router-link></li>
                                    <li v-if="!isB2BUser"><router-link class="dropdown-item py-3 px-4 fw-light" to="/orders"><i class="fa-solid fa-box me-2"></i>My Orders</router-link></li>
                                    <li v-if="!isB2BUser"><router-link class="dropdown-item py-3 px-4 fw-light" to="/invoices"><i class="fa-regular fa-file-lines me-2"></i>My Invoices</router-link></li>
                                    <li><router-link class="dropdown-item py-3 px-4 fw-light" to="/profile"><i class="fa-solid fa-user me-2"></i>My Profile</router-link></li>
                                    <li><router-link class="dropdown-item py-3 px-4 fw-light" to="/wishlist"><i class="fa-regular fa-heart me-2"></i>Wishlist</router-link></li>
                                    <li><hr class="dropdown-divider my-0"></li>
                                    <li><a href="javascript:void(0);" class="dropdown-item py-3 px-4 fw-light" @click="handleLogout"><i class="fa-solid fa-sign-out-alt me-2"></i>Sign Out</a></li>
                                </ul>
                            </li>
                            <li data-bs-toggle="offcanvas" data-bs-target="#filtersProduct" aria-controls="filtersProduct">
                                <a href="javascript:void(0);" class="d-flex align-items-center">
                                    <i class="icomoon-cart mbr"></i>
                                    <span class="txt mbr d-none d-lg-block">cart</span>
                                    <strong class="phCartBubble phCBII fw-light d-none d-lg-inline-block text-center rounded-circle">{{ cartStore.totalItems }}</strong>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="phNavWrapper position-relative">
            <div class="container">
                <nav class="navbar navbar-expand-md d-block position-static" id="mainNavigation">
                    <div class="row align-items-center">
                        <div class="col-3 d-none d-xl-block">
                            <div class="dropdown phBtnDropdown">
                                <button class="btnReset text-uppercase fw-medium p-0 border-0 rounded-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Browse Categories</button>
                                <ul class="dropdown-menu catemenu mt-4 p-0 pt-1 rounded-0 border-0">
                                    <li v-for="cat in parentCategories" :key="cat.id">
                                        <router-link class="text-decoration-none fw-light" :to="`/category/${cat.slug}`">{{ cat.name }}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-12 col-lg-8 col-xl-6 mnCol d-none d-md-block">
                            <div class="collapse navbar-collapse mainNavigationCollapse" id="mainNavigationCollapse">
                                <ul class="navbar-nav mx-auto gap-md-4 gap-xxl-7">
                                    <li class="nav-item staf dropdown">
                                        <router-link class="nav-link text-uppercase fw-medium" active-class="active" to="/">Home</router-link>
                                    </li>
                                    <li class="nav-item staf dropdown">
                                        <router-link class="nav-link text-uppercase fw-medium" to="/products">Shop</router-link>
                                        <div class="dropdown-menu show mega-menu rounded-0 pt-7 pb-7 px-6 ms-n6 mt-4 border-0">
                                            <div class="row g-0">
                                                <div v-for="cat in allCategories" :key="cat.id" class="col-12 col-md-4 col-lg-3 mb-4 mb-lg-0">
                                                    <div class="px-2">
                                                        <h6 class="text-uppercase fw-bold mb-3">
                                                            <router-link :to="`/category/${cat.slug}`" class="text-decoration-none text-dark">{{ cat.name }}</router-link>
                                                        </h6>
                                                        <ul class="list-unstyled mb-0">
                                                            <li v-for="child in (cat.children || [])" :key="child.id" class="mb-2">
                                                                <router-link :to="`/category/${child.slug}`" class="text-decoration-none fw-normal text-muted small">{{ child.name }}</router-link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="nav-item staf dropdown">
                                        <router-link class="nav-link text-uppercase fw-medium" to="/about">About</router-link>
                                    </li>
                                    <!--                  <li class="nav-item staf dropdown">-->
                                    <!--                    <a class="nav-link text-uppercase fw-medium" href="javascript:void(0);">Pages</a>-->
                                    <!--                    <ul class="dropdown-menu show rounded-0 pt-7 pb-5 px-5 ms-n6 mt-4">-->
                                    <!--                      <li class="mb-3"><router-link class="dropdown-item p-0" to="/cart">Cart Page</router-link></li>-->
                                    <!--                      <li class="mb-3"><router-link class="dropdown-item p-0" to="/checkout">Checkout Page</router-link></li>-->
                                    <!--                    </ul>-->
                                    <!--                  </li>-->
                                    <li class="nav-item staf dropdown">
                                        <router-link class="nav-link text-uppercase fw-medium" to="/blog">Blog</router-link>
                                    </li>
                                    <li class="nav-item">
                                        <router-link class="nav-link text-uppercase fw-medium" to="/contact">Contact Us</router-link>
                                    </li>
                                    <li class="nav-item" v-if="!isLoggedIn">
                                        <router-link class="nav-link text-uppercase fw-medium bulk-order-blink" to="/signin?redirect=/b2b/products">
                                            <i class="fa-solid fa-truck me-1"></i>Bulk Order
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </header>

    <!-- Search Menu Wrapper -->
    <div class="searchrow offcanvas offcanvas-top" tabindex="-1" id="searchCol" aria-labelledby="searchcol" style="height: 100vh;">
        <div class="offcanvas-header justify-content-end">
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column align-items-start justify-content-md-start px-4 pt-2">
            <h5 class="srchHD fw-light mb-3">What are you looking for?</h5>
            <form class="w-100" role="search">
                <div class="input-group">
                    <input type="search" class="form-control border-0" placeholder="Search for products" aria-label="Search">
                    <button class="btn" type="submit">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Cart Sidebar Offcanvas -->
    <div class="cartsection offcanvas offcanvas-end d-flex flex-column border-0" tabindex="-1" id="filtersProduct" aria-labelledby="filtersProductLabel">
        <div class="offcanvas-header px-3 py-3 px-sm-8 py-sm-3">
            <h6 class="cartHD mb-1 fw-normal">Your Cart ({{ cartStore.totalItems }})</h6>
            <a class="btn-close fw-light text-decoration-none" data-bs-dismiss="offcanvas" aria-label="Close">Close</a>
        </div>
        <div class="offcanvas-body flex-grow-1 d-flex flex-column justify-content-between px-3 py-5 px-sm-8 py-sm-8">
            <div>
                <div v-for="item in cartStore.items" :key="cartStore.getItemKey(item)" class="d-flex align-items-start justify-content-between mb-4">
                    <div class="imgholder me-2">
                        <ImageWithSkeleton :src="item.image" :alt="item.name" aspect-ratio="1 / 1" />
                    </div>
                    <div class="flex-grow-1">
                        <h4 class="cartHding fw-light mb-1">{{ item.name }}</h4>
                        <small class="subheading fw-normal">{{ item.quantity }} × <strong class="fw-normal">{{ currencyStore.formatPrice(item.price) }}</strong></small>
                    </div>
                    <button @click="cartStore.removeFromCart(item.id, item.variantId || null)" class="btn btn-sm p-0 ms-2 btnclose border-0 bg-transparent">&times;</button>
                </div>
                <p v-if="!cartStore.items.length" class="text-center text-muted">Your cart is empty.</p>
            </div>
            <div v-if="cartStore.items.length">
                <div class="d-flex justify-content-between fw-semibold mb-3">
                    <span class="HDtotal fw-normal">Total</span>
                    <span class="HDprice fw-medium">{{ currencyStore.formatPrice(cartStore.totalPrice) }}</span>
                </div>
                <div class="d-grid gap-2 mb-4">
                    <router-link to="/cart" class="btn btns btn-outline-dark fw-medium" @click="closeCartOffcanvas">View Cart</router-link>
                    <router-link to="/checkout" class="btn btns btn-dark fw-medium" @click="closeCartOffcanvas">Checkout</router-link>
                </div>
                <p class="spTxt fw-light text-center mb-0">{{ siteSettings.freeShippingText || 'Free Shipping on All Orders Over $75' }}</p>
            </div>
        </div>
    </div>

    <!-- Sidebar Menu Wrapper -->
    <div class="sidebarMenu offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarMenu">
        <div class="offcanvas-header justify-content-between py-3 px-4">
            <h5 class="offcanvas-title mb-0">JewelT'Aime</h5>
            <a class="btn-close fw-light text-decoration-none" data-bs-dismiss="offcanvas" aria-label="Close"></a>
        </div>
        <div class="offcanvas-body p-0">
            <ul class="nav nav-tabs mb-3 pt-4 px-4 text-uppercase" id="menuTab" role="tablist">
                <li class="nav-item me-6 mb-3">
                    <a class="text-decoration-none active" href="javascript:void(0);" id="menu-tab" data-bs-toggle="tab" data-bs-target="#menu" role="tab" aria-controls="menu" aria-selected="true">Menu</a>
                </li>
                <li class="nav-item">
                    <a class="text-decoration-none" href="javascript:void(0);" id="categories-tab" data-bs-toggle="tab" data-bs-target="#categories" role="tab" aria-controls="categories" aria-selected="false">Categories</a>
                </li>
            </ul>
            <div class="tab-content" id="menuTabContent">
                <div class="tab-pane fade show active" id="menu" role="tabpanel" aria-labelledby="menu-tab">
                    <ul class="list-unstyled mainmenu">
                        <li class="py-2 px-4">
                            <router-link to="/" class="text-decoration-none fw-medium d-block" @click="closeSidebarMenu">Home</router-link>
                        </li>
                        <li class="py-2 px-4">
                            <router-link to="/about" class="text-decoration-none fw-medium d-block" @click="closeSidebarMenu">About</router-link>
                        </li>
                        <li class="py-2 px-4">
                            <router-link to="/products" class="text-decoration-none fw-medium d-block" @click="closeSidebarMenu">Shop</router-link>
                        </li>
                        <li class="py-2 px-4">
                            <router-link to="/blog" class="text-decoration-none fw-medium d-block" @click="closeSidebarMenu">Blog</router-link>
                        </li>
                        <li class="py-2 px-4" v-if="!isLoggedIn">
                            <router-link to="/signin?redirect=/b2b/products" class="text-decoration-none fw-medium d-block bulk-order-blink" @click="closeSidebarMenu">
                                <i class="fa-solid fa-truck me-1"></i>Bulk Order
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="tab-pane fade" id="categories" role="tabpanel" aria-labelledby="categories-tab">
                    <ul class="list-unstyled catemenu fw-normal">
                        <li v-for="cat in parentCategories" :key="cat.id" class="py-2 px-4">
                            <router-link :to="`/category/${cat.slug}`" class="text-decoration-none d-block" @click="closeSidebarMenu">{{ cat.name }}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useCartStore } from '../stores/cartStore'
    import { useWishlistStore } from '../stores/wishlistStore'
    import { useCurrencyStore } from '../stores/currencyStore'
    import { useCategoryStore } from '../stores/categoryStore'
    import { useSiteSettingsStore } from '../stores/siteSettingsStore'
    import ImageWithSkeleton from './ImageWithSkeleton.vue'
    import { clearAuth } from '../utils/auth'
    import { useAuthSession } from '../composables/useAuthSession'

    const router = useRouter()
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()
    const currencyStore = useCurrencyStore()
    const categoryStore = useCategoryStore()
    const siteSettings = useSiteSettingsStore()
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    const { isLoggedIn, user: userData } = useAuthSession()

    const userName = computed(() => {
      if (userData.value) {
        return `${userData.value.firstName || ''} ${userData.value.lastName || ''}`.trim() || userData.value.email
      }
      return 'Account'
    })

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

    const handleLogout = () => {
      clearAuth()
      wishlistStore.clearWishlist()
      currencyStore.reset()
      router.push('/')
    }

    const parentCategories = computed(() => categoryStore.getRootCategories)
    const allCategories = computed(() => categoryStore.getRootCategories)

    onMounted(async () => {
      // Load categories from centralized store (15-min cache, auto-refresh)
      await categoryStore.loadCategories()
      // Fetch wishlist if user is logged in
      wishlistStore.fetchWishlist()
    })

    const closeCartOffcanvas = () => {
      const el = document.getElementById('filtersProduct')
      if (el && typeof window.bootstrap !== 'undefined') {
        const offcanvas = window.bootstrap.Offcanvas.getInstance(el)
        if (offcanvas) offcanvas.hide()
      }
    }

    const closeSidebarMenu = () => {
      const el = document.getElementById('sidebarMenu')
      if (el && typeof window.bootstrap !== 'undefined') {
        const offcanvas = window.bootstrap.Offcanvas.getInstance(el)
        if (offcanvas) offcanvas.hide()
      }
    }
</script>

<style>
    /* Bulk Order blinking silver animation */
    @keyframes bulkOrderBlink {
        0%, 100% {
            color: #c0c0c0;
            text-shadow: 0 0 4px rgba(192, 192, 192, 0.3);
        }
        50% {
            color: #e8e8e8;
            text-shadow: 0 0 12px rgba(192, 192, 192, 0.8), 0 0 24px rgba(255, 255, 255, 0.4);
        }
    }

    .bulk-order-blink {
        animation: bulkOrderBlink 1.8s ease-in-out infinite;
        color: #c0c0c0 !important;
    }

    .bulk-order-blink i {
        animation: bulkOrderBlink 1.8s ease-in-out infinite;
        color: #c0c0c0 !important;
    }

    #mainNavigation .mainNavigationCollapse .mega-menu {
      min-width: 700px !important;
      background: #fff;
      border: 1px solid #eee;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 30px 30px 30px 30px !important;
      left: 50%;
      transform: translateX(-50%) translateY(5px);
      transition: transform 0.35s ease, opacity 0.35s ease, visibility 0.35s ease;
    }
    #mainNavigation .mainNavigationCollapse .dropdown:hover .mega-menu.show {
      visibility: visible;
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    #mainNavigation .mainNavigationCollapse .mega-menu h6 {
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      margin-bottom: 12px !important;
    }
    #mainNavigation .mainNavigationCollapse .mega-menu h6 a {
      color: #000 !important;
      text-decoration: none !important;
      display: inline;
      padding: 0;
      background: none !important;
    }
    #mainNavigation .mainNavigationCollapse .mega-menu h6 a:hover {
      color: #333 !important;
      background: none !important;
      text-decoration: underline !important;
    }
    #mainNavigation .mainNavigationCollapse .mega-menu ul li a {
      display: block;
      padding: 4px 0;
      color: #666;
      font-size: 0.875rem;
      line-height: 1.5;
      text-decoration: none !important;
      transition: color 0.2s ease;
    }
    #mainNavigation .mainNavigationCollapse .mega-menu ul li a:hover {
      color: #000 !important;
      background: none !important;
    }
</style>
