<template>
  <span :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'DRAFT'
  }
})

const normalized = computed(() => String(props.status || '').toUpperCase())
const label = computed(() => normalized.value.replaceAll('_', ' '))

const badgeClass = computed(() => {
  const map = {
    DRAFT: 'badge bg-secondary rounded-0',
    SENT: 'badge bg-primary rounded-0',
    PAID: 'badge bg-success rounded-0',
    OVERDUE: 'badge bg-danger rounded-0',
    CANCELLED: 'badge bg-dark rounded-0'
  }
  return map[normalized.value] || 'badge bg-light text-dark rounded-0'
})
</script>
