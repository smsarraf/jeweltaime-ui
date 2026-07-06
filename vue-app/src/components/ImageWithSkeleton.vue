<template>
  <div class="img-skeleton-wrap" :style="{ aspectRatio: aspectRatio }">
    <!-- Shimmer skeleton -->
    <div v-if="!loaded" class="img-skeleton-shimmer"></div>
    <!-- Actual image -->
    <img
      :src="src"
      :alt="alt"
      :class="['img-skeleton-img', { 'img-skeleton-loaded': loaded }]"
      :loading="lazy ? 'lazy' : undefined"
      @load="onLoad"
      @error="onError"
    >
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  aspectRatio: { type: String, default: '1 / 1' },
  lazy: { type: Boolean, default: true }
})

const loaded = ref(false)

function onLoad() {
  loaded.value = true
}

function onError() {
  loaded.value = true
}

// Reset loaded state when src changes
watch(() => props.src, () => {
  loaded.value = false
})
</script>

<style scoped>
.img-skeleton-wrap {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
  width: 100%;
}

.img-skeleton-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-skeleton-loaded {
  opacity: 1;
}

.img-skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>