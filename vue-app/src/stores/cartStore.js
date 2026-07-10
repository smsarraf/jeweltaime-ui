import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.quantity || 1)), 0),
    addonsTotal: (state) => state.items.reduce((sum, item) => {
      const quantity = item.quantity || 1
      const giftBox = Number(item.giftBoxPriceUsd || 0) * quantity
      const giftCard = Number(item.giftCardPrice || 0) * quantity
      return sum + giftBox + giftCard
    }, 0),
    grandTotal: (state) => state.items.reduce((sum, item) => {
      const quantity = item.quantity || 1
      const unit = Number(item.price) || 0
      const addons = Number(item.giftBoxPriceUsd || 0) + Number(item.giftCardPrice || 0)
      return sum + ((unit + addons) * quantity)
    }, 0)
  },
  actions: {
    getItemKey(product) {
      return product.variantId ? `${product.id}-v${product.variantId}` : String(product.id)
    },
    addToCart(product) {
      const key = this.getItemKey(product)
      const existing = this.items.find(item => this.getItemKey(item) === key)
      if (existing) {
        existing.quantity += product.quantity || 1
        // Keep latest add-on choices if user adds same SKU again with new options
        if (product.giftBoxId !== undefined) {
          existing.giftBoxId = product.giftBoxId
          existing.giftBoxName = product.giftBoxName || ''
          existing.giftBoxPriceUsd = Number(product.giftBoxPriceUsd || 0)
        }
        if (product.giftCardId !== undefined) {
          existing.giftCardId = product.giftCardId
          existing.giftCardName = product.giftCardName || ''
          existing.giftCardPrice = Number(product.giftCardPrice || 0)
        }
        if (product.giftNote !== undefined) existing.giftNote = product.giftNote || ''
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1,
          category: product.category,
          variantId: product.variantId || null,
          variantName: product.variantName || null,
          sku: product.sku || '',
          // Inventory behavior flags for transparent UI messaging
          trackInventory: product.trackInventory !== false,
          allowBackorder: !!product.allowBackorder,
          availableStock: Number(product.availableStock ?? product.stockQuantity ?? 0),
          // Gift add-ons
          giftBoxId: product.giftBoxId || null,
          giftBoxName: product.giftBoxName || '',
          giftBoxPriceUsd: Number(product.giftBoxPriceUsd || 0),
          giftCardId: product.giftCardId || null,
          giftCardName: product.giftCardName || '',
          giftCardPrice: Number(product.giftCardPrice || 0),
          giftNote: product.giftNote || ''
        })
      }
    },
    removeFromCart(productId, variantId = null) {
      const targetKey = variantId ? `${productId}-v${variantId}` : String(productId)
      this.items = this.items.filter(item => this.getItemKey(item) !== targetKey)
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    },
    updateItemAddons(itemKey, addons = {}) {
      const item = this.items.find(i => this.getItemKey(i) === itemKey)
      if (!item) return
      if ('giftBoxId' in addons) item.giftBoxId = addons.giftBoxId || null
      if ('giftBoxName' in addons) item.giftBoxName = addons.giftBoxName || ''
      if ('giftBoxPriceUsd' in addons) item.giftBoxPriceUsd = Number(addons.giftBoxPriceUsd || 0)
      if ('giftCardId' in addons) item.giftCardId = addons.giftCardId || null
      if ('giftCardName' in addons) item.giftCardName = addons.giftCardName || ''
      if ('giftCardPrice' in addons) item.giftCardPrice = Number(addons.giftCardPrice || 0)
      if ('giftNote' in addons) item.giftNote = addons.giftNote || ''
    },
    clearCart() {
      this.items = []
    }
  }
})