import { ref } from 'vue'
import { getOrderById, getOrdersByUser, updateOrderStatus } from '../services/orderService'

export function useOrders() {
  const orders = ref([])
  const order = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function loadOrders(userId) {
    loading.value = true
    error.value = ''
    try {
      orders.value = await getOrdersByUser(userId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Unable to load orders right now.'
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadOrder(orderId) {
    loading.value = true
    error.value = ''
    try {
      order.value = await getOrderById(orderId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Unable to load order details.'
      order.value = null
    } finally {
      loading.value = false
    }
  }

  async function cancelOrder(orderId) {
    return updateOrderStatus(orderId, 'CANCELLED')
  }

  return {
    orders,
    order,
    loading,
    error,
    loadOrders,
    loadOrder,
    cancelOrder
  }
}
