import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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
        // Try to load from cache first
        const cached = localStorage.getItem('locationCache')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.countries) {
            this._setData(parsed)
            this.isLoading = false
            return
          }
        }

        const response = await axios.get(`${API_BASE}/api/locations/all`)
        if (response.data.success) {
          this._setData(response.data.data)
          // Cache in localStorage
          localStorage.setItem('locationCache', JSON.stringify({ countries: response.data.data, timestamp: Date.now() }))
        }
      } catch (error) {
        console.warn('Failed to load locations:', error.message)
      } finally {
        this.isLoading = false
      }
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