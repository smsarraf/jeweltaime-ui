import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const CACHE_KEY = 'jeweltaime_site_settings'

export const useSiteSettingsStore = defineStore('siteSettings', {
  state: () => ({
    settings: null,
    isLoading: false,
    loaded: false
  }),
  getters: {
    logo: (state) => state.settings?.logo || '',
    shortDescription: (state) => state.settings?.shortDescription || '',
    longDescription: (state) => state.settings?.longDescription || '',
    instagramLink: (state) => state.settings?.instagramLink || '',
    facebookLink: (state) => state.settings?.facebookLink || '',
    pinterestLink: (state) => state.settings?.pinterestLink || '',
    twitterLink: (state) => state.settings?.twitterLink || '',
    emailAddress: (state) => state.settings?.emailAddress || '',
    contactInfo: (state) => state.settings?.contactInfo || '',
    storeInfo: (state) => {
      try {
        const info = state.settings?.storeInfo
        return typeof info === 'string' ? JSON.parse(info) : info || {}
      } catch (e) { return {} }
    },
    freeShippingText: (state) => state.settings?.freeShippingText || '',
    returnText: (state) => state.settings?.returnText || '',
    googleMapLink: (state) => state.settings?.googleMapLink || ''
  },
  actions: {
    async loadSettings() {
      if (this.loaded || this.isLoading) return

      this.isLoading = true

      try {
        // Try localStorage cache first
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed && parsed.id) {
              this.settings = parsed
              this.loaded = true
              this.isLoading = false
              // Refresh in background
              this._refreshInBackground()
              return
            }
          } catch (e) { /* ignore bad cache */ }
        }

        // Fetch from ERP API
        const response = await axios.get(`${API_BASE}/api/v1/site-settings`, { timeout: 8000 })
        if (response.data && response.data.id) {
          this.settings = response.data
          this.loaded = true
          localStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
        }
      } catch (error) {
        console.warn('Failed to load site settings:', error.message)
        // Try stale cache as last resort
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed && parsed.id) {
              this.settings = parsed
              this.loaded = true
            }
          } catch (e) { /* ignore */ }
        }
      } finally {
        this.isLoading = false
      }
    },

    async _refreshInBackground() {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/site-settings`, { timeout: 5000 })
        if (response.data && response.data.id) {
          this.settings = response.data
          localStorage.setItem(CACHE_KEY, JSON.stringify(response.data))
        }
      } catch (e) { /* silent */ }
    },

    clearCache() {
      this.settings = null
      this.loaded = false
      localStorage.removeItem(CACHE_KEY)
    }
  }
})