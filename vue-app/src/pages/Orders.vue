<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">My Orders</h1>
      <div v-if="userStore.orders.length > 0" class="orders-list">
        <div v-for="order in userStore.orders" :key="order.id" class="order-card">
          <div class="order-header">
            <h3>Order {{ order.id }}</h3>
            <span :class="['order-status', order.status.toLowerCase()]">{{ order.status }}</span>
          </div>
          <div class="order-details">
            <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
            <p><strong>Items:</strong> {{ order.items.length }}</p>
            <p><strong>Total:</strong> {{ currencyStore.formatPrice(order.total) }}</p>
          </div>
          <div class="order-items">
            <h5>Items:</h5>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} (x{{ item.quantity }}) - {{ currencyStore.formatPrice(item.price) }}
              </li>
            </ul>
          </div>
          <router-link :to="`/orders/${order.id}`" class="btn btn-secondary">View Details</router-link>
        </div>
      </div>
      <div v-else class="no-orders">
        <p>You haven't placed any orders yet.</p>
        <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useCurrencyStore } from '../stores/currencyStore'

const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.orders-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 40px;
}

.orders-list {
  max-width: 900px;
  margin: 0 auto;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.order-header h3 {
  margin: 0;
}

.order-status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.order-status.delivered {
  background-color: #d4edda;
  color: #155724;
}

.order-status.processing {
  background-color: #fff3cd;
  color: #856404;
}

.order-status.pending {
  background-color: #d1ecf1;
  color: #0c5460;
}

.order-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px 0;
}

.order-items {
  margin-bottom: 20px;
}

.order-items h5 {
  margin-top: 0;
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-items li {
  padding: 8px 0;
  color: #666;
}

.no-orders {
  text-align: center;
  padding: 60px 20px;
}

.btn-secondary {
  background-color: #666;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #444;
}
</style>