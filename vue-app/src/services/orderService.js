import axios from 'axios'
import { API_BASE, authHeaders, isAuthenticated } from './apiConfig'

/**
 * Creates an order via POST /api/v1/orders.
 *
 * Logged-in flow:
 *   - payload.customerId is set (from getCurrentUserId)
 *   - Authorization header with Bearer token is attached
 *   - userAddressId is used for saved addresses
 *
 * Guest flow:
 *   - payload.guestInfo: { email, fullName } is set
 *   - payload.shippingAddress (manual) is used
 *   - No Authorization header (public endpoint)
 */
export async function createOrder(payload) {
  const headers = isAuthenticated() ? authHeaders() : {}
  const res = await axios.post(`${API_BASE}/api/v1/orders`, payload, { headers })
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
