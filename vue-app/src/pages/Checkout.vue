<template>
  <main>
      <header class="pageMainHead d-flex position-relative bgCover w-100 text-white" style="background-image: url(https://placehold.co/1920x300);">
          <div class="align-self-center text-center w-100">
              <div class="container">
                  <h1 class="pageHeading mb-3">Checkout</h1>
                  <nav aria-label="breadcrumb">
                      <ol class="breadcrumb d-flex justify-content-center mb-0">
                          <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
                          <li class="breadcrumb-item"><router-link to="/cart">Cart</router-link></li>
                          <li class="breadcrumb-item active" aria-current="page">Checkout</li>
                      </ol>
                  </nav>
              </div>
          </div>
      </header>

      <section class="checkoutPageSection py-8 py-lg-12">
          <div class="container">
              <div v-if="cartStore.items.length === 0" class="text-center py-10">
                  <h3 class="mb-4">Your cart is empty. Cannot proceed to checkout.</h3>
                  <router-link to="/products" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Return to Shop</router-link>
              </div>
              <div v-else-if="orderPlaced" class="text-center py-10">
                  <i class="fa-solid fa-circle-check text-success" style="font-size: 5rem; margin-bottom: 2rem;"></i>
                  <h2 class="mb-3">Order Placed Successfully!</h2>
                  <p class="mb-5">Thank you for your purchase. Your order number is #{{ Math.floor(Math.random() * 1000000) }}.</p>
                  <router-link to="/" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Back to Home</router-link>
              </div>
              <div v-else class="row">
                  <div class="col-12 col-lg-7 mb-6 mb-lg-0">
                      <div class="checkoutFormWrap">
                          <h3 class="mb-4 fw-normal">Billing & Shipping Details</h3>
                          <form @submit.prevent="placeOrder">
                              <div class="row g-3">
                                  <div class="col-md-6">
                                      <label class="form-label">First Name *</label>
                                      <input type="text" class="form-control" required>
                                  </div>
                                  <div class="col-md-6">
                                      <label class="form-label">Last Name *</label>
                                      <input type="text" class="form-control" required>
                                  </div>
                                  <div class="col-12">
                                      <label class="form-label">Company Name (Optional)</label>
                                      <input type="text" class="form-control">
                                  </div>
                                  <div class="col-12">
                                      <label class="form-label">Country / Region *</label>
                                      <select class="form-select" required>
                                          <option value="">Select a country / region...</option>
                                          <option value="US">United States</option>
                                          <option value="UK">United Kingdom</option>
                                          <option value="AU">Australia</option>
                                          <option value="CA">Canada</option>
                                      </select>
                                  </div>
                                  <div class="col-12">
                                      <label class="form-label">Street Address *</label>
                                      <input type="text" class="form-control mb-2" placeholder="House number and street name" required>
                                      <input type="text" class="form-control" placeholder="Apartment, suite, unit, etc. (optional)">
                                  </div>
                                  <div class="col-12">
                                      <label class="form-label">Town / City *</label>
                                      <input type="text" class="form-control" required>
                                  </div>
                                  <div class="col-md-6">
                                      <label class="form-label">State / County *</label>
                                      <input type="text" class="form-control" required>
                                  </div>
                                  <div class="col-md-6">
                                      <label class="form-label">Postcode / ZIP *</label>
                                      <input type="text" class="form-control" required>
                                  </div>
                                  <div class="col-md-6">
                                      <label class="form-label">Phone *</label>
                                      <input type="tel" class="form-control" required>
                                  </div>
                                  <div class="col-md-6">
                                      <label class="form-label">Email Address *</label>
                                      <input type="email" class="form-control" required>
                                  </div>
                                  <div class="col-12 mt-4">
                                      <h3 class="mb-3 fw-normal">Additional Information</h3>
                                      <label class="form-label">Order Notes (Optional)</label>
                                      <textarea class="form-control" rows="4" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                                  </div>
                              </div>
                              <button type="submit" id="submitFormBtn" class="d-none"></button>
                          </form>
                      </div>
                  </div>
                  <div class="col-12 col-lg-5">
                      <div class="orderSummaryBlock p-4 p-md-5 border bg-light">
                          <h3 class="mb-4 fw-normal">Your Order</h3>
                          <div class="table-responsive">
                              <table class="table border-bottom mb-4">
                                  <thead>
                                      <tr>
                                          <th class="fw-normal border-top-0 px-0">Product</th>
                                          <th class="fw-normal border-top-0 px-0 text-end">Subtotal</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr v-for="item in cartStore.items" :key="item.id">
                                          <td class="px-0 text-muted">{{ item.name }} × {{ item.quantity }}</td>
                                          <td class="px-0 text-end">£{{ (item.price * item.quantity).toFixed(2) }}</td>
                                      </tr>
                                  </tbody>
                                  <tfoot>
                                      <tr>
                                          <th class="fw-normal px-0">Subtotal</th>
                                          <td class="px-0 text-end">£{{ cartStore.totalPrice.toFixed(2) }}</td>
                                      </tr>
                                      <tr>
                                          <th class="fw-normal px-0">Shipping</th>
                                          <td class="px-0 text-end">Free Shipping</td>
                                      </tr>
                                      <tr>
                                          <th class="fw-semibold px-0 fs-5 border-bottom-0 pt-3">Total</th>
                                          <td class="fw-semibold px-0 text-end fs-5 border-bottom-0 pt-3">£{{ cartStore.totalPrice.toFixed(2) }}</td>
                                      </tr>
                                  </tfoot>
                              </table>
                          </div>
                          
                          <div class="paymentMethods mb-4">
                              <h4 class="mb-3 fw-normal fs-5">Payment Method</h4>
                              <div class="form-check mb-2">
                                  <input class="form-check-input" type="radio" name="paymentMethod" id="directBank" checked>
                                  <label class="form-check-label fw-medium" for="directBank">
                                      Direct Bank Transfer
                                  </label>
                                  <div class="mt-2 text-muted small">
                                      Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                                  </div>
                              </div>
                              <div class="form-check mb-2 mt-3">
                                  <input class="form-check-input" type="radio" name="paymentMethod" id="checkPayment">
                                  <label class="form-check-label fw-medium" for="checkPayment">
                                      Check Payments
                                  </label>
                              </div>
                              <div class="form-check mt-3">
                                  <input class="form-check-input" type="radio" name="paymentMethod" id="cashDelivery">
                                  <label class="form-check-label fw-medium" for="cashDelivery">
                                      Cash on Delivery
                                  </label>
                              </div>
                              <div class="form-check mt-3">
                                  <input class="form-check-input" type="radio" name="paymentMethod" id="paypal">
                                  <label class="form-check-label fw-medium d-flex align-items-center" for="paypal">
                                      PayPal <img src="/images/payment-gateway.png" alt="PayPal" class="ms-2" style="height: 24px;">
                                  </label>
                              </div>
                          </div>
                          
                          <p class="text-muted small mb-4">
                              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                          </p>
                          
                          <button class="btn btn-dark w-100 py-3 text-uppercase fw-medium" @click="triggerSubmit">Place Order</button>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()
const orderPlaced = ref(false)

const triggerSubmit = () => {
  document.getElementById('submitFormBtn').click()
}

const placeOrder = () => {
  orderPlaced.value = true
  cartStore.clearCart()
  window.scrollTo(0, 0)
}
</script>
