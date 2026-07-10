import axios from 'axios'
import { API_BASE, authHeaders } from './apiConfig'

export async function getUserAddresses(userId) {
  if (!userId) return []
  const res = await axios.get(`${API_BASE}/api/v1/users/${userId}/addresses`, {
    headers: authHeaders()
  })
  return Array.isArray(res.data) ? res.data : []
}
