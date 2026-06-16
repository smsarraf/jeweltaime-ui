<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Checkout</li>
        </ol>
      </nav>
    </div>

    <!-- Empty Cart -->
    <section v-if="cartStore.items.length === 0" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <h3 class="mb-4">Your cart is empty. Cannot proceed to checkout.</h3>
            <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Return to Shop</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Placed Success -->
    <section v-else-if="orderPlaced" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <i class="fa-solid fa-circle-check text-success" style="font-size: 5rem; margin-bottom: 2rem;"></i>
            <h2 class="mb-3">Order Placed Successfully!</h2>
            <p class="mb-5">Thank you for your purchase. Your order number is #{{ orderNumber }}.</p>
            <router-link to="/" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Back to Home</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Checkout Form -->
    <section v-else class="carttablewrap py-7">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h1 class="mnHding fw-normal mb-7 mb-md-14">Checkout</h1>
          </div>
          <div class="col-12 col-lg-8">
            <div class="pe-lg-16">
              <!-- Returning Customer Alert (only show when not logged in) -->
              <aside v-if="!isLoggedIn" class="alert checkoutAlert d-flex justify-content-center fw-normal rounded-0 pt-4 pb-3 px-3 mb-4">
                <i class="fa-regular fa-user me-2"></i> Returning Customer?
                <a class="alertPopBtn text-decoration-none ms-1" data-bs-toggle="collapse" href="#loginAlertPopup" aria-expanded="false" aria-controls="loginAlertPopup">
                  Click here to login <i class="fa-solid fa-chevron-down"></i>
                </a>
              </aside>
              <div v-if="!isLoggedIn" id="loginAlertPopup" class="alertCollapseWrap collapse py-2 ps-1 pe-2 mb-4">
                <form action="#" class="alertPopForm">
                  <div class="row">
                    <div class="col-12 col-md-7 col-lg-8 col-xl-7 mx-md-auto">
                      <p class="fw-light">If you have shopped with us before, please enter your details in the boxes below. If you are a new customer, please proceed to the Billing & Shipping section.</p>
                      <div class="form-group mb-3">
                        <label class="d-block f-label fw-normal mb-2">User Name or Email <em class="req">*</em></label>
                        <input type="email" class="form-control d-block w-100" v-model="loginEmail">
                      </div>
                      <div class="form-group mb-4">
                        <label class="d-block f-label fw-normal mb-2">Password <em class="req">*</em></label>
                        <input type="password" class="form-control d-block w-100" v-model="loginPassword">
                      </div>
                      <div class="form-group d-md-flex justify-content-md-between mb-4">
                        <span class="customCheckboxLabel d-block mb-3 mb-md-0">
                          <input class="form-check-input fakeInput m-0" type="radio" id="save-password" v-model="rememberMe" :value="true">
                          <label class="form-check-label fw-normal cuFakeLabel" for="save-password">Remember me</label>
                        </span>
                        <a href="javascript:void(0);" class="txtLink text-decoration-none fw-normal forgot-password">Lost your password?</a>
                      </div>
                      <div class="form-group">
                        <button type="button" class="btn btn-dark fw-medium text-capitalize w-100" @click="handleLogin">Login</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Coupon Alert -->
              <aside class="alert checkoutAlert d-flex justify-content-center rounded-0 fw-normal pt-4 pb-3 px-3">
                <i class="fa-solid fa-tag fa-flip-horizontal me-2"></i> Have a coupon?
                <a class="alertPopBtn text-decoration-none ms-1" data-bs-toggle="collapse" href="#couponAlertPopup" aria-expanded="false" aria-controls="couponAlertPopup">
                  Click here to enter your code <i class="fa-solid fa-chevron-down"></i>
                </a>
              </aside>
              <div id="couponAlertPopup" class="alertCollapseWrap collapse py-2 ps-1 pe-2 mb-4">
                <form action="#" class="alertPopForm" @submit.prevent="applyCouponCode">
                  <div class="row">
                    <div class="col-7 col-md-7 col-lg-8 col-xl-7 mx-auto">
                      <div class="form-group mb-3">
                        <input type="text" class="form-control d-block w-100" v-model="checkoutCouponCode" placeholder="Coupon Code">
                      </div>
                      <div class="form-group">
                        <button type="submit" class="btn btn-dark fw-medium text-capitalize w-100">Apply Coupon</button>
                      </div>
                      <div v-if="checkoutCouponMessage" class="mt-2">
                        <small :class="checkoutCouponSuccess ? 'text-success' : 'text-danger'">{{ checkoutCouponMessage }}</small>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <form action="#" class="ChForm">
                <!-- Billing Details -->
                <div class="bilingDetailsWrap row pt-lg-5 pt-xl-6 mb-8 mb-xl-14">
                  <h3 class="h2vii fw-medium text-capitalize mb-6">Billing Details</h3>
                  <div class="form-row d-flex flex-wrap">
                    <div class="formCol formCol50 mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">First Name <em class="req">*</em></span>
                        <input type="text" class="form-control d-block w-100" v-model="billing.firstName" required>
                      </div>
                    </div>
                    <div class="formCol formCol50 mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Last Name <em class="req">*</em></span>
                        <input type="text" class="form-control d-block w-100" v-model="billing.lastName" required>
                      </div>
                    </div>
                    <div class="formCol mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Company Name</span>
                        <input type="text" class="form-control d-block w-100" v-model="billing.company">
                      </div>
                    </div>
                    <div class="formCol formCol50 mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Email Address</span>
                        <input type="email" class="form-control d-block w-100" v-model="billing.email" required>
                      </div>
                    </div>
                    <div class="formCol formCol50 mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Phone</span>
                        <input type="tel" class="form-control d-block w-100" v-model="billing.phone" required>
                      </div>
                    </div>
                    <div class="formCol mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Country</span>
                        <div class="coolSelectWrapper">
                          <select class="coolSelect form-control" v-model="billing.country">
                            <option value="" disabled>Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="CA">Canada</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="formCol mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Address <em class="req">*</em></span>
                        <input type="text" class="form-control d-block w-100 mb-2" v-model="billing.addressLine1" placeholder="Street Address">
                        <input type="text" class="form-control d-block w-100" v-model="billing.addressLine2" placeholder="Apartment, suite, unit etc. (optional)">
                      </div>
                    </div>
                    <div class="formCol mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Town / City <em class="req">*</em></span>
                        <input type="text" class="form-control d-block w-100" v-model="billing.city" required>
                      </div>
                    </div>
                    <div class="formCol formCol50 mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">State / County <em class="req">*</em></span>
                        <input type="text" class="form-control d-block w-100" v-model="billing.state" required>
                      </div>
                    </div>
                    <div class="formCol formCol50 mb-3">
                      <div class="form-group d-block">
                        <span class="fLabel fw-normal text-capitalize d-block mb-1">Postcode / ZIP <em class="req">*</em></span>
                        <input type="text" class="form-control d-block w-100" v-model="billing.postcode" required>
                      </div>
                    </div>
                    <div class="formCol mb-8">
                      <span class="customCheckboxLabel d-inline-block">
                        <input class="form-check-input fakeInput" type="checkbox" id="create-account" v-model="createAccount">
                        <label class="form-check-label cuFakeLabel ps-1" for="create-account">Create an account?</label>
                      </span>
                    </div>
                  </div>
                  <span class="customCheckboxLabel mb-4 d-inline-block">
                    <input class="form-check-input fakeInput" type="radio" id="diff-ship-address" v-model="shipToDifferent" :value="true">
                    <label class="h2vi fw-medium form-check-label ps-1" for="diff-ship-address">Ship to a Different Address?</label>
                  </span>
                  <div class="form-row">
                    <div class="formCol">
                      <div class="form-group d-block">
                        <span class="fLabel text-capitalize mb-2 d-block">Order Notes <em class="req">*</em></span>
                        <textarea class="form-control order-notes d-block w-100" v-model="billing.orderNotes" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="ms-lg-n10">
              <div class="odrSide border py-7 px-7">
                <h5 class="cartHeading fw-medium mb-4">Your Order</h5>
                <div class="d-flex justify-content-between mb-3">
                  <span class="subheading fw-normal">Product</span>
                  <span class="Hprice fw-normal">Subtotal</span>
                </div>
                <hr class="mb-4">
                <div v-for="item in cartStore.items" :key="item.id" class="d-flex justify-content-between align-items-start mb-3 border-bottom pb-3">
                  <div class="d-flex">
                    <img :src="item.image || 'https://placehold.co/60x60'" alt="Product" class="img-thumbnail border-0 p-0 me-3 rounded-0 tb-img" width="50px" height="50px">
                    <div>
                      <span class="tb-heading d-block fw-light mb-1">{{ item.name }}</span>
                      <div class="d-flex align-items-center gap-2">
                        <div class="input-group input-group-sm" style="max-width: 100px;">
                          <button class="btn btn-outline-secondary btn-sm border" @click="decreaseItemQty(item)" :disabled="item.quantity <= 1">−</button>
                          <input type="text" class="form-control text-center form-control-sm border px-1" :value="item.quantity" readonly style="width: 32px;">
                          <button class="btn btn-outline-secondary btn-sm border" @click="increaseItemQty(item)">+</button>
                        </div>
                        <button class="btn btn-sm text-danger border-0 p-0" @click="removeItem(item.id)" title="Remove item">
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <span class="tb-price fw-normal flex-shrink-0 ms-2">{{ currencyStore.formatPrice(item.price * item.quantity) }}</span>
                </div>
                <hr class="mb-4">
                <div class="d-flex justify-content-between mb-4">
                  <span class="Hprice fw-normal">Subtotal</span>
                  <span class="tb-price fw-normal">{{ currencyStore.formatPrice(subtotalAfterDiscount) }}</span>
                </div>
                <hr class="mb-4">

                <!-- Shipping -->
                <div class="d-flex align-items-start mb-4">
                  <span class="Shding fw-normal me-2 me-md-10">Shipping</span>
                  <div class="pe-6">
                    <div class="form-check text-start">
                      <input class="form-check-input" type="radio" name="checkoutShipping" id="checkoutFreeShipping" value="free" v-model="checkoutShipping" @change="updateCheckoutShipping">
                      <label class="form-check-label" for="checkoutFreeShipping">Free Shipping</label>
                    </div>
                    <div class="form-check text-start">
                      <input class="form-check-input" type="radio" name="checkoutShipping" id="checkoutFlatRate" value="flat" v-model="checkoutShipping" @change="updateCheckoutShipping">
                      <label class="form-check-label" for="checkoutFlatRate">Flat Rate: <span class="clr fw-normal ps-1">{{ currencyStore.formatPrice(10.00) }}</span></label>
                    </div>
                  </div>
                </div>
                <hr class="mb-4">
                <div class="d-flex justify-content-between mb-6">
                  <span class="subheading fw-normal">Total</span>
                  <strong class="Hprice fw-medium">{{ currencyStore.formatPrice(totalWithShipping) }}</strong>
                </div>

                <!-- Payment Method -->
                <div class="border py-2 px-2 py-md-5 ps-md-4 pe-md-5 mb-4">
                  <div class="form-check Fs d-md-flex align-items-md-center">
                    <input class="form-check-input me-2" type="radio" name="paymentMethod" id="paypal" value="airwallex" v-model="selectedPayment" @change="onPaymentMethodChange">
                    <label class="form-check-label d-flex align-items-center fw-normal clr mb-2 mb-md-0" for="paypal">
                      Pay with Card (Airwallex)
                      <img src="/images/payment-gateway.png" alt="PayPal" class="ms-2">
                    </label>
                    <a href="javascript:void(0);" class="text-decoration-none small-txt ms-auto fw-normal clr">What is Airwallex?</a>
                  </div>
                </div>

                <!-- Airwallex Drop-in UI Container -->
                <div v-if="selectedPayment === 'airwallex'" class="airwallex-payment-section mb-4">
                  <div id="airwallex-dropin-container" ref="dropinContainer"></div>
                  <div v-if="paymentError" class="alert alert-danger mt-3 mb-0 rounded-0">
                    <i class="fa-solid fa-circle-exclamation me-2"></i>{{ paymentError }}
                  </div>
                  <div v-if="paymentLoading" class="text-center mt-3">
                    <div class="spinner-border text-dark" role="status">
                      <span class="visually-hidden">Loading payment...</span>
                    </div>
                    <p class="mt-2 text-muted small">Initializing secure payment...</p>
                  </div>
                </div>

                <!-- Terms Checkbox -->
                <div class="form-check clor mb-5">
                  <input class="form-check-input" type="checkbox" id="terms" v-model="acceptTerms">
                  <label class="form-check-label small ps-1" for="terms">
                    I have read and agree to the website <a href="javascript:void(0);">terms and conditions</a> *
                  </label>
                </div>

                <button class="btn btnP btn-dark fw-medium w-100 mb-1" @click="processPayment" :disabled="paymentLoading || isProcessing || !acceptTerms">
                  <span v-if="isProcessing">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing...
                  </span>
                  <span v-else>Pay with Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useCurrencyStore } from '../stores/currencyStore'
import axios from 'axios'

const cartStore = useCartStore()
const currencyStore = useCurrencyStore()
const orderPlaced = ref(false)
const isLoggedIn = computed(() => !!localStorage.getItem('authToken'))
const orderNumber = ref('')
const isProcessing = ref(false)
const selectedPayment = ref('airwallex')
const dropinContainer = ref(null)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

// Login form
const loginEmail = ref('')
const loginPassword = ref('')
const rememberMe = ref(false)

// Coupon
const checkoutCouponCode = ref('')
const checkoutCouponMessage = ref('')
const checkoutCouponSuccess = ref(false)
const checkoutDiscount = ref(0)

// Shipping
const checkoutShipping = ref('free')
const checkoutShippingCost = ref(0)
const cartDiscount = ref(0)

// Terms
const acceptTerms = ref(false)
const createAccount = ref(false)
const shipToDifferent = ref(false)

// Billing form data
const billing = reactive({
  firstName: '',
  lastName: '',
  company: '',
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postcode: '',
  phone: '',
  email: '',
  orderNotes: ''
})

// Airwallex state
let airwallex = null
let dropinElement = null
let paymentSession = null
const paymentLoading = ref(false)
const paymentError = ref('')

const subtotalAfterDiscount = computed(() => {
  return Math.max(0, cartStore.totalPrice - checkoutDiscount.value)
})

const totalWithShipping = computed(() => {
  return subtotalAfterDiscount.value + checkoutShippingCost.value
})

const handleLogin = () => {
  // Placeholder login
  if (loginEmail.value && loginPassword.value) {
    alert('Login feature coming soon!')
  } else {
    alert('Please enter your email and password.')
  }
}

const applyCouponCode = async () => {
  if (!checkoutCouponCode.value.trim()) {
    checkoutCouponMessage.value = 'Please enter a coupon code.'
    checkoutCouponSuccess.value = false
    return
  }

  checkoutCouponMessage.value = ''
  checkoutCouponSuccess.value = false

  // Coupon validation not available in ERP backend - show demo message
  checkoutCouponMessage.value = 'Coupon validation is not available yet.'
  checkoutCouponSuccess.value = false
}

const increaseItemQty = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseItemQty = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = (itemId) => {
  cartStore.removeFromCart(itemId)
}

const updateCheckoutShipping = () => {
  checkoutShippingCost.value = checkoutShipping.value === 'flat' ? 10.00 : 0
}

function validateBilling() {
  return (
    billing.firstName &&
    billing.lastName &&
    billing.country &&
    billing.addressLine1 &&
    billing.city &&
    billing.state &&
    billing.postcode &&
    billing.phone &&
    billing.email
  )
}

async function initAirwallexDropin() {
  paymentLoading.value = true
  paymentError.value = ''

  try {
    if (typeof window.Airwallex === 'undefined') {
      throw new Error('Airwallex SDK not loaded.')
    }

    airwallex = window.Airwallex

    if (!validateBilling()) {
      paymentLoading.value = false
      paymentError.value = 'Please fill in all required billing fields before proceeding to payment.'
      return
    }

    const totalAmount = totalWithShipping.value

    const response = await axios.post(`${API_BASE}/api/v1/payments`, {
      amount: totalAmount,
      currency: currencyStore.currency,
      order_id: null,
      user_id: null
    })

    if (!response.data) {
      throw new Error('Failed to create payment session')
    }

    paymentSession = response.data

    if (dropinElement) {
      try { dropinElement.unmount() } catch (e) { /* ignore */ }
      dropinElement = null
    }

    await nextTick()

    dropinElement = airwallex.createElement('dropin', {
      intent: {
        id: paymentSession.paymentIntentId,
        client_secret: paymentSession.clientSecret
      },
      layout: 'tabs',
      showSavePaymentMethod: false,
      style: {
        theme: 'light',
        colors: {
          primary: '#000000',
          primaryText: '#ffffff',
          background: '#ffffff',
          error: '#dc3545'
        }
      }
    })

    dropinElement.mount('airwallex-dropin-container')

    dropinElement.on('ready', () => {
      paymentLoading.value = false
    })

    dropinElement.on('error', (event) => {
      paymentError.value = event.detail?.error?.message || 'Payment initialization failed.'
      paymentLoading.value = false
    })

  } catch (error) {
    paymentError.value = error.message || 'Failed to initialize payment.'
    paymentLoading.value = false
  }
}

function onPaymentMethodChange() {
  paymentError.value = ''
  paymentLoading.value = false

  if (selectedPayment.value !== 'airwallex' && dropinElement) {
    try { dropinElement.unmount() } catch (e) { /* ignore */ }
    dropinElement = null
    const container = document.getElementById('airwallex-dropin-container')
    if (container) container.innerHTML = ''
  }

  if (selectedPayment.value === 'airwallex') {
    nextTick(() => { initAirwallexDropin() })
  }
}

async function processPayment() {
  if (!validateBilling()) {
    paymentError.value = 'Please fill in all required billing fields.'
    return
  }

  if (!acceptTerms.value) {
    paymentError.value = 'Please accept the terms and conditions.'
    return
  }

  isProcessing.value = true
  paymentError.value = ''

  if (selectedPayment.value === 'airwallex') {
    await processAirwallexPayment()
  }

  isProcessing.value = false
}

async function processAirwallexPayment() {
  try {
    if (!dropinElement) {
      throw new Error('Payment element not initialized.')
    }

    const result = await dropinElement.confirm()

    if (result.status === 'success' || result.status === 'succeeded' || result.status === 'requires_capture') {
      const orderId = `JT-${Date.now().toString(36).toUpperCase()}`
      await finalizeOrder(orderId, 'airwallex', result.id)
    } else {
      throw new Error(result.error?.message || 'Payment was not successful.')
    }
  } catch (error) {
    paymentError.value = error.message || 'Payment failed. Please try again.'
  }
}


async function finalizeOrder(orderId, paymentMethod, transactionId) {
  const token = localStorage.getItem('authToken')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const orderData = {
    userId: user.id,
    shippingAddress: `${billing.addressLine1}, ${billing.city}, ${billing.state} ${billing.postcode}`,
    countryId: 1,
    currencyId: 1,
    items: cartStore.items.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }))
  }

  try {
    await axios.post(`${API_BASE}/api/v1/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (e) {
    console.warn('Order submission warning:', e.message)
  }

  orderNumber.value = orderId
  orderPlaced.value = true
  cartStore.clearCart()
  window.scrollTo(0, 0)
}

onBeforeUnmount(() => {
  if (dropinElement) {
    try { dropinElement.unmount() } catch (e) { /* ignore */ }
  }
})
</script>

<style scoped>
.airwallex-payment-section {
  padding: 0.5rem 0;
}
.airwallex-payment-section #airwallex-dropin-container {
  min-height: 200px;
}
.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 0.75rem 1.25rem;
}
</style>