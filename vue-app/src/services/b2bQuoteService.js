import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * B2B Quote Service
 * Handles all B2B quote-to-order API operations
 */
export const b2bQuoteService = {
  /**
   * Submit a new quote request
   */
  async submitQuoteRequest(quoteData) {
    try {
      const response = await axios.post(`${API_BASE}/api/v1/b2b/quotes`, quoteData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get list of current user's quotes
   */
  async getMyQuotes(params = {}) {
    try {
      const { page = 0, size = 10, sort = 'createdAt,desc', status } = params
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort
      })
      
      if (status) {
        queryParams.append('status', status)
      }

      const response = await axios.get(`${API_BASE}/api/v1/b2b/quotes?${queryParams}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get single quote details
   */
  async getQuoteById(quoteId) {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/b2b/quotes/${quoteId}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Accept quote and convert to order
   * @param {number} quoteId
   * @param {Object} [shippingAddress] - Optional shipping address. If omitted/empty, uses company address.
   * @param {string} [shippingAddress.street]
   * @param {string} [shippingAddress.city]
   * @param {string} [shippingAddress.state]
   * @param {string} [shippingAddress.zipCode]
   * @param {string} [shippingAddress.country]
   */
  async acceptQuote(quoteId, shippingAddress = null) {
    try {
      const body = shippingAddress && Object.values(shippingAddress).some(v => v && String(v).trim())
        ? shippingAddress
        : {}
      const response = await axios.post(`${API_BASE}/api/v1/b2b/quotes/${quoteId}/accept`, body)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get B2B pricing for a product
   */
  async getProductB2BPricing(productId, variantId = null) {
    try {
      const params = new URLSearchParams({ productId: productId.toString() })
      if (variantId) {
        params.append('variantId', variantId.toString())
      }
      
      const response = await axios.get(`${API_BASE}/api/v1/b2b/pricing?${params}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get B2B volume pricing tiers for bulk quantities
   * Returns tiered pricing discounts based on total quantity.
   * Tiers can be company-specific (negotiated rates) and/or product-specific.
   * @param {number} totalQuantity - Total quantity to calculate tiered pricing for
   * @param {Object} [options] - Additional context for tier calculation
   * @param {number} [options.companyId] - B2B company ID for company-negotiated rates
   * @param {Array} [options.items] - Array of { productId, variantId, quantity } for product-specific tiers
   */
  async getPricingTiers(totalQuantity, options = {}) {
    try {
      const params = new URLSearchParams({
        totalQuantity: totalQuantity.toString()
      })
      if (options.companyId) {
        params.append('companyId', options.companyId.toString())
      }
      if (options.items && options.items.length > 0) {
        params.append('items', JSON.stringify(options.items))
      }
      const response = await axios.get(`${API_BASE}/api/v1/b2b/pricing/tiers?${params}`)
      return response.data
    } catch (error) {
      // Fallback: return computed local tiers if API is unavailable
      return this.getFallbackPricingTiers(totalQuantity, options)
    }
  },

  /**
   * Fallback pricing tiers computed locally when API is unavailable.
   * Uses company-negotiated rates if companyId is provided, otherwise uses global defaults.
   * Product-specific tiers are applied when items array is provided.
   */
  getFallbackPricingTiers(totalQuantity, options = {}) {
    // Default global tiers
    const globalTiers = [
      { minQty: 1, maxQty: 9, discountPercent: 0, label: '1-9 units', type: 'global' },
      { minQty: 10, maxQty: 49, discountPercent: 15, label: '10-49 units', type: 'global' },
      { minQty: 50, maxQty: Infinity, discountPercent: 25, label: '50+ units', type: 'global' }
    ]

    // Company-specific tiers (better rates for established B2B partners)
    const companyTiers = [
      { minQty: 1, maxQty: 9, discountPercent: 5, label: '1-9 units', type: 'company' },
      { minQty: 10, maxQty: 49, discountPercent: 20, label: '10-49 units', type: 'company' },
      { minQty: 50, maxQty: Infinity, discountPercent: 30, label: '50+ units', type: 'company' }
    ]

    // Use company-specific tiers if companyId is provided
    const tiers = options.companyId ? companyTiers : globalTiers

    // If product-specific items are provided, compute per-product tiers
    let productTiers = null
    if (options.items && options.items.length > 0) {
      productTiers = options.items.map(item => {
        const qty = item.quantity || 0
        const tier = tiers.find(t => qty >= t.minQty && qty <= t.maxQty) || tiers[0]
        return {
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: qty,
          discountPercent: tier.discountPercent,
          tierLabel: tier.label
        }
      })
    }
    
    const applicableTier = tiers.find(t => totalQuantity >= t.minQty && totalQuantity <= t.maxQty)
    
    return {
      tiers,
      applicableTier: applicableTier || tiers[0],
      totalQuantity,
      companyId: options.companyId || null,
      productTiers,
      source: options.companyId ? 'local_fallback_company' : 'local_fallback'
    }
  },

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred'
      const code = error.response.data?.code || 'UNKNOWN_ERROR'
      return {
        message,
        code,
        status: error.response.status,
        details: error.response.data
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0
      }
    } else {
      // Error in request setup
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'REQUEST_ERROR',
        status: 0
      }
    }
  }
}

export default b2bQuoteService