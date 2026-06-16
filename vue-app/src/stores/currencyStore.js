import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

// European country codes (ISO 3166-1 alpha-2)
const EUROPEAN_COUNTRIES = [
  'UK', 'GB', 'IE', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'LU',
  'AT', 'CH', 'DK', 'SE', 'NO', 'FI', 'IS', 'GR', 'PL', 'CZ', 'SK',
  'HU', 'RO', 'BG', 'HR', 'RS', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT',
  'AL', 'MK', 'BA', 'ME', 'XK', 'AD', 'MC', 'LI', 'SM', 'VA'
]

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'USD',
    symbol: '$',
    loading: false,
    determined: false
  }),

  getters: {
    /**
     * Format a price amount with the current currency symbol
     */
    formatPrice: (state) => {
      return (amount) => {
        return `${state.symbol}${Number(amount).toFixed(2)}`
      }
    },

    /**
     * Get the currency code for API calls
     */
    currencyCode: (state) => state.currency
  },

  actions: {
    /**
     * Determine currency based on user's country from their profile
     * Falls back to IP geolocation if no country is set
     */
    async determineCurrency() {
      if (this.determined || this.loading) return

      this.loading = true

      try {
        // First, try to get country from user profile
        const token = localStorage.getItem('authToken')
        if (token) {
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            const userId = user.id
            if (userId) {
              const response = await axios.get(`${API_BASE}/api/v1/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
              })
              if (response.data && response.data.profile) {
                // ERP user profile available - check for country info
                // For now, fall back to IP geolocation
              }
            }
          } catch (e) {
            // Profile fetch failed, fall back to IP geolocation
            console.warn('Could not fetch user profile for currency:', e.message)
          }
        }

        // Fallback: try IP geolocation
        await this.detectByIP()
      } catch (error) {
        console.warn('Currency detection failed, defaulting to USD:', error.message)
        this.setCurrency('USD')
      } finally {
        this.determined = true
        this.loading = false
      }
    },

    /**
     * Detect currency via IP geolocation using a free API
     */
    async detectByIP() {
      try {
        const response = await axios.get('https://ipapi.co/json/', { timeout: 5000 })
        if (response.data && response.data.country_code) {
          this.setCurrencyByCountry(response.data.country_code)
          return
        }
      } catch (e) {
        // IP geolocation failed, try fallback
        try {
          const resp = await axios.get('https://ipinfo.io/json', { timeout: 5000 })
          if (resp.data && resp.data.country) {
            this.setCurrencyByCountry(resp.data.country)
            return
          }
        } catch (e2) {
          // Both geolocation services failed
        }
      }
      // Default to USD
      this.setCurrency('USD')
    },

    /**
     * Set currency based on a country code (ISO 3166-1 alpha-2)
     * European countries -> EUR, everything else -> USD
     */
    setCurrencyByCountry(countryCode) {
      const code = countryCode.toUpperCase()
      const isEurope = EUROPEAN_COUNTRIES.includes(code)
      this.setCurrency(isEurope ? 'EUR' : 'USD')
    },

    /**
     * Set currency directly
     */
    setCurrency(currency) {
      this.currency = currency
      this.symbol = currency === 'EUR' ? '€' : '$'
    },

    /**
     * Reset the determination state (e.g., on logout)
     */
    reset() {
      this.currency = 'USD'
      this.symbol = '$'
      this.determined = false
      this.loading = false
    }
  }
})