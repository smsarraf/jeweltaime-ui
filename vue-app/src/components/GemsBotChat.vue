<template>
  <div v-if="enabled" class="gemsbot-widget" :class="{ 'gemsbot-open': store.isOpen }">
    <!-- Floating Button -->
    <button
      v-if="!store.isOpen"
      class="gemsbot-fab"
      @click="store.toggleChat()"
      aria-label="Open GemsBot chat"
      :title="'Chat with GemsBot'"
    >
      <span class="gemsbot-fab-icon">💎</span>
      <span v-if="store.unreadCount > 0" class="gemsbot-unread-badge">
        {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
      </span>
    </button>

    <!-- Chat Panel -->
    <transition name="gemsbot-panel">
      <div v-if="store.isOpen" class="gemsbot-panel" @keydown.escape="store.closeChat()">
        <!-- Header -->
        <div class="gemsbot-header">
          <div class="gemsbot-header-info">
            <div class="gemsbot-header-avatar">💎</div>
            <div>
              <div class="gemsbot-header-title">GemsBot</div>
              <div class="gemsbot-header-subtitle">
                <span class="gemsbot-online-dot"></span>
                Online &mdash; JEWELT'Aime Concierge
              </div>
            </div>
          </div>
          <div class="gemsbot-header-actions">
            <button
              class="gemsbot-header-btn"
              @click="store.closeChat()"
              aria-label="Close chat"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Quick Actions (before first user message) -->
        <div v-if="showChips" class="gemsbot-chips">
          <button
            v-for="chip in quickChips"
            :key="chip.text"
            class="gemsbot-chip"
            @click="onChipClick(chip.text)"
          >
            {{ chip.label }}
          </button>
        </div>

        <!-- Messages Area -->
        <div
          ref="messagesContainer"
          class="gemsbot-messages"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          <div
            v-for="msg in store.messages"
            :key="msg.id"
            class="gemsbot-msg-wrapper"
            :class="{
              'gemsbot-msg-user': msg.sender === 'USER',
              'gemsbot-msg-bot': msg.sender === 'BOT',
              'gemsbot-msg-staff': msg.sender === 'STAFF',
              'gemsbot-msg-status': msg.sender === 'STATUS'
            }"
          >
            <!-- Status message -->
            <div v-if="msg.sender === 'STATUS'" class="gemsbot-msg-status-text">
              <em>{{ msg.messageText }}</em>
            </div>

            <!-- Staff message -->
            <div v-else-if="msg.sender === 'STAFF'" class="gemsbot-msg gemsbot-msg-staff-bubble">
              <div class="gemsbot-msg-avatar">✨</div>
              <div class="gemsbot-msg-content">
                <div class="gemsbot-msg-sender">Specialist ✨</div>
                <div class="gemsbot-msg-text" v-html="formatMessage(msg.messageText)"></div>
                <div class="gemsbot-msg-time">{{ formatTime(msg.createdAt) }}</div>
              </div>
            </div>

            <!-- Bot message -->
            <div v-else-if="msg.sender === 'BOT'" class="gemsbot-msg gemsbot-msg-bot-bubble">
              <div class="gemsbot-msg-avatar">💎</div>
              <div class="gemsbot-msg-content">
                <!-- Intent-specific rendering -->
                <div v-if="msg.intent === 'PRODUCT_SUGGESTION' && extractProductCards(msg.messageText).length" class="gemsbot-product-cards">
                  <div v-for="(product, i) in extractProductCards(msg.messageText)" :key="i" class="gemsbot-product-card">
                    <div class="gemsbot-product-name">{{ product.name }}</div>
                    <div v-if="product.price" class="gemsbot-product-price">{{ product.price }}</div>
                    <a v-if="product.link" :href="product.link" class="gemsbot-product-link">View →</a>
                  </div>
                </div>
                <div v-else class="gemsbot-msg-text" v-html="formatMessage(msg.messageText)"></div>
                <div class="gemsbot-msg-time">{{ formatTime(msg.createdAt) }}</div>
              </div>
            </div>

            <!-- User message -->
            <div v-else class="gemsbot-msg gemsbot-msg-user-bubble">
              <div class="gemsbot-msg-text">{{ msg.messageText }}</div>
              <div class="gemsbot-msg-time">{{ formatTime(msg.createdAt) }}</div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="store.loading" class="gemsbot-msg-wrapper gemsbot-msg-bot">
            <div class="gemsbot-msg gemsbot-msg-bot-bubble">
              <div class="gemsbot-msg-avatar">💎</div>
              <div class="gemsbot-msg-content">
                <div class="gemsbot-typing">
                  <span class="gemsbot-typing-dot"></span>
                  <span class="gemsbot-typing-dot"></span>
                  <span class="gemsbot-typing-dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Guest Details Form -->
        <div v-if="store.showGuestForm" class="gemsbot-guest-form">
          <div class="gemsbot-guest-form-inner">
            <div class="gemsbot-guest-form-title">💎 Before we begin...</div>
            <input
              v-model="guestNameInput"
              type="text"
              placeholder="Name"
              class="gemsbot-guest-input"
              aria-label="Your name"
              @keydown.enter="$refs.guestEmailRef?.focus()"
            />
            <input
              ref="guestEmailRef"
              v-model="guestEmailInput"
              type="email"
              placeholder="Email"
              class="gemsbot-guest-input"
              aria-label="Your email"
              @keydown.enter="submitGuestDetails"
            />
            <button
              class="gemsbot-guest-submit"
              :disabled="!guestNameInput.trim() || !guestEmailInput.trim()"
              @click="submitGuestDetails"
            >
              Continue ✨
            </button>
          </div>
        </div>

        <!-- Input Area -->
        <div v-if="!store.showGuestForm" class="gemsbot-input-area">
          <input
            ref="messageInput"
            v-model="messageText"
            type="text"
            placeholder="Type your message... ✨"
            class="gemsbot-input"
            aria-label="Type your message"
            :disabled="store.loading || store.isClosed"
            @keydown.enter="send"
          />
          <button
            class="gemsbot-send-btn"
            :disabled="!messageText.trim() || store.loading || store.isClosed"
            aria-label="Send message"
            title="Send"
            @click="send"
          >
            ➤
          </button>
        </div>

        <!-- Scroll to bottom button -->
        <transition name="gemsbot-fade">
          <button
            v-if="showScrollBtn"
            class="gemsbot-scroll-btn"
            @click="scrollToBottom"
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        </transition>

        <!-- Footer -->
        <div class="gemsbot-footer">
          Powered by <strong>JEWELT'Aime</strong> &bull;
          <router-link to="/policies/privacy-policy" class="gemsbot-footer-link" @click="store.closeChat()">Privacy Policy</router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useChatbotStore } from '../stores/chatbotStore.js'

const store = useChatbotStore()

const enabled = computed(() => {
  return import.meta.env.VITE_CHATBOT_WIDGET_ENABLED !== 'false'
})

// Refs
const messagesContainer = ref(null)
const messageInput = ref(null)
const messageText = ref('')
const guestNameInput = ref('')
const guestEmailInput = ref('')
const guestEmailRef = ref(null)
const showScrollBtn = ref(false)

// Quick action chips
const quickChips = [
  { label: 'Track my order 📦', text: 'I\'d like to track my order' },
  { label: 'Suggest rings 💍', text: 'Show me some ring suggestions' },
  { label: 'Shipping info 🚚', text: 'What are your shipping options?' },
  { label: 'Speak to staff 💬', text: 'I\'d like to speak to a specialist' }
]

const showChips = computed(() => {
  return store.messages.length <= 1 && !store.loading
})

// Watch for new messages to auto-scroll
watch(
  () => store.messages.length,
  () => {
    nextTick(() => {
      if (!isScrolledUp()) {
        scrollToBottom()
      }
    })
  }
)

// Watch for panel open to focus input
watch(
  () => store.isOpen,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        scrollToBottom()
        if (messageInput.value) {
          messageInput.value.focus()
        }
      })
    }
  }
)

// Scroll event listener for scroll-to-bottom button
onMounted(() => {
  const container = messagesContainer.value
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  const container = messagesContainer.value
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
  store.stopPolling()
})

function handleScroll() {
  showScrollBtn.value = isScrolledUp()
}

function isScrolledUp() {
  const container = messagesContainer.value
  if (!container) return false
  return container.scrollHeight - container.scrollTop - container.clientHeight > 100
}

function scrollToBottom() {
  const container = messagesContainer.value
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
  }
  showScrollBtn.value = false
}

function send(overrideText) {
  const text = (overrideText || messageText.value).trim()
  if (!text || store.loading) return
  messageText.value = ''
  store.sendUserMessage(text)
  nextTick(scrollToBottom)
}

function onChipClick(chipText) {
  send(chipText)
}

function submitGuestDetails() {
  const name = guestNameInput.value.trim()
  const email = guestEmailInput.value.trim()
  if (!name || !email) return
  store.submitGuestDetails(name, email)
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatMessage(text) {
  if (!text) return ''
  // Convert newlines to <br>
  let html = text.replace(/\n/g, '<br>')
  // Bold text between **
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Convert URLs to links
  html = html.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="gemsbot-link">$1</a>'
  )
  return html
}

function extractProductCards(text) {
  // Simple extraction of product mentions from bot text
  // This is a best-effort parse - the backend may return structured data in the future
  const cards = []
  if (!text) return cards
  // Look for patterns like "**Product Name** - $XX.XX"
  const regex = /\*\*(.*?)\*\*(?:\s*-\s*(\$[\d,.]+))?/g
  let match
  while ((match = regex.exec(text)) !== null) {
    const name = match[1]
    // Skip common non-product bold text
    if (name.length > 3 && !name.includes('Here') && !name.includes('following')) {
      cards.push({
        name,
        price: match[2] || null,
        link: `/products`
      })
    }
  }
  return cards.length > 1 ? cards : []
}
</script>

<style scoped>
/* ==============================================
   GemsBot Widget - Base
   ============================================== */
.gemsbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ==============================================
   Floating Action Button
   ============================================== */
.gemsbot-fab {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8a96e, #b8943f);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(200, 169, 110, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  animation: gemsbot-pulse 2s infinite;
}

.gemsbot-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(200, 169, 110, 0.6);
}

.gemsbot-fab-icon {
  font-size: 28px;
  line-height: 1;
}

.gemsbot-unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #e74c3c;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

@keyframes gemsbot-pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(200, 169, 110, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(200, 169, 110, 0.7); }
}

/* ==============================================
   Chat Panel
   ============================================== */
.gemsbot-panel {
  width: 380px;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  right: 0;
}

/* Panel transition */
.gemsbot-panel-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.gemsbot-panel-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.gemsbot-panel-enter-from,
.gemsbot-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* ==============================================
   Header
   ============================================== */
.gemsbot-header {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.gemsbot-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gemsbot-header-avatar {
  font-size: 28px;
  line-height: 1;
}

.gemsbot-header-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.gemsbot-header-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.gemsbot-online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2ecc71;
  display: inline-block;
  animation: gemsbot-online-blink 2s infinite;
}

@keyframes gemsbot-online-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.gemsbot-header-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.gemsbot-header-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* ==============================================
   Quick Action Chips
   ============================================== */
.gemsbot-chips {
  padding: 10px 14px 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.gemsbot-chip {
  padding: 6px 12px;
  border: 1px solid #e0d5c0;
  background: #fff;
  border-radius: 20px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  color: #5a4a2e;
  transition: all 0.2s;
  white-space: nowrap;
}

.gemsbot-chip:hover {
  background: #faf3e0;
  border-color: #c8a96e;
  color: #3a2a0e;
}

/* ==============================================
   Messages Area
   ============================================== */
.gemsbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8f9fa;
  scroll-behavior: smooth;
}

.gemsbot-messages::-webkit-scrollbar {
  width: 5px;
}

.gemsbot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.gemsbot-messages::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 10px;
}

/* Message wrapper alignment */
.gemsbot-msg-wrapper {
  display: flex;
  flex-direction: column;
}

.gemsbot-msg-wrapper.gemsbot-msg-user {
  align-items: flex-end;
}

.gemsbot-msg-wrapper.gemsbot-msg-bot,
.gemsbot-msg-wrapper.gemsbot-msg-staff {
  align-items: flex-start;
}

.gemsbot-msg-wrapper.gemsbot-msg-status {
  align-items: center;
}

/* Message bubble */
.gemsbot-msg {
  display: flex;
  gap: 8px;
  max-width: 85%;
}

.gemsbot-msg-avatar {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.gemsbot-msg-content {
  display: flex;
  flex-direction: column;
}

.gemsbot-msg-sender {
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  margin-bottom: 3px;
}

/* Bot message */
.gemsbot-msg-bot-bubble .gemsbot-msg-text,
.gemsbot-msg-bot-bubble .gemsbot-msg-content {
  background: #fff;
  padding: 10px 14px;
  border-radius: 4px 16px 16px 16px;
  font-size: 13.5px;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Staff message */
.gemsbot-msg-staff-bubble .gemsbot-msg-text,
.gemsbot-msg-staff-bubble .gemsbot-msg-content {
  background: #f3e8ff;
  padding: 10px 14px;
  border-radius: 4px 16px 16px 16px;
  font-size: 13.5px;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 1px 3px rgba(124, 58, 237, 0.1);
}

/* User message */
.gemsbot-msg-user-bubble .gemsbot-msg-text {
  background: #faf3e0;
  padding: 10px 14px;
  border-radius: 16px 4px 16px 16px;
  font-size: 13.5px;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.gemsbot-msg-user-bubble {
  max-width: 80%;
}

/* Status message */
.gemsbot-msg-status-text {
  font-size: 11.5px;
  color: #888;
  text-align: center;
  padding: 4px 12px;
  font-style: italic;
}

/* Message time */
.gemsbot-msg-time {
  font-size: 10px;
  color: #aaa;
  margin-top: 4px;
  padding: 0 2px;
}

.gemsbot-msg-user-bubble .gemsbot-msg-time {
  text-align: right;
}

/* Product cards */
.gemsbot-product-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.gemsbot-product-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: border-color 0.2s;
}

.gemsbot-product-card:hover {
  border-color: #c8a96e;
}

.gemsbot-product-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.gemsbot-product-price {
  font-size: 13px;
  font-weight: 700;
  color: #c8a96e;
  white-space: nowrap;
}

.gemsbot-product-link {
  font-size: 12px;
  color: #c8a96e;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}

.gemsbot-product-link:hover {
  text-decoration: underline;
}

/* Typing indicator */
.gemsbot-typing {
  display: flex;
  gap: 5px;
  padding: 10px 14px;
  background: #fff;
  border-radius: 4px 16px 16px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.gemsbot-typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c8a96e;
  animation: gemsbot-bounce 1.4s ease-in-out infinite;
}

.gemsbot-typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.gemsbot-typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes gemsbot-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* ==============================================
   Guest Form
   ============================================== */
.gemsbot-guest-form {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.gemsbot-guest-form-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gemsbot-guest-form-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.gemsbot-guest-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e0d5c0;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.gemsbot-guest-input:focus {
  border-color: #c8a96e;
  box-shadow: 0 0 0 3px rgba(200, 169, 110, 0.15);
}

.gemsbot-guest-submit {
  padding: 10px;
  background: linear-gradient(135deg, #c8a96e, #b8943f);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
}

.gemsbot-guest-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gemsbot-guest-submit:not(:disabled):hover {
  opacity: 0.9;
}

/* ==============================================
   Input Area
   ============================================== */
.gemsbot-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}

.gemsbot-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 13.5px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.gemsbot-input:focus {
  border-color: #c8a96e;
  box-shadow: 0 0 0 3px rgba(200, 169, 110, 0.1);
}

.gemsbot-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.gemsbot-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8a96e, #b8943f);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, transform 0.2s;
  flex-shrink: 0;
}

.gemsbot-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.gemsbot-send-btn:not(:disabled):hover {
  transform: scale(1.05);
}

/* ==============================================
   Scroll to Bottom Button
   ============================================== */
.gemsbot-scroll-btn {
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.2s;
  z-index: 10;
}

.gemsbot-scroll-btn:hover {
  background: #f5f5f5;
}

/* Fade transition */
.gemsbot-fade-enter-active,
.gemsbot-fade-leave-active {
  transition: opacity 0.2s;
}
.gemsbot-fade-enter-from,
.gemsbot-fade-leave-to {
  opacity: 0;
}

/* ==============================================
   Footer
   ============================================== */
.gemsbot-footer {
  padding: 8px 14px;
  text-align: center;
  font-size: 10.5px;
  color: #999;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  flex-shrink: 0;
}

.gemsbot-footer-link {
  color: #c8a96e;
  text-decoration: none;
}

.gemsbot-footer-link:hover {
  text-decoration: underline;
}

/* Link styling inside messages */
:deep(.gemsbot-link) {
  color: #c8a96e;
  text-decoration: underline;
  word-break: break-all;
}

/* ==============================================
   Mobile Responsive (< 480px)
   ============================================== */
@media (max-width: 480px) {
  .gemsbot-widget {
    bottom: 0;
    right: 0;
  }

  .gemsbot-panel {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    position: fixed;
    bottom: 0;
    right: 0;
  }

  .gemsbot-fab {
    bottom: 20px;
    right: 20px;
    position: fixed;
  }
}
</style>