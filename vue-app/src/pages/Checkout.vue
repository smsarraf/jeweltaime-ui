<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">Home</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">Checkout</li>
        </ol>
      </nav>
    </div>

    <section v-if="cartStore.items.length === 0" class="carttablewrap pt-7 pb-20">
      <div class="container text-center py-10">
        <h3 class="mb-4">Your cart is empty. Cannot proceed to checkout.</h3>
        <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Return to Shop</router-link>
      </div>
    </section>

    <section v-else class="carttablewrap py-7">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center"><h1 class="mnHding fw-normal mb-7 mb-md-10">Checkout</h1></div>
        </div>

        <div v-if="submitError" class="alert alert-danger rounded-0 mb-4">
          <i class="fa-solid fa-circle-exclamation me-2"></i>{{ submitError }}
        </div>

        <div class="row g-4">
          <div class="col-12 col-lg-8">
            <div class="border p-4 mb-4">
              <h3 class="h5 mb-3">1. Address</h3>
              <!-- Guest user fields -->
              <div v-if="!isLoggedIn" class="row g-3 mb-3">
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">Email Address *</label>
                  <input type="email" class="form-control rounded-0" v-model="guestEmail" placeholder="your@email.com">
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">Full Name *</label>
                  <input type="text" class="form-control rounded-0" v-model="guestFullName" placeholder="Your full name">
                </div>
              </div>
              <div v-if="addressesLoading" class="row g-2">
                <div v-for="i in 2" :key="`addr-skeleton-${i}`" class="col-12"><div class="placeholder-glow border p-3"><span class="placeholder col-12"></span></div></div>
              </div>
              <div v-else-if="addressesError" class="alert alert-warning rounded-0">
                {{ addressesError }} <button class="btn btn-link p-0 align-baseline" @click="loadAddresses">Retry</button>
              </div>
              <div v-else-if="savedAddresses.length > 0" class="mb-3">
                <label class="fLabel d-block mb-2">Saved addresses</label>
                <div class="d-flex flex-column gap-2">
                  <label v-for="addr in savedAddresses" :key="addr.id" class="border p-3 d-block">
                    <input class="form-check-input me-2" type="radio" name="savedAddress" :value="addr.id" v-model="selectedAddressId">
                    <strong>{{ addr.street }}</strong>, {{ addr.city }}, {{ addr.state }}, {{ addr.country }} {{ addr.zipCode }}
                  </label>
                  <label class="border p-3 d-block">
                    <input class="form-check-input me-2" type="radio" name="savedAddress" :value="null" v-model="selectedAddressId">
                    Use a different address
                  </label>
                </div>
              </div>

              <div v-if="!selectedAddressId" class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">Country *</label>
                  <select class="form-control rounded-0" v-model="manualAddress.countryId" @change="onManualCountryChange">
                    <option value="">Select Country</option>
                    <option v-for="c in locationStore.countries" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">State</label>
                  <select class="form-control rounded-0" v-model="manualAddress.stateId" @change="onManualStateChange" :disabled="!manualAddress.countryId">
                    <option value="">Select State</option>
                    <option v-for="s in locationStore.getStates(manualAddress.countryId)" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">City</label>
                  <select class="form-control rounded-0" v-model="manualAddress.cityId" :disabled="!manualAddress.stateId">
                    <option value="">Select City</option>
                    <option v-for="ct in locationStore.getCities(manualAddress.stateId)" :key="ct.id" :value="ct.id">{{ ct.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">Postcode / ZIP *</label>
                  <input type="text" class="form-control rounded-0" v-model="manualAddress.zipCode">
                </div>
                <div class="col-12">
                  <label class="fLabel d-block mb-1">Street Address *</label>
                  <input type="text" class="form-control rounded-0" v-model="manualAddress.street">
                </div>
              </div>
            </div>

            <div class="border p-4 mb-4">
              <h3 class="h5 mb-3">1b. Billing Address</h3>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="billingSameAsShipping" v-model="billingSameAsShipping">
                <label class="form-check-label" for="billingSameAsShipping">Same as shipping address</label>
              </div>
              <div v-if="!billingSameAsShipping" class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">Country *</label>
                  <select class="form-control rounded-0" v-model="billingAddress.countryId" @change="onBillingCountryChange">
                    <option value="">Select Country</option>
                    <option v-for="c in locationStore.countries" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">State</label>
                  <select class="form-control rounded-0" v-model="billingAddress.stateId" @change="onBillingStateChange" :disabled="!billingAddress.countryId">
                    <option value="">Select State</option>
                    <option v-for="s in locationStore.getStates(billingAddress.countryId)" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">City</label>
                  <select class="form-control rounded-0" v-model="billingAddress.cityId" :disabled="!billingAddress.stateId">
                    <option value="">Select City</option>
                    <option v-for="ct in locationStore.getCities(billingAddress.stateId)" :key="ct.id" :value="ct.id">{{ ct.name }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-6">
                  <label class="fLabel d-block mb-1">Postcode / ZIP *</label>
                  <input type="text" class="form-control rounded-0" v-model="billingAddress.zipCode">
                </div>
                <div class="col-12">
                  <label class="fLabel d-block mb-1">Street Address *</label>
                  <input type="text" class="form-control rounded-0" v-model="billingAddress.street">
                </div>
              </div>
            </div>

            <div class="border p-4 mb-4">
              <h3 class="h5 mb-3">2. Shipping Method</h3>
              <div v-if="shippersLoading" class="placeholder-glow"><span class="placeholder col-12"></span></div>
              <div v-else-if="shippersError" class="alert alert-warning rounded-0">
                {{ shippersError }} <button class="btn btn-link p-0 align-baseline" @click="loadShippingOptions">Retry</button>
              </div>
              <div v-else>
                <div class="mb-3">
                  <label class="fLabel d-block mb-1">Shipper *</label>
                  <select class="form-control rounded-0" v-model="selectedShipperId" @change="onShipperChange">
                    <option value="">Select shipper</option>
                    <option v-for="s in shippers" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="mb-3" v-if="shippingMethods.length > 0">
                  <label class="fLabel d-block mb-1">Service *</label>
                  <select class="form-control rounded-0" v-model="selectedShippingMethodId">
                    <option value="">Select shipping service</option>
                    <option v-for="m in shippingMethods" :key="m.id" :value="m.id">
                      {{ m.name }} ({{ m.estimatedDays || 'ETA N/A' }})
                    </option>
                  </select>
                </div>
                <div class="small text-muted">
                  Shipping cost is calculated by backend shipper rules and destination.
                </div>
              </div>
            </div>

          </div>

          <div class="col-12 col-lg-4">
            <div class="border p-4">
              <h3 class="h5 mb-4">3. Order Summary</h3>

              <div :class="['totals-container', { 'totals-container--refreshing': totalsLoading }]">

              <div v-if="totalsLoading" class="skeleton-totals">
                <div class="skeleton-row" v-for="n in 5" :key="'sk-'+n">
                  <span class="skeleton-bar skeleton-bar--label"></span>
                  <span class="skeleton-bar skeleton-bar--value"></span>
                </div>
                <div class="skeleton-row skeleton-row--total">
                  <span class="skeleton-bar skeleton-bar--label"></span>
                  <span class="skeleton-bar skeleton-bar--value"></span>
                </div>
                <div class="skeleton-row">
                  <span class="skeleton-bar skeleton-bar--label"></span>
                  <span class="skeleton-bar skeleton-bar--value"></span>
                </div>
              </div>
              <template v-else>
              <div v-for="item in cartStore.items" :key="cartStore.getItemKey(item)" class="d-flex justify-content-between mb-3">
                <div class="pe-2">
                  <div class="small">{{ item.name }} × {{ item.quantity }}</div>
                  <div class="small text-muted" v-if="item.giftBoxId || item.giftCardId">
                    <span v-if="item.giftBoxId">{{ item.giftBoxName || 'Gift Box' }}</span>
                    <span v-if="item.giftCardId" class="ms-1">{{ item.giftCardName || 'Gift Card' }}</span>
                  </div>
                </div>
                <strong>{{ currencyStore.formatPrice(itemLineTotal(item)) }}</strong>
              </div>

              <hr>
              <div v-if="!totalsLoading" aria-live="polite" class="mb-2">
                <div class="d-flex justify-content-between mb-2"><span>Items subtotal</span><span>{{ currencyStore.formatPrice(itemsSubtotal) }}</span></div>
                <div class="d-flex justify-content-between mb-2"><span>Add-ons subtotal</span><span>{{ currencyStore.formatPrice(addonsSubtotal) }}</span></div>
                <div class="d-flex justify-content-between mb-2"><span>Shipping</span><span>{{ currencyStore.formatPrice(shippingCost) }}</span></div>
                <div class="d-flex justify-content-between mb-2"><span>Tax (%)</span><span>{{ displayTaxPercentage }}%</span></div>
                <div class="d-flex justify-content-between mb-2"><span>Tax Amount</span><span>{{ currencyStore.formatPrice(taxAmount) }}</span></div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Discount</span>
                  <span class="text-success">-{{ currencyStore.formatPrice(discountAmount) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2"><strong>Final payable total</strong><strong>{{ currencyStore.formatPrice(payableTotal) }}</strong></div>
              </div>
              <small v-if="totalsHint && !totalsLoading" class="d-block text-muted mb-2">{{ totalsHint }}</small>
              <div v-if="totalsError && !totalsLoading" class="alert alert-warning rounded-0 py-2">
                {{ totalsError }}
                <button class="btn btn-link p-0 align-baseline ms-1" @click="retryTotals">Retry</button>
              </div>
              </template>
              </div>
              <hr>
              <div class="border p-2 mb-3 bg-light">
                <div class="d-flex justify-content-between">
                  <span class="small fw-medium">You will be charged</span>
                  <strong>{{ currencyStore.formatPrice(payableTotal) }}</strong>
                </div>
                <small class="text-muted d-block mt-1">Tax is calculated based on destination country.</small>
              </div>

              <form class="mb-3" @submit.prevent="applyVoucher">
                <label class="fLabel d-block mb-1">Voucher</label>
                <div class="input-group">
                  <input class="form-control rounded-0" v-model="voucherCode" placeholder="Voucher code">
                  <button class="btn btn-outline-dark rounded-0" type="submit">Apply</button>
                </div>
                <small v-if="voucherMessage" :class="voucherSuccess ? 'text-success' : 'text-danger'">{{ voucherMessage }}</small>
              </form>

              <button class="btn btn-dark w-100 rounded-0" :disabled="submitting || !canSubmit || totalsLoading" @click="placeOrder">
                <span v-if="submitting"><span class="spinner-border spinner-border-sm me-2" role="status"></span>Placing order...</span>
                <span v-else>Place Order</span>
              </button>
              <p class="small text-muted mt-2 mb-0">Final totals and stock are validated by server during order placement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useCurrencyStore } from '../stores/currencyStore'
import { useLocationStore } from '../stores/locationStore'
import axios from 'axios'
import { API_BASE, getCurrentUserId, isAuthenticated } from '../services/apiConfig'
import { getUserAddresses } from '../services/addressService'
import { calculateShippingRates, getActiveShippers, getShipperMethods, previewShippingCost, getCountryTaxRate } from '../services/shippingService'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const locationStore = useLocationStore()

const addressesLoading = ref(false)
const addressesError = ref('')
const savedAddresses = ref([])
const selectedAddressId = ref(null)

const shippersLoading = ref(false)
const shippersError = ref('')
const shippers = ref([])
const shippingMethods = ref([])
const rateMethodsByShipper = ref({})
const selectedShipperId = ref('')
const selectedShippingMethodId = ref('')
const shippingLoading = ref(false)
const countryTaxSyncing = ref(false)
const syncedTaxCountryId = ref(0)
const countryTaxRatePercentage = ref(0)
const shippingCost = ref(0)
const orderWeightKg = ref(0)
const taxPercentage = ref(0)
const totalsError = ref('')

const voucherCode = ref('')
const voucherId = ref(null)
const voucherSuccess = ref(false)
const voucherMessage = ref('')
const discountAmount = ref(0)
const taxAmount = ref(0)
const isLoggedIn = ref(false)
const guestEmail = ref('')
const guestFullName = ref('')

const PAYMENT_TERM_ID = 'IMMEDIATE'
const PAYMENT_GATEWAY_ID = 1
const AIRWALLEX_DRAFT_PREFIX = 'airwallex-order-draft:'
const AIRWALLEX_LAST_DRAFT_KEY = 'airwallex-order-draft:last'

const submitting = ref(false)
const submitError = ref('')

const manualAddress = reactive({
  street: '',
  cityId: '',
  stateId: '',
  countryId: '',
  zipCode: ''
})

const billingSameAsShipping = ref(true)
const billingAddress = reactive({
  street: '',
  cityId: '',
  stateId: '',
  countryId: '',
  zipCode: ''
})

const selectedAddress = computed(() => savedAddresses.value.find(a => a.id === selectedAddressId.value) || null)
function resolveLocationId(value, options = []) {
  if (value === null || value === undefined || value === '') return 0
  const direct = Number(value)
  if (Number.isFinite(direct) && direct > 0) return direct
  const asString = String(value).trim().toLowerCase()
  const found = options.find(opt => String(opt.name || '').trim().toLowerCase() === asString)
  return Number(found?.id || 0)
}
const selectedCountryId = computed(() => resolveLocationId(
  selectedAddress.value?.countryId ?? selectedAddress.value?.country ?? manualAddress.countryId,
  locationStore.countries
))
const selectedStateId = computed(() => {
  const stateOptions = locationStore.getStates(selectedCountryId.value)
  return resolveLocationId(
    selectedAddress.value?.stateId ?? selectedAddress.value?.state ?? manualAddress.stateId,
    stateOptions
  )
})
const selectedCityId = computed(() => {
  const cityOptions = locationStore.getCities(selectedStateId.value)
  return resolveLocationId(
    selectedAddress.value?.cityId ?? selectedAddress.value?.city ?? manualAddress.cityId,
    cityOptions
  )
})
const shippingAddressText = computed(() => {
  if (selectedAddress.value) {
    return `${selectedAddress.value.street || ''}, ${selectedAddress.value.city || ''}, ${selectedAddress.value.state || ''}, ${selectedAddress.value.country || ''} ${selectedAddress.value.zipCode || ''}`.replace(/\s+,/g, ',').trim()
  }
  return `${manualAddress.street}, ${manualAddress.cityId}, ${manualAddress.stateId}, ${manualAddress.countryId} ${manualAddress.zipCode}`.trim()
})

function buildBillingAddress() {
  if (billingSameAsShipping.value) {
    if (selectedAddress.value) {
      return `${selectedAddress.value.street || ''}, ${selectedAddress.value.city || ''}, ${selectedAddress.value.state || ''}, ${selectedAddress.value.country || ''} ${selectedAddress.value.zipCode || ''}`.replace(/\s+,/g, ',').trim()
    }
    return shippingAddressText.value
  }
  return `${billingAddress.street}, ${billingAddress.cityId}, ${billingAddress.stateId}, ${billingAddress.countryId} ${billingAddress.zipCode}`.trim()
}

async function onBillingCountryChange() {
  billingAddress.stateId = ''
  billingAddress.cityId = ''
  if (billingAddress.countryId) {
    await locationStore.loadStates(Number(billingAddress.countryId))
  }
}

function onBillingStateChange() {
  billingAddress.cityId = ''
}

const itemsSubtotal = computed(() => cartStore.totalPrice)
const addonsSubtotal = computed(() => cartStore.addonsTotal)
const payableTotal = computed(() => Math.max(0, itemsSubtotal.value + addonsSubtotal.value + shippingCost.value + taxAmount.value - discountAmount.value))
const totalsLoading = computed(() => shippingLoading.value || shippersLoading.value || countryTaxSyncing.value)
const displayTaxPercentage = computed(() => Number(taxPercentage.value || countryTaxRatePercentage.value || 0).toFixed(2))
const isTaxRateSynced = computed(() => {
  const countryId = Number(selectedCountryId.value || 0)
  return countryId > 0 && countryId === Number(syncedTaxCountryId.value || 0)
})
const totalsHint = computed(() => {
  if (!selectedCountryId.value) return 'Select country to calculate tax'
  if (totalsLoading.value) return 'Recalculating shipping, tax and final payable total...'
  if (!isTaxRateSynced.value) return 'Updating country tax rate...'
  return ''
})

const canSubmit = computed(() => {
  if (!selectedCountryId.value) return false
  if (!isTaxRateSynced.value) return false
  if (!selectedShipperId.value) return false
  if (shippingMethods.value.length > 0 && !selectedShippingMethodId.value) return false
  if (!shippingAddressText.value) return false
  if (totalsLoading.value || !!totalsError.value) return false
  if (!isLoggedIn.value) {
    if (!guestEmail.value.trim() || !guestFullName.value.trim()) return false
  }
  return cartStore.items.length > 0
})

function itemLineTotal(item) {
  const addons = Number(item.giftBoxPriceUsd || 0) + Number(item.giftCardPrice || 0)
  return (Number(item.price || 0) + addons) * (item.quantity || 1)
}

function normalizeCheckoutError(error) {
  const raw = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to place order.'
  const lower = raw.toLowerCase()
  if (lower.includes('insufficient stock') || lower.includes('out of stock')) {
    return 'Some items are no longer available in requested quantity. Please adjust your cart and retry.'
  }
  if (lower.includes('inventory') && (lower.includes('initialize') || lower.includes('not found'))) {
    return 'Inventory is not initialized for one or more products. Please contact support before retrying.'
  }
  if (lower.includes('shipper') || lower.includes('shipping')) {
    return 'Selected shipping option is invalid for this address. Please reselect shipper/service.'
  }
  return raw
}

async function loadAddresses() {
  addressesLoading.value = true
  addressesError.value = ''
  const userId = getCurrentUserId()
  if (!userId) {
    addressesLoading.value = false
    return
  }
  try {
    savedAddresses.value = await getUserAddresses(userId)
    const def = savedAddresses.value.find(a => a.isDefault)
    selectedAddressId.value = def?.id || null
  } catch (e) {
    addressesError.value = e.response?.data?.message || 'Unable to load saved addresses.'
  } finally {
    addressesLoading.value = false
  }
}

async function loadShippingOptions() {
  shippersLoading.value = true
  shippersError.value = ''
  try {
    shippers.value = await getActiveShippers()
    if (shippers.value.length && !selectedShipperId.value) {
      selectedShipperId.value = shippers.value[0].id
      await onShipperChange()
    }
  } catch (e) {
    shippersError.value = e.response?.data?.message || 'Unable to load shipping providers.'
  } finally {
    shippersLoading.value = false
  }
}

async function onShipperChange() {
  selectedShippingMethodId.value = ''
  if (!selectedShipperId.value) {
    shippingMethods.value = []
    shippingCost.value = 0
    taxPercentage.value = 0
    taxAmount.value = 0
    return
  }
  const shipperMethodsFromRates = rateMethodsByShipper.value[String(selectedShipperId.value)] || []
  if (shipperMethodsFromRates.length > 0) {
    shippingMethods.value = shipperMethodsFromRates
  } else {
    shippingMethods.value = await getShipperMethods(selectedShipperId.value)
  }
  if (shippingMethods.value.length) {
    selectedShippingMethodId.value = shippingMethods.value[0].id
  }
  await recalculateTotals()
}

function computeOrderWeight() {
  orderWeightKg.value = cartStore.items.reduce((sum, item) => {
    const unitWeight = Number(item.jewelleryWeightKg || item.weightKg || 0)
    return sum + (unitWeight * (item.quantity || 1))
  }, 0)
}

async function onManualCountryChange() {
  manualAddress.stateId = ''
  manualAddress.cityId = ''
  syncedTaxCountryId.value = 0
  await nextTick()
  if (manualAddress.countryId) {
    await locationStore.loadStates(Number(manualAddress.countryId))
  }
  await recalculateTotals({ syncCountryTax: Boolean(manualAddress.countryId) })
}

function onManualStateChange() {
  manualAddress.cityId = ''
}

async function syncSelectedCountryTaxRate() {
  const countryId = Number(selectedCountryId.value || 0)
  if (!countryId) {
    syncedTaxCountryId.value = 0
    return true
  }
  countryTaxSyncing.value = true
  try {
    const taxResponse = await getCountryTaxRate(countryId)
    const rawRate = Number(taxResponse?.taxRate ?? 0)
    const nextTaxPercentage = rawRate > 0 && rawRate <= 1 ? rawRate * 100 : rawRate
    countryTaxRatePercentage.value = Number.isFinite(nextTaxPercentage) ? Math.max(0, nextTaxPercentage) : 0
    const baseForTax = Number(itemsSubtotal.value + addonsSubtotal.value + shippingCost.value - discountAmount.value)
    const computedTaxAmount = (baseForTax * countryTaxRatePercentage.value) / 100
    taxPercentage.value = countryTaxRatePercentage.value
    taxAmount.value = Number.isFinite(computedTaxAmount) ? Math.max(0, computedTaxAmount) : 0
    syncedTaxCountryId.value = countryId
    return true
  } catch (e) {
    totalsError.value = e.response?.data?.message || 'Could not fetch country tax rate. Please retry.'
    syncedTaxCountryId.value = 0
    countryTaxRatePercentage.value = 0
    taxPercentage.value = 0
    taxAmount.value = 0
    return false
  } finally {
    countryTaxSyncing.value = false
  }
}

function applyPreviewTotals(preview = {}) {
  const nextShipping = Number(preview.shippingCost ?? preview.cost ?? shippingCost.value ?? 0)
  const hasPreviewTaxPercentage = [preview.taxPercentage, preview.taxPercent, preview.taxRate].some(
    (value) => value !== undefined && value !== null
  )
  const nextTaxPercentage = hasPreviewTaxPercentage
    ? Number(preview.taxPercentage ?? preview.taxPercent ?? preview.taxRate ?? 0)
    : Number(countryTaxRatePercentage.value || taxPercentage.value || 0)
  const baseForTax = Number(itemsSubtotal.value + addonsSubtotal.value + nextShipping - discountAmount.value)
  const computedTaxFromRate = (baseForTax * nextTaxPercentage) / 100
  const hasPreviewTaxAmount = [preview.taxAmount, preview.tax].some((value) => value !== undefined && value !== null)
  const nextTaxAmount = hasPreviewTaxAmount ? Number(preview.taxAmount ?? preview.tax ?? 0) : Number(computedTaxFromRate ?? 0)

  shippingCost.value = Math.max(0, nextShipping)
  taxPercentage.value = Number.isFinite(nextTaxPercentage) ? Math.max(0, nextTaxPercentage) : 0
  taxAmount.value = Number.isFinite(nextTaxAmount) ? Math.max(0, nextTaxAmount) : 0
}

async function applyPreviewShipper(preview = {}) {
  const previewShipperId = Number(preview.shipperId || 0)
  if (!previewShipperId) return

  const previewShipperName = String(preview.shipperName || '').trim()
  const existing = shippers.value.find((shipper) => Number(shipper.id) === previewShipperId)
  if (!existing) {
    shippers.value = [
      { id: previewShipperId, name: previewShipperName || `Shipper #${previewShipperId}` },
      ...shippers.value
    ]
  }

  const selectedChanged = Number(selectedShipperId.value || 0) !== previewShipperId
  if (selectedChanged) {
    selectedShipperId.value = previewShipperId
  }

  if (!selectedChanged && shippingMethods.value.length > 0) return

  const shipperMethodsFromRates = rateMethodsByShipper.value[String(previewShipperId)] || []
  shippingMethods.value = shipperMethodsFromRates.length > 0
    ? shipperMethodsFromRates
    : await getShipperMethods(previewShipperId)

  if (shippingMethods.value.length && !shippingMethods.value.some((method) => String(method.id) === String(selectedShippingMethodId.value))) {
    selectedShippingMethodId.value = shippingMethods.value[0].id
  }
}

function compareRateOptions(a, b) {
  const aRecommended = a.isRecommendationEligible ? 1 : 0
  const bRecommended = b.isRecommendationEligible ? 1 : 0
  if (aRecommended !== bRecommended) return bRecommended - aRecommended

  const aPriority = Number(a.priorityScore || 0)
  const bPriority = Number(b.priorityScore || 0)
  if (aPriority !== bPriority) return bPriority - aPriority

  const aCost = Number(a.cost || 0)
  const bCost = Number(b.cost || 0)
  return aCost - bCost
}

function normalizeRateOptions(rates = []) {
  return (Array.isArray(rates) ? rates : [])
    .map((rate) => ({
      shipperId: Number(rate.shipperId || 0),
      shipperName: String(rate.shipperName || '').trim(),
      shippingMethodId: Number(rate.shippingMethodId || 0),
      serviceName: String(rate.serviceName || '').trim(),
      cost: Number(rate.cost || 0),
      estimatedDays: rate.estimatedDays ?? null,
      isRecommendationEligible: Boolean(rate.isRecommendationEligible),
      priorityScore: Number(rate.priorityScore || 0)
    }))
    .filter((rate) => rate.shipperId > 0 && rate.shippingMethodId > 0)
    .sort(compareRateOptions)
}

async function refreshBestShippers() {
  computeOrderWeight()
  const rates = normalizeRateOptions(await calculateShippingRates({
    countryId: selectedCountryId.value,
    stateId: selectedStateId.value || undefined,
    cityId: selectedCityId.value || undefined,
    orderWeightKg: Number(orderWeightKg.value || 0),
    orderTotalUsd: Number(itemsSubtotal.value + addonsSubtotal.value)
  }))

  if (!rates.length) {
    rateMethodsByShipper.value = {}
    return
  }

  /** @type {Record<string, Array<{id:number,name:string,estimatedDays:number|null,cost:number,priorityScore:number,isRecommendationEligible:boolean}>>} */
  const methodsByShipper = {}
  /** @type {Array<{id:number,name:string,priorityScore:number,isRecommendationEligible:boolean,minCost:number}>} */
  const shipperRows = []

  rates.forEach((rate) => {
    const shipperKey = String(rate.shipperId)
    if (!methodsByShipper[shipperKey]) methodsByShipper[shipperKey] = []
    methodsByShipper[shipperKey].push({
      id: rate.shippingMethodId,
      name: rate.serviceName || 'Service',
      estimatedDays: rate.estimatedDays,
      cost: rate.cost,
      priorityScore: rate.priorityScore,
      isRecommendationEligible: rate.isRecommendationEligible
    })

    const existingShipper = shipperRows.find((shipper) => shipper.id === rate.shipperId)
    if (!existingShipper) {
      shipperRows.push({
        id: rate.shipperId,
        name: rate.shipperName || `Shipper #${rate.shipperId}`,
        priorityScore: rate.priorityScore,
        isRecommendationEligible: rate.isRecommendationEligible,
        minCost: rate.cost
      })
    } else {
      existingShipper.priorityScore = Math.max(existingShipper.priorityScore, rate.priorityScore)
      existingShipper.isRecommendationEligible = existingShipper.isRecommendationEligible || rate.isRecommendationEligible
      existingShipper.minCost = Math.min(existingShipper.minCost, rate.cost)
    }
  })

  Object.keys(methodsByShipper).forEach((shipperKey) => {
    methodsByShipper[shipperKey].sort(compareRateOptions)
  })

  shipperRows.sort((a, b) => {
    if (a.isRecommendationEligible !== b.isRecommendationEligible) {
      return Number(b.isRecommendationEligible) - Number(a.isRecommendationEligible)
    }
    if (a.priorityScore !== b.priorityScore) return b.priorityScore - a.priorityScore
    return a.minCost - b.minCost
  })

  rateMethodsByShipper.value = methodsByShipper
  shippers.value = shipperRows

  const selectedShipperKey = String(selectedShipperId.value || '')
  if (!selectedShipperKey || !methodsByShipper[selectedShipperKey]) {
    selectedShipperId.value = shipperRows[0]?.id || ''
  }

  const activeShipperMethods = methodsByShipper[String(selectedShipperId.value)] || []
  shippingMethods.value = activeShipperMethods
  if (activeShipperMethods.length && !activeShipperMethods.some((method) => String(method.id) === String(selectedShippingMethodId.value))) {
    selectedShippingMethodId.value = activeShipperMethods[0].id
  }
}

async function recalculateTotals(options = {}) {
  const { syncCountryTax = false } = options
  totalsError.value = ''
  if (!selectedCountryId.value) {
    shippingCost.value = 0
    syncedTaxCountryId.value = 0
    countryTaxRatePercentage.value = 0
    taxPercentage.value = 0
    taxAmount.value = 0
    return
  }
  if (syncCountryTax) {
    const synced = await syncSelectedCountryTaxRate()
    if (!synced) {
      shippingCost.value = 0
      taxPercentage.value = 0
      taxAmount.value = 0
      return
    }
  }
  try {
    await refreshBestShippers()
  } catch (e) {
    rateMethodsByShipper.value = {}
  }
  if (!selectedShipperId.value) {
    totalsError.value = 'Select shipping provider to calculate tax and final total.'
    return
  }
  shippingLoading.value = true
  try {
    computeOrderWeight()
    const preview = await previewShippingCost({
      countryId: selectedCountryId.value,
      stateId: selectedStateId.value || undefined,
      cityId: selectedCityId.value || undefined,
      shipperId: Number(selectedShipperId.value),
      orderWeightKg: Number(orderWeightKg.value || 0),
      orderTotalUsd: Number(itemsSubtotal.value + addonsSubtotal.value)
    })
    await applyPreviewShipper(preview || {})
    applyPreviewTotals(preview || {})
  } catch (e) {
    shippingCost.value = 0
    taxPercentage.value = 0
    taxAmount.value = 0
    totalsError.value = e.response?.data?.message || 'Could not recalculate totals. Please retry.'
  } finally {
    shippingLoading.value = false
  }
}

async function applyVoucher() {
  voucherMessage.value = ''
  voucherSuccess.value = false
  voucherId.value = null
  discountAmount.value = 0
  if (!voucherCode.value.trim()) return
  try {
    const response = await axios.post(`${API_BASE}/api/v1/vouchers/validate`, null, {
      params: {
        code: voucherCode.value.trim(),
        orderTotal: itemsSubtotal.value + addonsSubtotal.value + shippingCost.value
      }
    })
    const data = response.data || {}
    voucherId.value = data.id || null
    if (data.discountType === 'percentage') {
      discountAmount.value = ((itemsSubtotal.value + addonsSubtotal.value + shippingCost.value) * Number(data.discountValue || 0)) / 100
    } else {
      discountAmount.value = Number(data.discountValue || 0)
    }
    voucherSuccess.value = true
    voucherMessage.value = 'Voucher applied.'
    await recalculateTotals()
  } catch (e) {
    voucherSuccess.value = false
    voucherMessage.value = e.response?.data?.message || 'Voucher is invalid or expired.'
  }
}

async function placeOrder() {
  submitError.value = ''
  if (!canSubmit.value) {
    submitError.value = totalsError.value || totalsHint.value || 'Please complete address and shipping selection before placing order.'
    return
  }
  submitting.value = true
  try {
    const payload = buildOrderPayload()
    await startAirwallexPayment(payload)
  } catch (e) {
    submitError.value = normalizeCheckoutError(e)
  } finally {
    submitting.value = false
  }
}

async function retryTotals() {
  await recalculateTotals({ syncCountryTax: Boolean(selectedCountryId.value) })
}

function buildOrderPayload() {
  const userId = getCurrentUserId()
  const isAuth = isAuthenticated() && !!userId

  const billingAddressText = buildBillingAddress()
  const billingNote = billingSameAsShipping.value
    ? ''
    : `Billing address: ${billingAddressText}`

  const base = {
    countryId: selectedCountryId.value,
    stateId: selectedStateId.value || undefined,
    cityId: selectedCityId.value || undefined,
    currencyId: 1,
    voucherId: voucherId.value || undefined,
    paymentTermId: PAYMENT_TERM_ID,
    paymentGatewayId: PAYMENT_GATEWAY_ID,
    shipperId: Number(selectedShipperId.value),
    shippingMatrixId: selectedShippingMethodId.value ? Number(selectedShippingMethodId.value) : undefined,
    orderWeightKg: Number(orderWeightKg.value || 0),
    source: 'WEBSITE',
    notes: billingNote,
    items: cartStore.items.map(item => ({
      productId: Number(item.id),
      quantity: Number(item.quantity || 1),
      giftBoxId: item.giftBoxId || undefined,
      giftCardId: item.giftCardId || undefined,
      giftNote: item.giftNote || undefined
    }))
  }

  if (isAuth) {
    return {
      ...base,
      customerId: userId,
      userAddressId: selectedAddressId.value || undefined,
      shippingAddress: selectedAddressId.value ? undefined : {
        street: manualAddress.street,
        city: String(manualAddress.cityId || ''),
        state: String(manualAddress.stateId || ''),
        zipCode: manualAddress.zipCode,
        country: String(manualAddress.countryId || '')
      },
      metadata: {
        billingAddress: billingAddressText,
        billingSameAsShipping: billingSameAsShipping.value
      }
    }
  }

  return {
    ...base,
    guestInfo: {
      email: guestEmail.value.trim(),
      fullName: guestFullName.value.trim()
    },
    shippingAddress: {
      street: manualAddress.street,
      city: String(manualAddress.cityId || ''),
      state: String(manualAddress.stateId || ''),
      zipCode: manualAddress.zipCode,
      country: String(manualAddress.countryId || '')
    },
    metadata: {
      billingAddress: billingAddressText,
      billingSameAsShipping: billingSameAsShipping.value
    }
  }
}

function makeDraftKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getAirwallexRedirectUrl(paymentIntent = {}) {
  return (
    paymentIntent.paymentUrl ||
    paymentIntent.payment_url ||
    paymentIntent.redirectUrl ||
    paymentIntent.redirect_url ||
    paymentIntent.hostedPaymentUrl ||
    paymentIntent.hosted_payment_url ||
    paymentIntent.paymentLink ||
    paymentIntent.payment_link ||
    paymentIntent.nextAction?.url ||
    paymentIntent.next_action?.url ||
    ''
  )
}

async function startAirwallexPayment(orderPayload) {
  const draftKey = makeDraftKey()
  const returnUrl = `${window.location.origin}/payment-success?draft=${encodeURIComponent(draftKey)}`
  const paymentRequest = {
    amount: Number(payableTotal.value),
    currency: currencyStore.currency || 'USD',
    orderId: `pending-${draftKey}`,
    returnUrl,
    metadata: {
      draftKey,
      customerId: orderPayload.customerId,
      amount: Number(payableTotal.value)
    }
  }

  sessionStorage.setItem(`${AIRWALLEX_DRAFT_PREFIX}${draftKey}`, JSON.stringify(orderPayload))
  sessionStorage.setItem(AIRWALLEX_LAST_DRAFT_KEY, draftKey)

  const response = await axios.post(`${API_BASE}/api/v1/payments/create-intent`, paymentRequest)
  const paymentIntent = response.data || {}
  const redirectUrl = getAirwallexRedirectUrl(paymentIntent)

  if (!redirectUrl) {
    throw new Error('Could not start Airwallex hosted payment.')
  }

  window.location.href = redirectUrl
}

watch([
  selectedAddressId,
  selectedStateId,
  selectedCityId,
  selectedShipperId,
  selectedShippingMethodId
], () => {
  recalculateTotals()
})

watch(selectedCountryId, async (countryId) => {
  syncedTaxCountryId.value = 0
  if (!countryId) {
    await recalculateTotals()
    return
  }
  if (!selectedAddressId.value) return
  await locationStore.loadStates(countryId)
  await recalculateTotals({ syncCountryTax: true })
})

watch(selectedStateId, (stateId) => {
  if (stateId) {
    locationStore.loadCities(stateId)
  }
})

onMounted(() => {
  isLoggedIn.value = isAuthenticated()
  if (route.query.payment_status || route.query.status) {
    const query = new URLSearchParams(window.location.search).toString()
    router.replace(`/payment-success${query ? `?${query}` : ''}`)
    return
  }
  if (!locationStore.loaded) locationStore.loadAllLocations()
  loadAddresses()
  loadShippingOptions()
})
</script>

<style scoped>
.placeholder {
  min-height: 1rem;
}

.skeleton-totals {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-row--total {
  border-top: 1px solid #dee2e6;
  padding-top: 12px;
}

.skeleton-bar {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

.skeleton-bar--label {
  width: 42%;
}

.skeleton-bar--value {
  width: 28%;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
