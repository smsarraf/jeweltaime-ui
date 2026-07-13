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
   */
  async acceptQuote(quoteId) {
    try {
      const response = await axios.post(`${API_BASE}/api/v1/b2b/quotes/${quoteId}/accept`)
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