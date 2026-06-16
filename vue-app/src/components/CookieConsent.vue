<template>
  <div v-if="!consented" class="cookieConsentWrapper">
    <div class="cookieConsentContainer">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-8">
            <div class="d-flex align-items-start gap-3">
              <i class="fa-solid fa-cookie-bite cookieIcon"></i>
              <div>
                <h5 class="cookieTitle mb-2">We Value Your Privacy</h5>
                <p class="cookieText mb-0">
                  We use cookies and similar technologies to enhance your browsing experience, analyse site traffic, and personalise content and product recommendations. By clicking <strong>"Accept All"</strong>, you consent to our use of cookies. You can manage your preferences or reject non-essential cookies by clicking <strong>"Reject Non-Essential"</strong>. For more details, please review our
                  <router-link to="/policies/cookie-policy" class="cookieLink">Cookie Policy</router-link>.
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="d-flex flex-wrap gap-2 justify-content-lg-end mt-3 mt-lg-0">
              <button class="btn btnAcceptAll py-2 px-4" @click="acceptAll">Accept All</button>
              <button class="btn btnRejectNon py-2 px-4" @click="rejectNonEssential">Reject Non-Essential</button>
              <button class="btn btnManageCookies py-2 px-4" @click="showPreferences = !showPreferences">Manage</button>
            </div>
          </div>
        </div>

        <!-- Preferences Panel -->
        <div v-if="showPreferences" class="cookiePreferences mt-4 pt-4 border-top">
          <h6 class="mb-3 fw-medium">Cookie Preferences — Manage Globally Used Cookies</h6>
          <div class="row">
            <div class="col-12 mb-3">
              <div class="cookieCategoryCard essential">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1 me-3">
                    <strong class="d-block cookieCategoryTitle">🔒 Essential Cookies (Always Active)</strong>
                    <p class="cookieCategoryDesc mb-0">
                      These cookies are necessary for the website to function and cannot be switched off.
                      They enable core functionality such as security, network management, shopping cart contents,
                      and account authentication. Without these cookies, services such as adding items to your cart
                      and processing checkout cannot function properly.
                    </p>
                    <div class="cookieList mt-2">
                      <span class="cookieBadge">jwt_token</span>
                      <span class="cookieBadge">cart_items</span>
                      <span class="cookieBadge">XSRF-TOKEN</span>
                      <span class="cookieBadge">session_id</span>
                    </div>
                  </div>
                  <input type="checkbox" class="form-check-input flex-shrink-0 mt-1" checked disabled>
                </div>
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="cookieCategoryCard analytics">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1 me-3">
                    <strong class="d-block cookieCategoryTitle">📊 Analytics Cookies</strong>
                    <p class="cookieCategoryDesc mb-0">
                      These cookies allow us to count visits and traffic sources so we can measure and improve
                      the performance of our site. They help us understand which pages are most and least popular
                      and see how visitors move around the site. All information these cookies collect is aggregated
                      and therefore anonymous. We use this data to optimise your shopping experience and improve
                      our product offerings.
                    </p>
                    <div class="cookieList mt-2">
                      <span class="cookieBadge">_ga (Google Analytics)</span>
                      <span class="cookieBadge">_gid (Google Analytics)</span>
                      <span class="cookieBadge">_gat (Google Analytics)</span>
                      <span class="cookieBadge">_ga_{CONTAINER_ID}</span>
                    </div>
                  </div>
                  <input type="checkbox" class="form-check-input flex-shrink-0 mt-1" v-model="preferences.analytics">
                </div>
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="cookieCategoryCard marketing">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1 me-3">
                    <strong class="d-block cookieCategoryTitle">🎯 Marketing & Personalisation Cookies</strong>
                    <p class="cookieCategoryDesc mb-0">
                      These cookies may be set through our site by our advertising partners to build a profile
                      of your interests and show you relevant product recommendations based on your browsing
                      behaviour — including items you've viewed, added to your wishlist, or purchased previously.
                      They use cross-site tracking to help us suggest jewellery you're most likely to love.
                      If you do not allow these cookies, you will experience less personalised product
                      recommendations and advertising.
                    </p>
                    <div class="cookieList mt-2">
                      <span class="cookieBadge">_fbp (Facebook Pixel)</span>
                      <span class="cookieBadge">_pin (Pinterest)</span>
                      <span class="cookieBadge">ads_prefs</span>
                      <span class="cookieBadge">recently_viewed</span>
                      <span class="cookieBadge">recommended_products</span>
                      <span class="cookieBadge">cross_site_id</span>
                    </div>
                  </div>
                  <input type="checkbox" class="form-check-input flex-shrink-0 mt-1" v-model="preferences.marketing">
                </div>
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="cookieCategoryCard functional">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1 me-3">
                    <strong class="d-block cookieCategoryTitle">⚙️ Functional / Preference Cookies</strong>
                    <p class="cookieCategoryDesc mb-0">
                      These cookies enable the website to provide enhanced functionality and personalisation.
                      They may be set by us or by third-party providers whose services we have added to our pages
                      (such as Airwallex for payment processing). If you do not allow these cookies,
                      some or all of these services may not function properly — including currency preferences,
                      saved address details for checkout, and wishlist persistence.
                    </p>
                    <div class="cookieList mt-2">
                      <span class="cookieBadge">currency_pref</span>
                      <span class="cookieBadge">saved_address</span>
                      <span class="cookieBadge">wishlist_items</span>
                      <span class="cookieBadge">airwallex_session</span>
                      <span class="cookieBadge">cookie_consent</span>
                    </div>
                  </div>
                  <input type="checkbox" class="form-check-input flex-shrink-0 mt-1" v-model="preferences.functional">
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 d-flex gap-3 flex-wrap">
            <button class="btn btnAcceptAll py-2 px-4" @click="savePreferences">Save Preferences</button>
            <button class="btn btnRejectNon py-2 px-4" @click="showPreferences = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const consented = ref(false)
const showPreferences = ref(false)
const preferences = ref({
  essential: true,
  analytics: false,
  marketing: false,
  functional: true
})

onMounted(() => {
  const stored = localStorage.getItem('cookieConsent')
  if (stored) {
    consented.value = true
  }
})

const savePreferences = () => {
  localStorage.setItem('cookieConsent', JSON.stringify(preferences.value))
  consented.value = true
}

const acceptAll = () => {
  preferences.value = { essential: true, analytics: true, marketing: true, functional: true }
  savePreferences()
}

const rejectNonEssential = () => {
  preferences.value = { essential: true, analytics: false, marketing: false, functional: true }
  savePreferences()
}
</script>

<style scoped>
.cookieConsentWrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #1a1a1a;
  color: #fff;
  padding: 20px 0;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}
.cookieIcon {
  font-size: 2rem;
  color: #d4a76a;
  flex-shrink: 0;
  margin-top: 2px;
}
.cookieTitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
}
.cookieText {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #ccc;
}
.cookieLink {
  color: #d4a76a;
  text-decoration: underline;
}
.cookieLink:hover {
  color: #c49858;
}
.btnAcceptAll {
  background-color: #d4a76a;
  color: #fff;
  border: none;
  font-weight: 500;
  font-size: 0.85rem;
}
.btnAcceptAll:hover {
  background-color: #c49858;
  color: #fff;
}
.btnRejectNon {
  background-color: transparent;
  color: #fff;
  border: 1px solid #666;
  font-weight: 500;
  font-size: 0.85rem;
}
.btnRejectNon:hover {
  border-color: #999;
  color: #fff;
}
.btnManageCookies {
  background-color: transparent;
  color: #d4a76a;
  border: 1px solid #d4a76a;
  font-weight: 500;
  font-size: 0.85rem;
}
.btnManageCookies:hover {
  background-color: #d4a76a;
  color: #fff;
}
.cookiePreferences {
  border-color: #333 !important;
}
.cookieCategoryCard {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px 16px;
  transition: background 0.2s ease;
}
.cookieCategoryCard:hover {
  background: rgba(255, 255, 255, 0.08);
}
.cookieCategoryCard.essential {
  border-left: 3px solid #4caf50;
}
.cookieCategoryCard.analytics {
  border-left: 3px solid #2196f3;
}
.cookieCategoryCard.marketing {
  border-left: 3px solid #ff9800;
}
.cookieCategoryCard.functional {
  border-left: 3px solid #9c27b0;
}
.cookieCategoryTitle {
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 6px;
}
.cookieCategoryDesc {
  font-size: 0.8rem;
  line-height: 1.6;
  color: #aaa;
}
.cookieList {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cookieBadge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  font-size: 0.7rem;
  font-family: 'Courier New', Courier, monospace;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.form-check-input:checked {
  background-color: #d4a76a;
  border-color: #d4a76a;
}
</style>