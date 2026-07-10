<template>
  <div class="gift-service-selector">
    <div class="form-group d-block">
      <span class="fLabel fw-normal text-capitalize d-block mb-3">{{ item.name }} - Gift Options</span>

      <!-- No Service Option -->
      <div class="gift-option-card mb-3">
        <label class="gift-option-label">
          <input
            type="radio"
            class="gift-option-radio"
            :value="''"
            :checked="modelValue === ''"
            @change="$emit('update:modelValue', '')"
          >
          <span class="gift-option-content">
            <span class="gift-option-title">No Additional Service</span>
            <span class="gift-option-price">Free</span>
          </span>
        </label>
      </div>

      <!-- Gift Card Options -->
      <div
        v-for="card in normalizedGiftCards"
        :key="`card-${card.id}`"
        class="gift-option-card mb-3"
      >
        <label class="gift-option-label">
          <input
            type="radio"
            class="gift-option-radio"
            :value="`CARD:${card.id}`"
            :checked="modelValue === `CARD:${card.id}`"
            @change="$emit('update:modelValue', `CARD:${card.id}`)"
          >
          <div class="gift-option-content">
            <div class="gift-option-header">
              <span class="gift-option-title">{{ card.name || 'Gift Card' }}</span>
              <span class="gift-option-price">+{{ formatPrice(Number(card.price) || 0) }}</span>
            </div>
            <!-- Gift Card Image -->
            <div v-if="card.imageUrl" class="gift-option-media mt-2">
              <img :src="card.imageUrl" :alt="card.name || 'Gift Card'" class="gift-card-img" @click.stop="openMediaModal('image', card.imageUrl, card.name || 'Gift Card')">
            </div>
            <!-- Gift Card Video -->
            <div v-if="card.videoUrl" class="gift-option-media mt-2">
              <video :src="card.videoUrl" class="gift-card-video" controls @click.stop="openMediaModal('video', card.videoUrl, card.name || 'Gift Card')"></video>
            </div>
          </div>
        </label>
      </div>

      <!-- Gift Box Options -->
      <div v-for="box in giftBoxes" :key="box.id" class="gift-option-card mb-3">
        <label class="gift-option-label">
          <input
            type="radio"
            class="gift-option-radio"
            :value="`BOX:${box.id}`"
            :checked="modelValue === `BOX:${box.id}`"
            @change="$emit('update:modelValue', `BOX:${box.id}`)"
          >
          <div class="gift-option-content">
            <div class="gift-option-header">
              <span class="gift-option-title">{{ box.name }}</span>
              <span class="gift-option-price">+{{ formatPrice(box.priceUsd || 0) }}</span>
            </div>
            <p v-if="box.description" class="gift-option-description">{{ box.description }}</p>
            <!-- Gift Box Image -->
            <div v-if="box.imageUrl" class="gift-option-media mt-2">
              <img :src="box.imageUrl" :alt="box.name" class="gift-box-img" @click.stop="openMediaModal('image', box.imageUrl, box.name)">
            </div>
            <!-- Gift Box Video -->
            <div v-if="box.videoUrl" class="gift-option-media mt-2">
              <video :src="box.videoUrl" class="gift-box-video" controls @click.stop="openMediaModal('video', box.videoUrl, box.name)"></video>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Gift Note Text Area -->
    <div class="form-group mt-3">
      <label class="fLabel fw-normal text-capitalize d-block mb-2">Gift Note (Optional)</label>
      <textarea
        class="form-control d-block w-100"
        :value="giftNote"
        @input="$emit('update:giftNote', $event.target.value)"
        placeholder="Add a personal message..."
        rows="3"
      ></textarea>
    </div>

    <!-- Media Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeMediaModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeMediaModal">&times;</button>
        <div class="modal-body">
          <img v-if="modalType === 'image'" :src="modalSrc" :alt="modalTitle" class="modal-img">
          <video v-else-if="modalType === 'video'" :src="modalSrc" controls class="modal-video"></video>
        </div>
        <div class="modal-footer">
          <p class="modal-title">{{ modalTitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  giftNote: {
    type: String,
    default: ''
  },
  giftBoxes: {
    type: Array,
    default: () => []
  },
  giftCards: {
    type: Array,
    default: () => []
  },
  giftCardPrice: {
    type: Number,
    default: 5
  },
  giftCardImage: {
    type: String,
    default: ''
  },
  giftCardVideo: {
    type: String,
    default: ''
  },
  formatPrice: {
    type: Function,
    default: (price) => `$${price.toFixed(2)}`
  }
})

const emit = defineEmits(['update:modelValue', 'update:giftNote'])

const normalizedGiftCards = computed(() => {
  if (props.giftCards.length > 0) {
    return props.giftCards
  }

  if (props.giftCardImage || props.giftCardVideo || props.giftCardPrice) {
    return [{
      id: 'default',
      name: 'Gift Card',
      price: props.giftCardPrice,
      imageUrl: props.giftCardImage,
      videoUrl: props.giftCardVideo
    }]
  }

  return []
})

// Modal state
const showModal = ref(false)
const modalType = ref('image')
const modalSrc = ref('')
const modalTitle = ref('')

const openMediaModal = (type, src, title) => {
  modalType.value = type
  modalSrc.value = src
  modalTitle.value = title
  showModal.value = true
}

const closeMediaModal = () => {
  showModal.value = false
  modalSrc.value = ''
  modalTitle.value = ''
}
</script>

<style scoped>
.gift-service-selector {
  margin-top: 1rem;
}

.gift-option-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.gift-option-card:hover {
  border-color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gift-option-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  gap: 1rem;
  width: 100%;
}

.gift-option-radio {
  margin-top: 0.25rem;
  cursor: pointer;
  flex-shrink: 0;
}

.gift-option-content {
  flex: 1;
  width: 100%;
}

.gift-option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.gift-option-title {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.gift-option-price {
  color: #28a745;
  font-weight: 600;
  white-space: nowrap;
}

.gift-option-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0.5rem 0 0;
}

.gift-option-media {
  max-height: 200px;
  overflow: hidden;
  border-radius: 4px;
  background: #f9f9f9;
}

.gift-box-img,
.gift-card-img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  cursor: pointer;
  display: block;
  transition: transform 0.2s ease;
}

.gift-box-img:hover,
.gift-card-img:hover {
  transform: scale(1.05);
}

.gift-box-video,
.gift-card-video {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1051;
  transition: background 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 1);
}

.modal-body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem 1rem;
}

.modal-img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-video {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
  text-align: center;
}

.modal-title {
  margin: 0;
  font-weight: 600;
  color: #333;
}

/* Textarea Styling */
.form-control {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
}

.form-control:focus {
  border-color: #000;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1);
}
</style>
