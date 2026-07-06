import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    rootCategories: [],
    flatCategories: {},
    isLoading: false,
    loaded: false
  }),
  getters: {
    getRootCategories: (state) => state.rootCategories,
    getCategoryById: (state) => (id) => state.flatCategories[id] || null,
    getCategoryBySlug: (state) => (slug) => {
      return Object.values(state.flatCategories).find(c => c.slug === slug) || null
    }
  },
  actions: {
    _setData(categories) {
      this.rootCategories = categories
      // Build flat lookup map for O(1) ID-based access
      const flat = {}
      function walk(cats) {
        cats.forEach(cat => {
          flat[cat.id] = cat
          if (cat.children && cat.children.length > 0) {
            walk(cat.children)
          }
        })
      }
      walk(categories)
      this.flatCategories = flat
      this.loaded = true
    },
    async loadCategories() {
      // Already loading — wait for it
      if (this.isLoading) return

      this.isLoading = true

      try {
        const rootRes = await axios.get(`${API_BASE}/api/v1/categories/root`, { timeout: 8000 })
        if (!rootRes.data || !Array.isArray(rootRes.data)) {
          throw new Error('Invalid categories response')
        }

        const categoriesWithChildren = await Promise.all(
          rootRes.data.map(async (cat) => {
            try {
              const subRes = await axios.get(`${API_BASE}/api/v1/categories/${cat.id}/all-subcategories`, { timeout: 5000 })
              return {
                id: cat.id,
                name: cat.name,
                slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
                thumbnailUrl: cat.thumbnailUrl || '',
                bannerUrl: cat.bannerUrl || '',
                children: (subRes.data?.childCats || []).map(child => ({
                  id: child.id,
                  name: child.name,
                  slug: child.slug || child.name.toLowerCase().replace(/\s+/g, '-'),
                  thumbnailUrl: child.thumbnailUrl || '',
                  bannerUrl: child.bannerUrl || ''
                }))
              }
            } catch {
              return {
                id: cat.id,
                name: cat.name,
                slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
                thumbnailUrl: cat.thumbnailUrl || '',
                bannerUrl: cat.bannerUrl || '',
                children: []
              }
            }
          })
        )

        this._setData(categoriesWithChildren)
      } catch (e) {
        console.warn('Failed to fetch categories:', e.message)
        // Fallback hardcoded data if API fails
        if (!this.loaded || this.rootCategories.length === 0) {
          this._setData(this._fallbackCategories())
        }
      } finally {
        this.isLoading = false
      }
    },
    _fallbackCategories() {
      return [
        { id: 1, name: 'Necklaces', slug: 'necklaces', thumbnailUrl: '', bannerUrl: '', children: [] },
        { id: 2, name: 'Rings', slug: 'rings', thumbnailUrl: '', bannerUrl: '', children: [] },
        { id: 3, name: 'Bracelets', slug: 'bracelets', thumbnailUrl: '', bannerUrl: '', children: [] },
        { id: 4, name: 'Earrings', slug: 'earrings', thumbnailUrl: '', bannerUrl: '', children: [] },
        { id: 5, name: 'Charms & Dangles', slug: 'charms-dangles', thumbnailUrl: '', bannerUrl: '', children: [] },
        { id: 6, name: 'Watches', slug: 'watches', thumbnailUrl: '', bannerUrl: '', children: [] }
      ]
    },
    clearCache() {
      this.rootCategories = []
      this.flatCategories = {}
      this.loaded = false
    }
  }
})