import { defineStore } from 'pinia'

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    items: [],
    notes: '',
    shippingAddressText: '',
    billingAddressText: '',
    currencyId: 1,
    loading: false,
    error: null,
    // Structured shipping address
    shippingAddressMode: 'freeText', // 'company' | 'manual' | 'freeText'
    companyAddress: null, // { companyName, addressLine1, countryId, stateId, cityId }
    manualShippingAddress: {
      street: '',
      cityId: '',
      stateId: '',
      countryId: '',
      zipCode: ''
    }
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    subtotal: (state) => state.items.reduce((sum, item) => {
      const quantity = item.quantity || 1
      const price = Number(item.retailUnitPrice || 0)
      return sum + (price * quantity)
    }, 0)
  },
  actions: {
    getItemKey(product) {
      return product.variantId ? `${product.productId}-v${product.variantId}` : String(product.productId)
    },
    addToQuote(product) {
      const key = this.getItemKey(product)
      const existing = this.items.find(item => this.getItemKey(item) === key)
      if (existing) {
        existing.quantity += product.quantity || 1
        if (product.notes !== undefined) existing.notes = product.notes || ''
      } else {
        this.items.push({
          productId: product.productId,
          productName: product.productName,
          productSku: product.productSku,
          variantId: product.variantId || null,
          variantName: product.variantName || null,
          quantity: product.quantity || 1,
          retailUnitPrice: product.retailUnitPrice || product.price || 0,
          quotedUnitPrice: null,
          notes: product.notes || ''
        })
      }
    },
    removeFromQuote(productId, variantId = null) {
      const targetKey = variantId ? `${productId}-v${variantId}` : String(productId)
      this.items = this.items.filter(item => this.getItemKey(item) !== targetKey)
    },
    updateQuantity(productId, quantity, variantId = null) {
      const item = this.items.find(item => {
        if (variantId) {
          return item.productId === productId && item.variantId === variantId
        }
        return item.productId === productId && !item.variantId
      })
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    },
    updateItemNotes(productId, notes, variantId = null) {
      const item = this.items.find(item => {
        if (variantId) {
          return item.productId === productId && item.variantId === variantId
        }
        return item.productId === productId && !item.variantId
      })
      if (item) {
        item.notes = notes
      }
    },
    setShippingAddressMode(mode) {
      this.shippingAddressMode = mode
    },
    setManualShippingAddress(address) {
      this.manualShippingAddress = { ...this.manualShippingAddress, ...address }
    },
    setCompanyAddress(address) {
      this.companyAddress = address
    },
    buildShippingAddressText() {
      if (this.shippingAddressMode === 'company' && this.companyAddress) {
        const { addressLine1, countryId, stateId, cityId } = this.companyAddress
        const parts = [addressLine1, cityId, stateId, countryId].filter(Boolean)
        return parts.join(', ')
      }
      if (this.shippingAddressMode === 'manual') {
        const { street, cityId, stateId, countryId, zipCode } = this.manualShippingAddress
        const parts = [street, cityId, stateId, countryId, zipCode].filter(Boolean)
        return parts.join(', ')
      }
      return this.shippingAddressText
    },
    clearQuote() {
      this.items = []
      this.notes = ''
      this.shippingAddressText = ''
      this.billingAddressText = ''
      this.currencyId = 1
      this.error = null
      this.shippingAddressMode = 'freeText'
      this.companyAddress = null
      this.manualShippingAddress = {
        street: '',
        cityId: '',
        stateId: '',
        countryId: '',
        zipCode: ''
      }
    },
    setLoading(value) {
      this.loading = value
    },
    setError(error) {
      this.error = error
      this.loading = false
    }
  }
})