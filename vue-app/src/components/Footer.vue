<template>
  <footer class="siteFooter w-100 pt-6 pt-md-10 pb-2 pb-md-3 border-top">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-3 mb-6 mb-lg-0">
          <div class="footerLogo mb-3">
            <router-link to="/">
              <img :src="siteSettings.logo || '/images/logo.png'" class="img-fluid" alt="JewelT'Aime" style="max-width: 130px;">
            </router-link>
          </div>
          <p class="footerTagline fw-light mb-3">
            <em>"Where Elegance Meets You"</em>
          </p>
          <p class="fw-light mb-4">
            {{ siteSettings.shortDescription || 'Discover exquisite jewellery crafted with passion and precision. Each piece tells a story of elegance and timeless beauty.' }}
          </p>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-6 mb-lg-0">
          <h4 class="footerHeading fw-normal mb-4">Quick Links</h4>
          <ul class="list-unstyled footerNav">
            <li><router-link to="/products">Shop All</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
            <li><router-link to="/contact">Contact Us</router-link></li>
          </ul>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-6 mb-lg-0">
          <h4 class="footerHeading fw-normal mb-4">Help</h4>
          <ul class="list-unstyled footerNav">
            <li><router-link to="/cart">Shopping Cart</router-link></li>
            <li><router-link to="/checkout">Checkout</router-link></li>
            <li><router-link to="/signin">Sign In</router-link></li>
            <li><router-link to="/dashboard">My Account</router-link></li>
          </ul>
        </div>
        <div class="col-12 col-md-6 col-lg-3">
          <h4 class="footerHeading fw-normal mb-4">Policies</h4>
          <ul class="list-unstyled footerNav">
            <li><router-link to="/policies/terms-and-conditions">Terms & Conditions</router-link></li>
            <li><router-link to="/policies/privacy-policy">Privacy Policy</router-link></li>
            <li><router-link to="/policies/shipping-policy">Shipping Policy</router-link></li>
            <li><router-link to="/policies/refund-and-return-policy">Refund & Return Policy</router-link></li>
            <li><router-link to="/policies/cookie-policy">Cookie Policy</router-link></li>
            <li><router-link to="/policies/accessibility-policy">Accessibility Policy</router-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footerBottom border-top mt-6 pt-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p class="mb-0 fw-light text-muted">
              &copy; {{ currentYear }} JewelT'Aime. All rights reserved.
            </p>
          </div>
          <div class="col-12 col-md-6 text-center text-md-end">
            <ul class="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-end gap-3 mb-0">
              <li v-if="siteSettings.facebookLink">
                <a :href="siteSettings.facebookLink" target="_blank" rel="noopener">
                  <i class="icomoon-facebook facebookIcn"></i>
                </a>
              </li>
              <li v-if="siteSettings.twitterLink">
                <a :href="siteSettings.twitterLink" target="_blank" rel="noopener">
                  <i class="icomoon-twitter twitterIcn"></i>
                </a>
              </li>
              <li v-if="siteSettings.instagramLink">
                <a :href="siteSettings.instagramLink" target="_blank" rel="noopener">
                  <i class="icomoon-instagram instagramIcn"></i>
                </a>
              </li>
              <li v-if="siteSettings.pinterestLink">
                <a :href="siteSettings.pinterestLink" target="_blank" rel="noopener">
                  <i class="icomoon-pinterest pinterestIcn"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useSiteSettingsStore } from '../stores/siteSettingsStore'

const siteSettings = useSiteSettingsStore()
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footerHeading {
  font-size: 1.125rem;
  line-height: 1.5;
  color: #000;
}
.footerNav li {
  margin-bottom: 0.5rem;
}
.footerNav a {
  font-weight: 300;
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}
.footerNav a:hover {
  color: #000;
}
.footerBottom p,
.footerBottom a {
  font-size: 0.875rem;
  color: #999;
  transition: color 0.2s ease;
}
.footerBottom a:hover {
  color: #000;
}
.footerTagline {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
}
</style>