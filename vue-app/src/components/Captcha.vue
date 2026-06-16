<template>
  <div class="captcha-wrapper border rounded-0 p-3 mb-4 bg-light">
    <div class="d-flex align-items-center mb-2">
      <i class="fa-solid fa-shield-halved me-2 text-muted"></i>
      <span class="fw-medium small">Security Check</span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <div class="captcha-question fw-bold fs-5 px-3 py-1 bg-white border rounded">
        {{ num1 }} + {{ num2 }} = ?
      </div>
      <input
        type="number"
        class="form-control rounded-0 captcha-input"
        v-model="userAnswer"
        placeholder="Answer"
        @input="validate"
        :disabled="disabled"
      >
      <span v-if="isValid === true" class="text-success"><i class="fa-solid fa-check-circle fs-5"></i></span>
      <span v-if="isValid === false" class="text-danger"><i class="fa-solid fa-times-circle fs-5"></i></span>
      <button type="button" class="btn btn-outline-secondary btn-sm rounded-0" @click="generateNew" :disabled="disabled">
        <i class="fa-solid fa-rotate"></i>
      </button>
    </div>
    <input type="hidden" :value="isValid === true" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['verified'])

const num1 = ref(0)
const num2 = ref(0)
const userAnswer = ref('')
const isValid = ref(null)

function generateNew() {
  num1.value = Math.floor(Math.random() * 20) + 1
  num2.value = Math.floor(Math.random() * 20) + 1
  userAnswer.value = ''
  isValid.value = null
  emit('verified', false)
}

function validate() {
  if (userAnswer.value === '') {
    isValid.value = null
    emit('verified', false)
    return
  }
  const correct = parseInt(userAnswer.value) === (num1.value + num2.value)
  isValid.value = correct
  emit('verified', correct)
}

watch(() => props.disabled, (val) => {
  if (val) {
    // Optionally disable
  }
})

// Generate on creation
generateNew()

defineExpose({ generateNew })
</script>

<style scoped>
.captcha-wrapper {
  max-width: 100%;
}
.captcha-question {
  min-width: 80px;
  text-align: center;
  user-select: none;
  font-family: monospace;
}
.captcha-input {
  max-width: 100px;
}
</style>