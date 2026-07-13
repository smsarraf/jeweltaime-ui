import axios from 'axios'
import { API_BASE, authHeaders, getCurrentUserId } from './apiConfig'

/**
 * @typedef {'GUEST'|'USER'|'B2B_USER'} SubscriberType
 */

/**
 * @typedef {Object} NewsletterSubscribeRequest
 * @property {string} email - Email address to subscribe
 * @property {string} [name] - Optional subscriber name
 * @property {'WEBSITE'} [source] - Source of subscription
 * @property {SubscriberType} [subscriberType] - Subscriber type
 * @property {number} [userId] - User ID if registered
 */

/**
 * @typedef {Object} NewsletterSubscriberResponse
 * @property {number} id
 * @property {string} email
 * @property {string|null} name
 * @property {string} subscriberType
 * @property {boolean} isActive
 * @property {boolean} isVerified
 * @property {string} source
 * @property {string|null} unsubscribeToken
 * @property {string|null} subscribedAt
 * @property {string|null} unsubscribedAt
 */

/**
 * Subscribe an email to the newsletter.
 *
 * @param {NewsletterSubscribeRequest} payload
 * @returns {Promise<NewsletterSubscriberResponse>}
 */
export async function subscribeToNewsletter(payload) {
  const response = await axios.post(`${API_BASE}/api/v1/newsletter/subscribe`, payload)
  return response.data
}

/**
 * Unsubscribe an email address from the newsletter.
 *
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function unsubscribeByEmail(email) {
  const response = await axios.post(`${API_BASE}/api/v1/newsletter/unsubscribe`, { email })
  return response.data
}

/**
 * Build a subscribe payload for the current user context.
 * Determines subscriberType based on current auth state.
 *
 * @param {Object} options
 * @param {string} options.email
 * @param {string} [options.name]
 * @returns {NewsletterSubscribeRequest}
 */
export function buildSubscribePayload({ email, name }) {
  const userId = getCurrentUserId()
  let subscriberType = 'GUEST'
  
  if (userId) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const roles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : [])
      const roleName = typeof roles[0] === 'object' ? roles[0]?.name : roles[0]
      subscriberType = roleName === 'B2B_USER' ? 'B2B_USER' : 'USER'
    } catch {
      subscriberType = 'USER'
    }
  }

  return {
    email,
    name: name || undefined,
    source: 'WEBSITE',
    subscriberType,
    userId: userId || undefined
  }
}