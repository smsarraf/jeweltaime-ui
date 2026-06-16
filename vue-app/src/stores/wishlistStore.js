import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    isLoading: false,
    wishlistIds: new Set()
  }),
  getters: {
    totalItems: (state) => state.items.length,
    isInWishlist: (state) => (productId) => state.wishlistIds.has(productId)
  },
  actions: {
    // Helper to get auth headers
    getAuthHeaders() {
      const token = localStorage.getItem('authToken')
      return token ? { Authorization: `Bearer ${token}` } : {}
    },

    // Check if user is logged in
    isLoggedIn() {
      return !!localStorage.getItem('authToken')
    },

    // Fetch all wishlist items from server
    async fetchWishlist() {
      if (!this.isLoggedIn()) {
        this.items = []
        this.wishlistIds = new Set()
        return
      }

      this.isLoading = true
      try {
        const response = await axios.get(`${API_BASE}/api/wishlist`, {
          headers: this.getAuthHeaders()
        })
        if (response.data.success) {
          this.items = response.data.data || []
          this.wishlistIds = new Set(this.items.map(item => item.id))
        }
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid — clear auth
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          this.items = []
          this.wishlistIds = new Set()
        }
        console.warn('Fetch wishlist error:', error.message)
      } finally {
        this.isLoading = false
      }
    },

    // Toggle product in wishlist — returns true if added, false if removed
    async toggleWishlist(product) {
      if (!this.isLoggedIn()) {
        // Not logged in — redirect to signin
        window.location.href = '/signin'
        return null
      }

      const productId = product.id || product._id
      const inWishlist = this.wishlistIds.has(productId)

      if (inWishlist) {
        // Remove from wishlist
        try {
          const response = await axios.delete(`${API_BASE}/api/wishlist/remove/${productId}`, {
            headers: this.getAuthHeaders()
          })
          if (response.data.success) {
            this.items = response.data.data || []
            this.wishlistIds = new Set(this.items.map(item => item.id))
          }
          return false
        } catch (error) {
          console.error('Remove from wishlist error:', error.message)
          return null
        }
      } else {
        // Add to wishlist
        try {
          const response = await axios.post(`${API_BASE}/api/wishlist/add`, {
            product: {
              id: productId,
              name: product.name,
              price: product.price,
              image: product.image,
              slug: product.slug,
              category: product.category
            }
          }, {
            headers: this.getAuthHeaders()
          })
          if (response.data.success) {
            this.items = response.data.data || []
            this.wishlistIds = new Set(this.items.map(item => item.id))
          }
          return true
        } catch (error) {
          console.error('Add to wishlist error:', error.message)
          return null
        }
      }
    },

    // Clear wishlist (on logout)
    clearWishlist() {
      this.items = []
      this.wishlistIds = new Set()
    }
  }
})