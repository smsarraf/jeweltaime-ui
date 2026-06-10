<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">Checkout</h1>
      <div class="checkout-wrapper">
        <div class="checkout-form">
          <h3>Shipping Information</h3>
          <form @submit.prevent="submitOrder">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="form.firstName" type="text" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input v-model="form.lastName" type="text" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="form.phone" type="tel" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Address</label>
              <input v-model="form.address" type="text" class="form-control" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input v-model="form.city" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label>State</label>
                <input v-model="form.state" type="text" class="form-control" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Zip Code</label>
                <input v-model="form.zip" type="text" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Country</label>
                <input v-model="form.country" type="text" class="form-control" required>
              </div>
            </div>
            <h3>Payment Information</h3>
            <div class="form-group">
              <label>Card Number</label>
              <input v-model="form.cardNumber" type="text" placeholder="1234 5678 9012 3456" class="form-control" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input v-model="form.expiry" type="text" placeholder="MM/YY" class="form-control" required>
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input v-model="form.cvv" type="text" placeholder="123" class="form-control" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg">Complete Order</button>
          </form>
        </div>
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-items">
            <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>£{{ item.price * item.quantity }}</span>
            </div>
          </div>
          <div class="summary-total">
            <span>Total:</span>
            <span>£{{ cartStore.cartTotal }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  cardNumber: '',
  expiry: '',
  cvv: ''
})

const submitOrder = () => {
  alert('Order placed successfully! Thank you for your purchase.')
  cartStore.clearCart()
  router.push('/orders')
}
</script>

<style scoped>
.checkout-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 40px;
}

.checkout-wrapper {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.checkout-form h3 {
  font-size: 1.3rem;
  margin-top: 30px;
  margin-bottom: 20px;
}

.checkout-form h3:first-child {
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.btn-lg {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  margin-top: 20px;
}

.order-summary {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  height: fit-content;
}

.summary-items {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .checkout-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
