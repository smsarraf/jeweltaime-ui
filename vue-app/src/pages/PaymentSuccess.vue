<template>
  <main>
    <section class="carttablewrap py-7">
      <div class="container">
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-dark" role="status"><span class="visually-hidden">Loading...</span></div>
          <p class="mt-2 text-muted">Finalizing your order after payment...</p>
        </div>

        <div v-else-if="error" class="text-center py-10">
          <i class="fa-solid fa-circle-exclamation text-danger" style="font-size: 4rem;"></i>
          <h3 class="mt-3">Payment return could not be completed</h3>
          <p class="text-muted mb-4">{{ error }}</p>
          <router-link to="/checkout" class="btn btn-dark rounded-0">Back to Checkout</router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createOrder } from '../services/orderService'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const loading = ref(true)
const error = ref('')

const AIRWALLEX_DRAFT_PREFIX = 'airwallex-order-draft:'
const AIRWALLEX_LAST_DRAFT_KEY = 'airwallex-order-draft:last'

function pickPaymentInfo(query) {
  const status = String(
    query.payment_status ||
    query.status ||
    query.paymentStatus ||
    ''
  ).toLowerCase()

  return {
    status,
    paymentIntentId: query.payment_intent_id || query.paymentIntentId || query.intent_id || query.id || '',
    transactionId: query.transaction_id || query.transactionId || query.psp_reference || '',
    merchantOrderId: query.merchant_order_id || query.merchantOrderId || '',
    raw: Object.fromEntries(Object.entries(query))
  }
}

function getDraftKey(query) {
  return String(query.draft || sessionStorage.getItem(AIRWALLEX_LAST_DRAFT_KEY) || '')
}

function paymentSucceeded(status) {
  return ['success', 'succeeded', 'completed', 'paid'].includes(status)
}

function buildOrderPayloadWithPayment(basePayload, paymentInfo) {
  const noteParts = [
    basePayload.notes || '',
    'Payment gateway: Airwallex',
    `payment_status:${paymentInfo.status || 'unknown'}`,
    paymentInfo.paymentIntentId ? `payment_intent_id:${paymentInfo.paymentIntentId}` : '',
    paymentInfo.transactionId ? `transaction_id:${paymentInfo.transactionId}` : '',
    paymentInfo.merchantOrderId ? `merchant_order_id:${paymentInfo.merchantOrderId}` : '',
    `return_query:${JSON.stringify(paymentInfo.raw)}`
  ].filter(Boolean)

  return {
    ...basePayload,
    paymentGatewayId: 1,
    paymentTermId: 'IMMEDIATE',
    notes: noteParts.join(' | ')
  }
}

async function finalizeFromReturnUrl() {
  loading.value = true
  error.value = ''
  try {
    const paymentInfo = pickPaymentInfo(route.query || {})
    if (!paymentSucceeded(paymentInfo.status)) {
      throw new Error('Payment was not successful. Please try again from checkout.')
    }

    const draftKey = getDraftKey(route.query || {})
    if (!draftKey) {
      throw new Error('Missing checkout draft information in payment return URL.')
    }

    const processedKey = `${AIRWALLEX_DRAFT_PREFIX}${draftKey}:processed`
    const existingOrderId = sessionStorage.getItem(processedKey)
    if (existingOrderId) {
      router.replace(`/order-success/${existingOrderId}`)
      return
    }

    const draftRaw = sessionStorage.getItem(`${AIRWALLEX_DRAFT_PREFIX}${draftKey}`)
    if (!draftRaw) {
      throw new Error('Order draft expired. Please retry checkout.')
    }

    const orderDraft = JSON.parse(draftRaw)
    const payload = buildOrderPayloadWithPayment(orderDraft, paymentInfo)
    const order = await createOrder(payload)
    const orderId = order.id || order.orderId
    if (!orderId) {
      throw new Error('Payment succeeded but order ID was not returned.')
    }

    sessionStorage.setItem(processedKey, String(orderId))
    sessionStorage.removeItem(`${AIRWALLEX_DRAFT_PREFIX}${draftKey}`)
    sessionStorage.removeItem(AIRWALLEX_LAST_DRAFT_KEY)
    cartStore.clearCart()
    router.replace(`/order-success/${orderId}`)
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to finalize order from payment return.'
  } finally {
    loading.value = false
  }
}

onMounted(finalizeFromReturnUrl)
</script>
