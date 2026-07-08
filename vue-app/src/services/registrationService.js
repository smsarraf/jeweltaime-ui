import axios from 'axios'
import { API_BASE } from './apiConfig.js'

/**
 * @typedef {'USER'|'B2B_USER'} RoleName
 *
 * @typedef {Object} B2bCompanyRequestDto
 * @property {string} companyName
 * @property {string} registrationNumber
 * @property {string} taxId
 * @property {string} addressLine1
 * @property {number|null} country_id
 * @property {number|null} state_id
 * @property {number|null} city_id
 *
 * @typedef {Object} RegisterRequestDto
 * @property {string} email
 * @property {string} username
 * @property {string} fullName
 * @property {string} password
 * @property {RoleName} roleName
 * @property {B2bCompanyRequestDto|null} b2bCompany
 *
 * @typedef {Object} RegisterResponseDto
 * @property {string} message
 * @property {'PENDING_EMAIL_VERIFICATION'|'PENDING_ADMIN_APPROVAL'|string} registrationStatus
 * @property {boolean} activationEmailSent
 * @property {boolean} adminApprovalRequired
 */

/**
 * @param {RegisterRequestDto} payload
 * @returns {Promise<RegisterResponseDto>}
 */
export async function registerAccount(payload) {
  const response = await axios.post(`${API_BASE}/api/v1/auth/register`, payload)
  return response.data || {}
}

/**
 * @param {string} token
 */
export async function activateAccount(token) {
  const response = await axios.get(`${API_BASE}/api/v1/auth/activate`, {
    params: { token }
  })
  return response.data || {}
}

export function mapRegistrationApiError(error) {
  const status = Number(error?.response?.status || 0)
  const backendMessage = error?.response?.data?.message || error?.response?.data?.error
  if (backendMessage) return backendMessage
  if (status === 400) return 'Invalid registration details. Please check and try again.'
  if (status === 404) return 'Registration service not found.'
  if (status === 409) return 'An account with this email already exists.'
  if (status >= 500) return 'Server error while registering. Please try again shortly.'
  return 'Registration failed. Please try again.'
}

export function mapActivationApiError(error) {
  const status = Number(error?.response?.status || 0)
  const message = String(error?.response?.data?.message || error?.response?.data?.error || '').toLowerCase()
  if (message.includes('expired')) return 'This activation link has expired.'
  if (message.includes('invalid') || message.includes('not found')) return 'This activation link is invalid.'
  if (status === 404) return 'Activation link is invalid.'
  if (status >= 500) return 'Activation service is temporarily unavailable.'
  return 'Could not activate account. Please retry.'
}
