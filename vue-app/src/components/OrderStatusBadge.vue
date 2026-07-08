<template>
  <span :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  }
})

const normalized = computed(() => String(props.status || '').toLowerCase())
const label = computed(() => (props.status || 'UNKNOWN').replaceAll('_', ' '))

const badgeClass = computed(() => {
  const map = {
    ordered: 'badge bg-warning text-dark rounded-0',
    pending: 'badge bg-warning text-dark rounded-0',
    preparing: 'badge bg-info text-dark rounded-0',
    ready_for_shipping: 'badge bg-primary rounded-0',
    shipped: 'badge bg-dark text-white rounded-0',
    delivered: 'badge bg-success rounded-0',
    cancelled: 'badge bg-danger rounded-0',
    paid: 'badge bg-success rounded-0',
    qc_pending: 'badge bg-info rounded-0',
    qc_rejected: 'badge bg-danger rounded-0',
    order_to_manufacture: 'badge bg-secondary rounded-0'
  }
  return map[normalized.value] || 'badge bg-light text-dark rounded-0'
})
</script>
