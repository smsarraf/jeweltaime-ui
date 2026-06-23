import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const LOCATION_CACHE_KEY = 'jeweltaime_locations'

export const useLocationStore = defineStore('location', {
  state: () => ({
    countries: [],
    statesByCountry: {},
    citiesByState: {},
    isLoading: false,
    loaded: false
  }),
  getters: {
    getCountries: (state) => state.countries,
    getStates: (state) => (countryId) => state.statesByCountry[countryId] || [],
    getCities: (state) => (stateId) => state.citiesByState[stateId] || []
  },
  actions: {
    async loadAllLocations() {
      if (this.loaded || this.isLoading) return

      this.isLoading = true
      try {
        // Try localStorage cache first (silent load)
        const cached = localStorage.getItem(LOCATION_CACHE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed && Array.isArray(parsed.countries)) {
              this._setData(parsed.countries)
              this.isLoading = false
              this.loaded = true
              // Still try to refresh in background
              this._refreshInBackground()
              return
            }
          } catch (e) { /* ignore bad cache */ }
        }

        // Fetch from legacy API (no ERP equivalent yet)
        const response = await axios.get(`${API_BASE}/api/locations/all`, { timeout: 8000 })
        if (response.data && response.data.success) {
          const data = response.data.data
          this._setData(data)
          this.loaded = true
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(data))
        }
      } catch (error) {
        console.warn('Failed to load locations:', error.message)
        // Try to use stale cache as last resort
        const cached = localStorage.getItem(LOCATION_CACHE_KEY)
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            if (parsed && Array.isArray(parsed.countries)) {
              this._setData(parsed.countries)
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
        const response = await axios.get(`${API_BASE}/api/locations/all`, { timeout: 5000 })
        if (response.data && response.data.success) {
          const data = response.data.data
          this._setData(data)
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(data))
        }
      } catch (e) { /* silent */ }
    },

    _setData(countries) {
      this.countries = countries.map(c => ({ id: c.id, name: c.name }))
      this.statesByCountry = {}
      this.citiesByState = {}
      countries.forEach(country => {
        this.statesByCountry[country.id] = (country.states || []).map(s => ({ id: s.id, name: s.name }))
        ;(country.states || []).forEach(state => {
          this.citiesByState[state.id] = (state.cities || []).map(c => ({ id: c, name: c }))
        })
      })
      this.loaded = true
    },

    clearCache() {
      this.countries = []
      this.statesByCountry = {}
      this.citiesByState = {}
      this.loaded = false
      localStorage.removeItem('locationCache')
    }
  }
})