<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true" @click.self="close">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
      <div class="modal-content rounded-0 border-0 shadow-lg">
        <div class="modal-header border-bottom-0 px-4 pt-4 pb-2">
          <h5 class="modal-title text-uppercase fw-semibold">
            <i class="fa-solid fa-ruler me-2"></i>
            {{ guide?.name || 'Size Guide' }}
          </h5>
          <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body px-4 pb-4">
          <p v-if="guide?.description" class="text-muted mb-3">{{ guide.description }}</p>

          <div v-if="rows.length > 0" class="table-responsive">
            <table class="table table-bordered size-guide-table mb-0">
              <thead>
                <tr>
                  <th v-for="col in columns" :key="col" class="text-uppercase text-center bg-light">
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in rows" :key="idx">
                  <td v-for="col in columns" :key="col" class="text-center" :class="{ 'fw-semibold': idx === 0 }">
                    {{ row[col] ?? '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center text-muted py-4">
            <i class="fa-solid fa-circle-info me-1"></i> No size data available at this time.
          </div>

          <p v-if="guide?.unitLabel" class="text-muted small mt-3 mb-0">
            <i class="fa-solid fa-weight-scale me-1"></i> All measurements in: <strong>{{ guide.unitLabel }}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="visible" class="modal-backdrop fade show" @click="close"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  guide: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

/**
 * Extract column headers from the first row's keys.
 * guideData is an array of dynamic objects (e.g., [{ "Size": "S", "Bust": "32" }, ...]).
 */
const columns = computed(() => {
  const data = props.guide?.guideData
  if (!Array.isArray(data) || data.length === 0) return []
  return Object.keys(data[0])
})

/**
 * Rows are the raw guideData items.
 */
const rows = computed(() => {
  const data = props.guide?.guideData
  if (!Array.isArray(data)) return []
  return data
})
</script>

<style scoped>
.size-guide-table th {
  padding: 12px 16px;
  letter-spacing: 0.5px;
  color: #333;
  border-color: #dee2e6;
}
.size-guide-table td {
  padding: 10px 16px;
  color: #555;
  border-color: #dee2e6;
}
.size-guide-table tbody tr:hover {
  background-color: #f8f9fa;
}
</style>