import axios from 'axios'
import { API_BASE } from './apiConfig.js'

/**
 * Fetch active size guides for a given category (storefront use).
 * Returns an array of SizeGuideResponse objects.
 *
 * @param {number|string} categoryId
 * @returns {Promise<Array>}
 */
export async function getActiveSizeGuidesByCategory(categoryId) {
  if (!categoryId) return []
  const response = await axios.get(`${API_BASE}/api/v1/size-guides/categories/${categoryId}`)
  return response.data || []
}
