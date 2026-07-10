<template>
  <div v-if="state.visible" class="app-modal-overlay" @click.self="handleCancel">
    <div class="app-modal-dialog" role="dialog" aria-modal="true">
      <div class="app-modal-content">
        <div v-if="state.title" class="app-modal-header">
          <h5 class="app-modal-title">{{ state.title }}</h5>
        </div>
        <div class="app-modal-body">
          <p class="mb-0">{{ state.message }}</p>
        </div>
        <div class="app-modal-footer">
          <button
            v-if="state.type === 'yesno'"
            type="button"
            class="btn btn-outline-secondary"
            @click="handleCancel"
          >
            {{ state.cancelText }}
          </button>
          <button
            type="button"
            class="btn"
            :class="`btn-${state.variant}`"
            @click="handleConfirm"
          >
            {{ state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useModal } from '../composables/useModal'

const { state, handleConfirm, handleCancel } = useModal()
</script>

<style scoped>
.app-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}
.app-modal-dialog {
  max-width: 440px;
  width: 100%;
}
.app-modal-content {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}
.app-modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}
.app-modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}
.app-modal-body {
  padding: 1.5rem;
  font-size: 1rem;
  color: #333;
}
.app-modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>