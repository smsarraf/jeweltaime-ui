import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
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

    // Normalize a wishlist entry (server or local) into a consistent shape
    normalizeItem(raw) {
      if (!raw || typeof raw !== 'object') return null
      const productId = raw.productId ?? raw.id ?? raw._id ?? null
      return {
        id: productId,
        productId,
        wishlistEntryId: raw.id ?? null,
        name: raw.productName ?? raw.name ?? '',
        price: Number(raw.productPrice ?? raw.price ?? 0),
        image: raw.productImage ?? raw.image ?? '',
        slug: raw.productSlug ?? raw.slug ?? '',
        category: raw.productCategory ?? raw.category ?? ''
      }
    },

    // Extract an array of items from various response shapes
    extractItems(payload) {
      const rows = Array.isArray(payload)
        ? payload
        : (Array.isArray(payload?.data) ? payload.data : [])
      return rows.map(row => this.normalizeItem(row)).filter(Boolean)
    },

    setItems(payload) {
      this.items = this.extractItems(payload)
      this.wishlistIds = new Set(this.items.map(item => item.productId))
      this.saveLocalWishlist()
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
          this.items = (Array.isArray(items) ? items : []).map(item => this.normalizeItem(item)).filter(Boolean)
          this.wishlistIds = new Set(this.items.map(item => item.productId))
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
        const response = await axios.get(`${API_BASE}/api/v1/wishlist`, {
          headers: this.getAuthHeaders()
        })
        this.setItems(response.data)
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid — fallback to local
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          localStorage.removeItem('roles')
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
          await axios.delete(`${API_BASE}/api/v1/wishlist/remove/${productId}`, {
            headers: this.getAuthHeaders()
          })
          await this.fetchWishlist()
          return false
        } catch (error) {
          console.error('Remove from wishlist error:', error.message)
          return null
        }
      } else {
        // Add to wishlist — uses AddToWishlistRequest schema (flat body)
        try {
          await axios.post(`${API_BASE}/api/v1/wishlist/add`, {
            productId,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            productSlug: product.slug,
            productCategory: product.category
          }, {
            headers: this.getAuthHeaders()
          })
          await this.fetchWishlist()
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