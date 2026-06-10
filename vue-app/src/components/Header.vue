<template>
  <header id="pageHeader">
      <div class="phTopBar py-2 bg-dark">
          <div class="container">
              <div class="row">
                  <div class="col-12 col-lg-6">
                      <ul class="list-unstyled d-flex flex-wrap gap-3 gap-xlwd-5 justify-content-center justify-content-lg-start mb-0 phtbListInline">
                          <li class="fw-normal text-white">
                              Need help? Call us: <a href="javascript:void(0);">(+800) 1234 5678</a>
                          </li>
                      </ul>
                  </div>
                  <div class="col-6 d-none d-lg-block">
                      <ul class="list-unstyled d-flex flex-wrap gap-4 gap-xlwd-6 gap-xxl-8 mb-0 phtbListInline justify-content-end fw-normal">
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
                              <img src="/images/logo.png" class="img-fluid" alt="JewelT'Aime">
                          </router-link>
                      </div>
                  </div>
                  <div class="col-3 col-md-3 col-lg-5 col-xl-4 col-xlwd-3">
                      <ul class="list-unstyled d-flex flex-wrap justify-content-end mb-0 phActionsList gap-2 gap-md-4 gap-lg-6 pt-1">
                          <li class="d-none d-sm-block">
                              <a href="javascript:void(0);" class="d-flex align-items-center">
                                  <i class="icomoon-heart-o mbr"></i>
                                  <span class="txt d-none d-lg-block">wishlist</span>
                              </a>
                          </li>
                          <li>
                              <a href="javascript:void(0);" class="d-flex align-items-center">
                                  <i class="icomoon-user mbr"></i>
                                  <span class="txt d-none d-lg-block">Sign in</span>
                              </a>
                          </li>
                          <li data-bs-toggle="offcanvas" data-bs-target="#filtersProduct" aria-controls="filtersProduct">
                              <a href="javascript:void(0);" class="d-flex align-items-center">
                                  <i class="icomoon-cart mbr"></i>
                                  <span class="txt mbr d-none d-lg-block">cart</span>
                                  <strong class="phCartBubble phCBII fw-light d-none d-lg-inline-block text-center rounded-circle">{{ cartStore?.totalItems || 0 }}</strong>
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
                      <div class="col-12 mnCol d-none d-md-block">
                          <div class="collapse navbar-collapse mainNavigationCollapse" id="mainNavigationCollapse">
                              <ul class="navbar-nav mx-auto gap-md-4 gap-xxl-7">
                                  <li class="nav-item staf dropdown">
                                      <router-link class="nav-link text-uppercase fw-medium" active-class="active" to="/">Home</router-link>
                                  </li>
                                  <li class="nav-item staf dropdown">
                                      <router-link class="nav-link text-uppercase fw-medium" to="/about">About</router-link>
                                  </li>
                                  <li class="nav-item staf dropdown">
                                      <router-link class="nav-link text-uppercase fw-medium" to="/products">Shop</router-link>
                                      <ul class="dropdown-menu show rounded-0 pt-7 pb-5 px-5 ms-n6 mt-4" aria-labelledby="homeDropdown">
                                          <li class="mb-3"><router-link class="dropdown-item p-0" to="/products">Shop Right Sidebar</router-link></li>
                                          <li class="mb-3"><router-link class="dropdown-item p-0" to="/products">Shop Details</router-link></li>
                                      </ul>
                                  </li>
                                  <li class="nav-item staf dropdown">
                                      <a class="nav-link text-uppercase fw-medium" href="javascript:void(0);">Pages</a>
                                      <ul class="dropdown-menu show rounded-0 pt-7 pb-5 px-5 ms-n6 mt-4" aria-labelledby="homeDropdown">
                                          <li class="mb-3"><router-link class="dropdown-item p-0" to="/cart">Cart Page</router-link></li>
                                          <li class="mb-3"><router-link class="dropdown-item p-0" to="/checkout">Checkout Page</router-link></li>
                                      </ul>
                                  </li>
                                  <li class="nav-item staf dropdown">
                                      <router-link class="nav-link text-uppercase fw-medium" to="/blog">Blog</router-link>
                                  </li>
                                  <li class="nav-item">
                                      <a class="nav-link text-uppercase fw-medium" href="javascript:void(0);">Contact Us</a>
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

  <!-- cart Menu Wrapper -->
  <div class="cartsection offcanvas offcanvas-end d-flex flex-column border-0" tabindex="-1" id="filtersProduct" aria-labelledby="filtersProductLabel">
      <div class="offcanvas-header px-3 py-3 px-sm-8 py-sm-3">
          <h6 class="cartHD mb-1 fw-normal">Your Cart ({{ cartStore?.totalItems || 0 }})</h6>
          <a class="btn-close fw-light text-decoration-none" data-bs-dismiss="offcanvas" aria-label="Close">Close</a>
      </div>
      <div class="offcanvas-body flex-grow-1 d-flex flex-column justify-content-between px-3 py-5 px-sm-8 py-sm-8">
          <div>
              <div v-for="item in cartStore?.items" :key="item.id" class="d-flex align-items-start justify-content-between mb-4">
                  <div class="imgholder me-2">
                      <img :src="item.image" :alt="item.name" class="w-100 img-fluid">
                  </div>
                  <div class="flex-grow-1">
                      <h4 class="cartHding fw-light mb-1">{{ item.name }}</h4>
                      <small class="subheading fw-normal">{{ item.quantity }} × <strong class="fw-normal">£{{ item.price.toFixed(2) }}</strong></small>
                  </div>
                  <button @click="cartStore.removeFromCart(item.id)" class="btn btn-sm p-0 ms-2 btnclose border-0 bg-transparent">&times;</button>
              </div>
              <p v-if="!cartStore?.items?.length" class="text-center text-muted">Your cart is empty.</p>
          </div>
          <div v-if="cartStore?.items?.length">
              <div class="d-flex justify-content-between fw-semibold mb-3">
                  <span class="HDtotal fw-normal">Total</span>
                  <span class="HDprice fw-medium">£{{ cartStore?.totalPrice.toFixed(2) || 0 }}</span>
              </div>
              <div class="d-grid gap-2 mb-4">
                  <router-link to="/cart" class="btn btns btn-outline-dark fw-medium" data-bs-dismiss="offcanvas">View Cart</router-link>
                  <router-link to="/checkout" class="btn btns btn-dark fw-medium" data-bs-dismiss="offcanvas">Checkout</router-link>
              </div>

              <!-- Free Shipping Message -->
              <p class="spTxt fw-light text-center mb-0">Free Shipping on All <a href="javascript:void(0);" class="fw-normal">Orders Over $75</a></p>
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
                          <router-link to="/" class="text-decoration-none fw-medium d-block" data-bs-dismiss="offcanvas">Home</router-link>
                      </li>
                      <li class="py-2 px-4">
                          <router-link to="/about" class="text-decoration-none fw-medium d-block" data-bs-dismiss="offcanvas">About</router-link>
                      </li>
                      <li class="py-2 px-4">
                          <router-link to="/products" class="text-decoration-none fw-medium d-block" data-bs-dismiss="offcanvas">Shop</router-link>
                      </li>
                      <li class="py-2 px-4">
                          <router-link to="/blog" class="text-decoration-none fw-medium d-block" data-bs-dismiss="offcanvas">Blog</router-link>
                      </li>
                  </ul>
              </div>
              <div class="tab-pane fade" id="categories" role="tabpanel" aria-labelledby="categories-tab">
                  <ul class="list-unstyled catemenu fw-normal">
                      <li class="py-2 px-4"><router-link to="/category/necklaces" class="text-decoration-none d-block" data-bs-dismiss="offcanvas">Necklaces</router-link></li>
                      <li class="py-2 px-4"><router-link to="/category/rings" class="text-decoration-none d-block" data-bs-dismiss="offcanvas">Rings</router-link></li>
                      <li class="py-2 px-4"><router-link to="/category/bracelets" class="text-decoration-none d-block" data-bs-dismiss="offcanvas">Bracelets</router-link></li>
                      <li class="py-2 px-4"><router-link to="/category/earrings" class="text-decoration-none d-block" data-bs-dismiss="offcanvas">Earings</router-link></li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()
</script>
