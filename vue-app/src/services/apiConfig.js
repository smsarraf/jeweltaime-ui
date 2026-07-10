const runtimeApiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : null

export const API_BASE = runtimeApiBase || 'http://localhost:8081'

export function authHeaders() {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.id || user.userId || null
  } catch {
    return null
  }
}
