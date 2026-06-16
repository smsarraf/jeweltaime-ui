<template>
  <div class="order-detail-page" v-if="order">
    <div class="container">
      <router-link to="/orders" class="back-link">← Back to Orders</router-link>
      <h1 class="page-title">Order {{ order.id }}</h1>
      <div class="order-info-wrapper">
        <div class="order-status-section">
          <h3>Order Status</h3>
          <div :class="['status-badge', order.status.toLowerCase()]">{{ order.status }}</div>
          <p>Order placed on {{ formatDate(order.date) }}</p>
        </div>
        <div class="order-summary">
          <h3>Order Summary</h3>
          <table class="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ currencyStore.formatPrice(item.price) }}</td>
                <td>{{ currencyStore.formatPrice(item.price * item.quantity) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="order-total">
            <strong>Total: {{ currencyStore.formatPrice(order.total) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useCurrencyStore } from '../stores/currencyStore'

const route = useRoute()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const order = computed(() => {
  return userStore.getOrderById(route.params.id)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.order-detail-page {
  padding: 40px 0;
}

.back-link {
  color: #222;
  text-decoration: none;
  margin-bottom: 30px;
  display: inline-block;
}

.back-link:hover {
  text-decoration: underline;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 40px;
}

.order-info-wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

.order-status-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
}

.order-status-section h3 {
  margin-top: 0;
}

.status-badge {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 20px;
  font-weight: 600;
  margin: 15px 0;
}

.status-badge.delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.processing {
  background-color: #fff3cd;
  color: #856404;
}

.order-summary h3 {
  margin-top: 0;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-table th,
.order-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.order-table th {
  background-color: #f9f9f9;
  font-weight: 600;
}

.order-total {
  text-align: right;
  padding-top: 20px;
  border-top: 2px solid #222;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .order-info-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>