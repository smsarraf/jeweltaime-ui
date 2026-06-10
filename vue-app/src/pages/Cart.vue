<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Shopping Cart</h1>
      <div v-if="cartStore.items.length > 0" class="cart-wrapper">
        <div class="cart-items">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartStore.items" :key="item.id">
                <td class="product-cell">
                  <img :src="item.image" :alt="item.name" class="product-thumb">
                  <div>
                    <p class="product-name">{{ item.name }}</p>
                  </div>
                </td>
                <td>£{{ item.price }}</td>
                <td>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    @change="cartStore.updateQuantity(item.id, item.quantity)"
                    min="1"
                    class="quantity-input"
                  >
                </td>
                <td>£{{ item.price * item.quantity }}</td>
                <td>
                  <button @click="cartStore.removeItem(item.id)" class="remove-btn">×</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>£{{ cartStore.cartTotal }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>£{{ cartStore.cartTotal }}</span>
          </div>
          <router-link to="/checkout" class="btn btn-primary btn-block">Proceed to Checkout</router-link>
          <router-link to="/products" class="btn btn-secondary btn-block">Continue Shopping</router-link>
        </div>
      </div>
      <div v-else class="empty-cart">
        <p>Your cart is empty.</p>
        <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 40px;
}

.cart-wrapper {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table th,
.cart-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.cart-table th {
  background-color: #f9f9f9;
  font-weight: 600;
}

.product-cell {
  display: flex;
  gap: 15px;
  align-items: center;
}

.product-thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  margin: 0;
  font-weight: 500;
}

.quantity-input {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #e74c3c;
  cursor: pointer;
  padding: 0;
}

.remove-btn:hover {
  color: #c0392b;
}

.cart-summary {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  height: fit-content;
}

.cart-summary h3 {
  margin-top: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.summary-row.total {
  font-weight: 600;
  font-size: 1.2rem;
  border-bottom: 2px solid #222;
}

.btn-block {
  width: 100%;
  display: block;
  text-align: center;
  padding: 12px;
  margin-top: 15px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-primary {
  background-color: #222;
  color: #fff;
}

.btn-secondary {
  background-color: transparent;
  color: #222;
  border: 1px solid #222;
}

.btn-block:hover {
  opacity: 0.8;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

@media (max-width: 768px) {
  .cart-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
