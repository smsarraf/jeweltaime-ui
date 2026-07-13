import axios from 'axios'
import { isAuthenticated, getToken } from '../utils/auth.js'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const CHATBOT_BASE = `${API_BASE}/api/v1/chatbot`

/**
 * Send a message to GemsBot
 * @param {Object} payload - { message, guestSessionId?, guestName?, guestEmail? }
 * @returns {Promise<Object>} response data
 */
export async function sendMessage(payload) {
  const headers = {}
  if (isAuthenticated()) {
    headers.Authorization = `Bearer ${getToken()}`
  }
  const response = await axios.post(`${CHATBOT_BASE}/message`, payload, { headers })
  return response.data
}

/**
 * Long-poll for new messages in an escalated session
 * @param {number} sessionId
 * @param {number} lastMessageId
 * @returns {Promise<Object>} response data
 */
export async function pollMessages(sessionId, lastMessageId) {
  const headers = {}
  if (isAuthenticated()) {
    headers.Authorization = `Bearer ${getToken()}`
  }
  const response = await axios.get(
    `${CHATBOT_BASE}/sessions/${sessionId}/poll`,
    {
      params: { afterMessageId: lastMessageId },
      headers,
      timeout: 30000
    }
  )
  return response.data
}

/**
 * Get all chat sessions for authenticated user
 * @returns {Promise<Object>} response data
 */
export async function getSessions() {
  const response = await axios.get(`${CHATBOT_BASE}/sessions`)
  return response.data
}

/**
 * Get a specific chat session with all messages
 * @param {number} sessionId
 * @returns {Promise<Object>} response data
 */
export async function getSession(sessionId) {
  const response = await axios.get(`${CHATBOT_BASE}/sessions/${sessionId}`)
  return response.data
}