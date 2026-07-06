<template>
  <div class="image-upload-wrap">
    <!-- Upload Area -->
    <div
      class="upload-area border rounded-0 p-4 text-center position-relative"
      :class="{ 'drag-over': isDragging, 'has-preview': previewUrl, 'is-uploading': uploading }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="d-none"
        @change="onFileSelect"
      />

      <!-- Loading State -->
      <div v-if="uploading" class="py-3">
        <div class="spinner-border text-dark spinner-border-sm mb-2" role="status">
          <span class="visually-hidden">Uploading...</span>
        </div>
        <p class="text-muted small mb-0">{{ uploadProgressText }}</p>
      </div>

      <!-- Preview State -->
      <div v-else-if="previewUrl" class="position-relative">
        <img :src="previewUrl" class="img-fluid upload-preview" :alt="label || 'Upload preview'" style="max-height: 200px;">
        <button
          v-if="!uploading && showRemove"
          class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
          style="width: 28px; height: 28px; padding: 0;"
          @click.stop="removeImage"
          title="Remove"
        >×</button>
        <p v-if="uploadedUrl" class="text-success small mt-2 mb-0">
          <i class="fa-solid fa-circle-check me-1"></i>Uploaded
        </p>
      </div>

      <!-- Empty State -->
      <div v-else class="py-3">
        <i class="fa-solid fa-cloud-arrow-up text-muted mb-2" style="font-size: 1.5rem;"></i>
        <p class="text-muted small mb-1">{{ label || 'Drop image here or click to upload' }}</p>
        <p class="text-muted smaller mb-0" v-if="acceptHint">{{ acceptHint }}</p>
      </div>

      <!-- Upload Progress Bar -->
      <div v-if="uploading && uploadProgress > 0" class="progress mt-2" style="height: 4px;">
        <div
          class="progress-bar bg-dark"
          :style="{ width: uploadProgress + '%' }"
          role="progressbar"
        ></div>
      </div>
    </div>

    <!-- Uploaded URLs (for multiple mode) -->
    <div v-if="multiple && uploadedUrls.length > 0 && !uploading" class="mt-2">
      <div
        v-for="(url, idx) in uploadedUrls"
        :key="idx"
        class="d-flex align-items-center justify-content-between bg-light p-2 mb-1 border"
      >
        <small class="text-truncate me-2" style="max-width: 80%;">{{ truncateUrl(url) }}</small>
        <button
          class="btn btn-sm text-danger border-0 p-0"
          @click="removeUploadedUrl(idx)"
          title="Remove"
        ><i class="fa-solid fa-times"></i></button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger rounded-0 py-2 mt-2 mb-0">
      <small><i class="fa-solid fa-circle-exclamation me-1"></i>{{ errorMessage }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { uploadFile, uploadFiles, uploadVariantImage, uploadVariantImages } from '../utils/upload'

const props = defineProps({
  /** Display label for the upload area */
  label: { type: String, default: 'Drop image here or click to upload' },
  /** Accepted file types (e.g., 'image/*') */
  accept: { type: String, default: 'image/*' },
  /** Allow multiple file selection */
  multiple: { type: Boolean, default: false },
  /** Upload mode: 'product' | 'variant' | 'general' (product uses CMS media, variant uses variant-specific endpoint) */
  mode: { type: String, default: 'general', validator: v => ['product', 'variant', 'general'].includes(v) },
  /** Variant ID (required when mode='variant') */
  variantId: { type: [Number, String], default: null },
  /** Current/initial image URL to show as preview */
  currentUrl: { type: String, default: '' },
  /** Accept hint text */
  acceptHint: { type: String, default: 'PNG, JPG, WebP up to 5MB' },
  /** Whether to show the remove button */
  showRemove: { type: Boolean, default: true }
})

const emit = defineEmits(['uploaded', 'removed', 'error'])

const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const isDragging = ref(false)
const uploadedUrl = ref(props.currentUrl || '')
const uploadedUrls = ref([])

const previewUrl = computed(() => uploadedUrl.value || null)
const uploadProgressText = computed(() => {
  if (!uploading.value) return ''
  if (uploadProgress.value >= 100) return 'Processing...'
  return `Uploading... ${uploadProgress.value}%`
})

function triggerInput() {
  if (uploading.value) return
  fileInput.value?.click()
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFiles(files)
  }
}

function onFileSelect(e) {
  const files = e.target.files
  if (files && files.length > 0) {
    handleFiles(files)
  }
  // Reset input so the same file can be selected again
  if (fileInput.value) fileInput.value.value = ''
}

async function handleFiles(fileList) {
  errorMessage.value = ''

  // Validate files
  const files = Array.from(fileList)
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Only image files are allowed.'
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'File size must be under 5MB.'
      return
    }
  }

  uploading.value = true
  uploadProgress.value = 10

  try {
    let result

    if (props.mode === 'variant' && props.variantId) {
      // Upload variant image(s) using variant endpoint
      uploadProgress.value = 30
      if (props.multiple) {
        result = await uploadVariantImages(props.variantId, files)
        uploadedUrls.value = result.map(r => r.url || r)
      } else {
        result = await uploadVariantImage(props.variantId, files[0])
        uploadedUrl.value = result.url || result
      }
    } else {
      // Upload product thumbnail or general file via CMS media endpoint
      uploadProgress.value = 30
      const altText = props.mode === 'product'
        ? (props.label || 'Product image')
        : (files[0]?.name || '')

      if (props.multiple) {
        const mediaResponses = await uploadFiles(files)
        uploadedUrls.value = mediaResponses.map(m => m.url)
        result = mediaResponses
      } else {
        const mediaResponse = await uploadFile(files[0], altText)
        uploadedUrl.value = mediaResponse.url
        result = mediaResponse
      }
    }

    uploadProgress.value = 100
    emit('uploaded', result)

    // Reset progress after a brief delay for visual feedback
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)
  } catch (e) {
    console.error('Upload failed:', e.message)
    errorMessage.value = e.response?.data?.error || e.message || 'Upload failed. Please try again.'
    uploading.value = false
    uploadProgress.value = 0
    emit('error', e)
  }
}

function removeImage() {
  uploadedUrl.value = ''
  uploadedUrls.value = []
  emit('removed')
}

function removeUploadedUrl(index) {
  uploadedUrls.value.splice(index, 1)
  emit('removed', index)
}

function truncateUrl(url) {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const filename = parsed.pathname.split('/').pop() || url
    return decodeURIComponent(filename).substring(0, 40)
  } catch {
    return url.substring(0, 40)
  }
}

function reset() {
  uploadedUrl.value = ''
  uploadedUrls.value = []
  errorMessage.value = ''
  uploading.value = false
  uploadProgress.value = 0
}

// Expose reset method to parent
defineExpose({ reset })
</script>

<style scoped>
.upload-area {
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  background-color: #fafafa;
  min-height: 100px;
}
.upload-area:hover {
  border-color: #000 !important;
  background-color: #f5f5f5;
}
.upload-area.drag-over {
  border-color: #000 !important;
  background-color: #f0f0f0;
  border-style: dashed;
}
.upload-area.has-preview {
  padding: 0.5rem !important;
}
.upload-area.is-uploading {
  cursor: wait;
}
.upload-preview {
  max-height: 200px;
  width: auto;
  object-fit: contain;
}
.smaller {
  font-size: 0.75rem;
}
</style>