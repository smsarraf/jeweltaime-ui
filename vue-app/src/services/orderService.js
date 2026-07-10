import axios from 'axios'
import { API_BASE, authHeaders } from './apiConfig'

export async function createOrder(payload) {
  const res = await axios.post(`${API_BASE}/api/v1/orders`, payload, {
    headers: authHeaders()
  })
  return res.data || {}
}

export async function getOrdersByUser(userId, params = { page: 0, size: 50, sort: ['createdAt,desc'] }) {
  if (!userId) return []
  const res = await axios.get(`${API_BASE}/api/v1/orders/user/${userId}`, {
    headers: authHeaders(),
    params
  })
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.data?.content)) return res.data.content
  return []
}

export async function getOrderById(orderId) {
  const res = await axios.get(`${API_BASE}/api/v1/orders/${orderId}`, {
    headers: authHeaders()
  })
  return res.data || null
}

export async function updateOrderStatus(orderId, status) {
  const res = await axios.patch(`${API_BASE}/api/v1/orders/${orderId}/status`, null, {
    headers: authHeaders(),
    params: { status }
  })
  return res.data || null
}
