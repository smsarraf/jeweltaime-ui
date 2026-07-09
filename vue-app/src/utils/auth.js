import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'
export const AUTH_CHANGED_EVENT = 'auth-changed'

// Track if we're currently refreshing to avoid infinite loops
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

/**
 * Setup axios interceptors for automatic token refresh
 */
export function setupAuthInterceptor() {
  // Request interceptor - attach auth token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - handle 401 and refresh token
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Skip refresh for login/register/refresh-token endpoints
        if (originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh-token')) {
          return Promise.reject(error)
        }

        if (isRefreshing) {
          // Queue this request while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axios(originalRequest)
          }).catch(err => {
            return Promise.reject(err)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          isRefreshing = false
          // No refresh token - redirect to login
          clearAuth()
          window.location.href = '/signin'
          return Promise.reject(error)
        }

        try {
          const response = await axios.post(`${API_BASE}/api/v1/auth/refresh-token`, refreshToken)

          if (response.data && response.data.access_token) {
            const newToken = response.data.access_token
            localStorage.setItem('authToken', newToken)
            if (response.data.refresh_token) {
              localStorage.setItem('refreshToken', response.data.refresh_token)
            }

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            processQueue(null, newToken)
            
            return axios(originalRequest)
          } else {
            throw new Error('Invalid refresh response')
          }
        } catch (refreshError) {
          processQueue(refreshError, null)
          // Refresh failed - clear tokens and redirect to login
          clearAuth()
          window.location.href = '/signin'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}

/**
 * Get current auth token
 */
export function getToken() {
  return localStorage.getItem('authToken')
}

/**
 * Get current refresh token
 */
export function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

/**
 * Clear all auth data
 */
export function clearAuth() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('roles')
  notifyAuthChanged()
}

export function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
  }
}