import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'
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

        // Fetch from ERP API
        const response = await axios.get(`${API_BASE}/api/v1/locations/countries`, { timeout: 8000 })
        if (response.data) {
          const countries = Array.isArray(response.data) ? response.data : []
          this._setData(countries)
          this.loaded = true
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ countries }))
        }
      } catch (error) {
        console.warn('Failed to load countries:', error.message)
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

    async loadStates(countryId) {
      if (!countryId) return
      // Only fetch if not already loaded
      if (this.statesByCountry[countryId] && this.statesByCountry[countryId].length > 0) return

      try {
        const response = await axios.get(`${API_BASE}/api/v1/locations/countries/${countryId}/states`, { timeout: 5000 })
        if (response.data) {
          const states = (Array.isArray(response.data) ? response.data : []).map(s => ({ id: s.id, name: s.name, stateCode: s.stateCode }))
          this.statesByCountry[countryId] = states
          // Update cache
          this._updateCache()
        }
      } catch (error) {
        console.warn('Failed to load states:', error.message)
      }
    },

    async loadCities(stateId) {
      if (!stateId) return
      if (this.citiesByState[stateId] && this.citiesByState[stateId].length > 0) return

      try {
        const response = await axios.get(`${API_BASE}/api/v1/locations/states/${stateId}/cities`, { timeout: 5000 })
        if (response.data) {
          const cities = (Array.isArray(response.data) ? response.data : []).map(c => ({ id: c.id, name: c.name, postalCodeRegex: c.postalCodeRegex }))
          this.citiesByState[stateId] = cities
          this._updateCache()
        }
      } catch (error) {
        console.warn('Failed to load cities:', error.message)
      }
    },

    _updateCache() {
      try {
        const data = { countries: [] }
        this.countries.forEach(c => {
          const country = { id: c.id, name: c.name, taxRate: Number(c.taxRate ?? 0) }
          const states = this.statesByCountry[c.id]
          if (states && states.length > 0) {
            country.states = states.map(s => {
              const state = { id: s.id, name: s.name }
              const cities = this.citiesByState[s.id]
              if (cities && cities.length > 0) {
                state.cities = cities.map(ct => ({ id: ct.id, name: ct.name }))
              }
              return state
            })
          }
          data.countries.push(country)
        })
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(data))
      } catch (e) { /* ignore */ }
    },

    async _refreshInBackground() {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/locations/countries`, { timeout: 5000 })
        if (response.data) {
          const countries = Array.isArray(response.data) ? response.data : []
          this._clearStatesAndCities()
          this._setData(countries)
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ countries }))
        }
      } catch (e) { /* silent */ }
    },

    _clearStatesAndCities() {
      this.statesByCountry = {}
      this.citiesByState = {}
    },

    _setData(countries) {
      this.countries = countries.map(c => ({ id: c.id, name: c.name, taxRate: Number(c.taxRate ?? 0) }))
      // If API returned full tree data, use it; otherwise lazy load will fill in
      countries.forEach(country => {
        if (country.states && Array.isArray(country.states) && country.states.length > 0) {
          this.statesByCountry[country.id] = country.states.map(s => ({ id: s.id, name: s.name, stateCode: s.stateCode }))
          country.states.forEach(state => {
            if (state.cities && Array.isArray(state.cities) && state.cities.length > 0) {
              this.citiesByState[state.id] = state.cities.map(c => ({ id: c.id, name: c.name }))
            }
          })
        }
      })
      this.loaded = true
    },

    clearCache() {
      this.countries = []
      this.statesByCountry = {}
      this.citiesByState = {}
      this.loaded = false
      localStorage.removeItem(LOCATION_CACHE_KEY)
    }
  }
})