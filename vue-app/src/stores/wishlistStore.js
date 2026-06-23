import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const WISHLIST_KEY = 'jeweltaime_wishlist'

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

    // Load wishlist from localStorage (for guest users)
    loadLocalWishlist() {
      try {
        const cached = localStorage.getItem(WISHLIST_KEY)
        if (cached) {
          const items = JSON.parse(cached)
          this.items = Array.isArray(items) ? items : []
          this.wishlistIds = new Set(this.items.map(item => item.id))
        }
      } catch (e) {
        this.items = []
        this.wishlistIds = new Set()
      }
    },

    // Save wishlist to localStorage
    saveLocalWishlist() {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.items))
    },

    // Fetch all wishlist items from server (logged-in users)
    async fetchWishlist() {
      if (!this.isLoggedIn()) {
        this.loadLocalWishlist()
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
          this.saveLocalWishlist()
        }
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid — fallback to local
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          this.loadLocalWishlist()
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