import axios from 'axios'
import { API_BASE, authHeaders } from './apiConfig'

/**
 * @typedef {Object} ShippingRateRequest
 * @property {number} countryId
 * @property {number=} stateId
 * @property {number=} cityId
 * @property {number=} shipperId
 * @property {number=} orderWeightKg
 * @property {number=} orderTotalUsd
 */

export async function getActiveShippers() {
  const res = await axios.get(`${API_BASE}/api/v1/shipping/shippers/active`, {
    headers: authHeaders()
  })
  return Array.isArray(res.data) ? res.data : []
}

export async function getShipperMethods(shipperId) {
  if (!shipperId) return []
  const res = await axios.get(`${API_BASE}/api/v1/shipping/shippers/${shipperId}/methods`, {
    headers: authHeaders()
  })
  return Array.isArray(res.data) ? res.data : []
}

export async function calculateShippingRates(payload) {
  const res = await axios.post(`${API_BASE}/api/v1/shipping/rates`, payload, {
    headers: authHeaders()
  })
  return Array.isArray(res.data) ? res.data : []
}

/**
 * @param {ShippingRateRequest} payload
 * @returns {Promise<{shipperId:number,orderWeightKg:number,shippingCost:number}>}
 */
export async function previewShippingCost(payload) {
  const res = await axios.post(`${API_BASE}/api/v1/shipping/cost/preview`, payload, {
    headers: authHeaders()
  })
  return res.data || {}
}

/**
 * Read country tax rate metadata by destination country.
 * @param {number} countryId
 */
export async function getCountryTaxRate(countryId) {
  if (!countryId) return {}
  const res = await axios.get(`${API_BASE}/api/v1/locations/countries/tax-rate/${countryId}`)
  return res.data || {}
}
