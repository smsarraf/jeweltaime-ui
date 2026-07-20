<template>
  <Teleport to="body">
    <div class="cart-toast position-fixed bottom-0 start-50 translate-middle-x mb-5" :class="{ show: showToast }" style="z-index: 9999;">
      <div class="bg-dark text-white px-4 py-3 d-flex align-items-center gap-3 shadow-lg" style="border-radius: 12px; min-width: 280px;">
        <i class="fa-solid fa-circle-check text-success fs-5"></i>
        <div class="flex-grow-1">
          <div class="fw-medium small">{{ message }}</div>
          <div class="small text-white-50">{{ subMessage }}</div>
        </div>
        <button class="btn btn-sm btn-link text-white p-0 ms-2" @click="hide">&times;</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: 'Added to cart!' },
  subMessage: { type: String, default: '' },
  duration: { type: Number, default: 3000 }
})

const emit = defineEmits(['update:visible'])

const showToast = ref(false)
let hideTimer = null

watch(() => props.visible, (val) => {
  if (val) {
    showToast.value = true
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      showToast.value = false
      emit('update:visible', false)
    }, props.duration)
  } else {
    showToast.value = false
  }
})

function hide() {
  clearTimeout(hideTimer)
  showToast.value = false
  emit('update:visible', false)
}
</script>

<style scoped>
.cart-toast {
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  transform: translate(-50%, 20px);
  pointer-events: none;
}
.cart-toast.show {
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
}
</style>
