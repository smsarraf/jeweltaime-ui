import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { sendMessage, pollMessages } from '../services/chatbotService.js'
import { isAuthenticated } from '../utils/auth.js'

const GUEST_SESSION_KEY = 'gemsbot_guest_session_id'
const GUEST_NAME_KEY = 'gemsbot_guest_name'
const GUEST_EMAIL_KEY = 'gemsbot_guest_email'
const POLL_INTERVAL = parseInt(import.meta.env.VITE_CHATBOT_POLL_INTERVAL || '5000', 10)

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: [],
    sessionId: null,
    status: 'CLOSED', // OPEN | ESCALATED | CLOSED
    loading: false,
    error: null,
    unreadCount: 0,
    lastMessageId: null,
    pollTimer: null,
    guestSessionId: null,
    guestName: null,
    guestEmail: null,
    guestDetailsSubmitted: false,
    showGuestForm: false
  }),

  getters: {
    isGuest: () => !isAuthenticated(),
    hasGuestSession: (state) => !!state.guestSessionId,
    hasGuestDetails: (state) => !!state.guestName && !!state.guestEmail,
    isEscalated: (state) => state.status === 'ESCALATED',
    isClosed: (state) => state.status === 'CLOSED',
    isActive: (state) => state.status === 'OPEN' || state.status === 'ESCALATED'
  },

  actions: {
    /**
     * Initialize guest session from localStorage
     */
    initGuestSession() {
      if (isAuthenticated()) return
      let sid = localStorage.getItem(GUEST_SESSION_KEY)
      if (!sid) {
        sid = uuidv4()
        localStorage.setItem(GUEST_SESSION_KEY, sid)
      }
      this.guestSessionId = sid
      this.guestName = localStorage.getItem(GUEST_NAME_KEY) || null
      this.guestEmail = localStorage.getItem(GUEST_EMAIL_KEY) || null
      if (this.guestName && this.guestEmail) {
        this.guestDetailsSubmitted = true
      }
    },

    /**
     * Toggle chat open/closed
     */
    toggleChat() {
      if (this.isOpen) {
        this.closeChat()
      } else {
        this.openChat()
      }
    },

    /**
     * Open the chat panel
     */
    openChat() {
      this.isOpen = true
      this.unreadCount = 0
      if (!isAuthenticated()) {
        this.initGuestSession()
      }
      // Set status to OPEN so input is enabled
      if (this.status === 'CLOSED' && this.messages.length === 0) {
        this.status = 'OPEN'
      }
      // Add welcome message if no messages yet
      if (this.messages.length === 0) {
        this.messages.push({
          id: 'welcome',
          sender: 'BOT',
          messageText: '💎 Welcome to JEWELT\'Aime! I\'m GemsBot, your personal jewellery concierge.\n\nI can help you with:\n• Product recommendations\n• Order tracking\n• Shipping & returns info\n• Sizing guides\n• Connect you with a specialist\n\nHow can I assist you today?',
          intent: 'GREETING',
          createdAt: new Date().toISOString()
        })
        // Show guest form if needed
        if (!isAuthenticated() && !this.guestDetailsSubmitted) {
          this.showGuestForm = true
        }
      }
    },

    /**
     * Close the chat panel
     */
    closeChat() {
      this.isOpen = false
      this.stopPolling()
    },

    /**
     * Submit guest details (name + email)
     */
    submitGuestDetails(name, email) {
      this.guestName = name
      this.guestEmail = email
      localStorage.setItem(GUEST_NAME_KEY, name)
      localStorage.setItem(GUEST_EMAIL_KEY, email)
      this.guestDetailsSubmitted = true
      this.showGuestForm = false
      // Set status to OPEN so the input area becomes active
      if (this.status === 'CLOSED') {
        this.status = 'OPEN'
      }
    },

    /**
     * Send a message to GemsBot
     */
    async sendUserMessage(text) {
      if (!text || !text.trim()) return
      const trimmed = text.trim()
      this.error = null
      // Set loading immediately to prevent duplicate sends
      this.loading = true

      // Add user message to UI immediately
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'USER',
        messageText: trimmed,
        createdAt: new Date().toISOString()
      }
      this.messages.push(userMsg)

      // Build payload
      const payload = { message: trimmed }
      if (!isAuthenticated()) {
        payload.guestSessionId = this.guestSessionId
        if (this.guestName && this.guestEmail && !this.guestDetailsSubmitted) {
          payload.guestName = this.guestName
          payload.guestEmail = this.guestEmail
        }
      }

      try {
        const data = await sendMessage(payload)
        this.sessionId = data.sessionId
        this.status = data.status || 'OPEN'

        // Add bot message
        if (data.message) {
          this.messages.push({
            id: `bot-${Date.now()}`,
            sender: data.escalated ? 'STATUS' : 'BOT',
            messageText: data.message,
            intent: data.intent,
            createdAt: data.createdAt || new Date().toISOString()
          })
        }

        // Process recent messages if provided (reconciliation)
        if (data.recentMessages && data.recentMessages.length > 0) {
          this._mergeRecentMessages(data.recentMessages)
        }

        // Update last message id
        this._updateLastMessageId()

        // Start polling if escalated
        if (this.status === 'ESCALATED') {
          this._addStatusMessage('🔄 Connecting you to a specialist...')
          this.startPolling()
        }

        if (this.status === 'CLOSED') {
          this._addStatusMessage('This conversation has ended.')
          this.stopPolling()
        }

        // If not open, bump unread
        if (!this.isOpen) {
          this.unreadCount++
        }
      } catch (err) {
        console.error('GemsBot send error:', err)
        if (err.response?.status === 401) {
          this.error = 'Session expired. Please log in again.'
          this._addStatusMessage('⚠️ Session expired. Please log in again.')
        } else if (err.response?.status === 404) {
          this.error = 'Service not available yet.'
          this._addStatusMessage('⚠️ Chat service is not available yet. Please try again later.')
        } else if (err.response?.status >= 500) {
          this.error = 'Server error.'
          this._addStatusMessage('⚠️ Something went wrong on our end. Please try again later.')
        } else if (!err.response) {
          // Network error or server unreachable
          this.error = 'Cannot reach chat service.'
          this._addStatusMessage('⚠️ Unable to connect to the chat service. Please check your connection and try again.')
        } else {
          this.error = 'Something went wrong.'
          this._addStatusMessage('⚠️ Something went wrong. Please try again.')
        }
        // Remove the user message that failed to send
        const lastMsg = this.messages[this.messages.length - 1]
        if (lastMsg && lastMsg.sender === 'USER' && lastMsg.messageText === trimmed) {
          this.messages.pop()
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Start polling for escalated session
     */
    startPolling() {
      this.stopPolling()
      this._doPoll()
    },

    /**
     * Stop polling
     */
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    },

    /**
     * Internal poll loop
     */
    async _doPoll() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
      }
      this.pollTimer = setInterval(async () => {
        if (this.status !== 'ESCALATED' || !this.sessionId) {
          this.stopPolling()
          return
        }
        try {
          const data = await pollMessages(this.sessionId, this.lastMessageId || 0)
          if (data.status === 'CLOSED') {
            this.status = 'CLOSED'
            this._addStatusMessage('This conversation has ended.')
            this.stopPolling()
            return
          }
          if (data.messages && data.messages.length > 0) {
            for (const msg of data.messages) {
              // Skip if message already exists (by id or content+sender match)
              const isDuplicate = this.messages.some(
                m => m.id === msg.id ||
                (m.sender === msg.sender && m.messageText === msg.messageText &&
                 Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 2000)
              )
              if (!isDuplicate) {
                this.messages.push({
                  id: msg.id,
                  sender: msg.sender,
                  messageText: msg.messageText,
                  intent: msg.intent,
                  createdAt: msg.createdAt
                })
                if (!this.isOpen) {
                  this.unreadCount++
                }
              }
            }
            this._updateLastMessageId()
          }
          if (data.timedOut) {
            // Will retry on next interval
          }
        } catch (err) {
          console.error('GemsBot poll error:', err)
        }
      }, POLL_INTERVAL)
    },

    /**
     * Merge recent messages from server to avoid duplicates
     */
    _mergeRecentMessages(recentMessages) {
      for (const msg of recentMessages) {
        const exists = this.messages.some(
          m => m.id === msg.id || (m.sender === msg.sender && m.messageText === msg.messageText && Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 2000)
        )
        if (!exists) {
          this.messages.push({
            id: msg.id,
            sender: msg.sender,
            messageText: msg.messageText,
            intent: msg.intent,
            createdAt: msg.createdAt
          })
        }
      }
    },

    /**
     * Update lastMessageId from messages array
     */
    _updateLastMessageId() {
      const numericMsgs = this.messages.filter(m => typeof m.id === 'number')
      if (numericMsgs.length > 0) {
        this.lastMessageId = Math.max(...numericMsgs.map(m => m.id))
      }
    },

    /**
     * Add a centered status message
     */
    _addStatusMessage(text) {
      this.messages.push({
        id: `status-${Date.now()}`,
        sender: 'STATUS',
        messageText: text,
        createdAt: new Date().toISOString()
      })
    },

    /**
     * Reset everything (new conversation)
     */
    reset() {
      this.stopPolling()
      this.messages = []
      this.sessionId = null
      this.status = 'CLOSED'
      this.loading = false
      this.error = null
      this.unreadCount = 0
      this.lastMessageId = null
      this.showGuestForm = false
      this.guestDetailsSubmitted = false
    }
  }
})