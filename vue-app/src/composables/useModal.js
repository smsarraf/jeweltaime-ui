import { reactive } from 'vue'

// Singleton reactive state shared across the whole app so the modal can be
// triggered from anywhere (pages, stores, services) and rendered once in App.vue.
const state = reactive({
  visible: false,
  title: '',
  message: '',
  type: 'ok', // 'ok' | 'yesno'
  confirmText: 'OK',
  cancelText: 'No',
  variant: 'primary', // bootstrap button variant for the confirm button
  onConfirm: null,
  onCancel: null
})

export function useModal() {
  function showModal(options = {}) {
    state.title = options.title || ''
    state.message = options.message || ''
    state.type = options.type || 'ok'
    state.variant = options.variant || 'primary'
    state.confirmText = options.confirmText || (options.type === 'yesno' ? 'Yes' : 'OK')
    state.cancelText = options.cancelText || 'No'
    state.onConfirm = options.onConfirm || null
    state.onCancel = options.onCancel || null
    state.visible = true
  }

  // Convenience helper that resolves a Promise<boolean> for confirm-style dialogs.
  function confirmModal(options = {}) {
    return new Promise((resolve) => {
      showModal({
        ...options,
        type: 'yesno',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      })
    })
  }

  function closeModal() {
    state.visible = false
  }

  function handleConfirm() {
    const cb = state.onConfirm
    state.visible = false
    state.onConfirm = null
    state.onCancel = null
    if (typeof cb === 'function') cb()
  }

  function handleCancel() {
    const cb = state.onCancel
    state.visible = false
    state.onConfirm = null
    state.onCancel = null
    if (typeof cb === 'function') cb()
  }

  return { state, showModal, confirmModal, closeModal, handleConfirm, handleCancel }
}