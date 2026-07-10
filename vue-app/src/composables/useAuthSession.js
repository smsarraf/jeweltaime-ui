import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

const AUTH_CHANGED_EVENT = 'auth-changed'

function parseUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useAuthSession() {
  const token = ref(localStorage.getItem('authToken') || '')
  const user = ref(parseUser())

  const refresh = () => {
    token.value = localStorage.getItem('authToken') || ''
    user.value = parseUser()
  }

  onMounted(() => {
    window.addEventListener('storage', refresh)
    window.addEventListener(AUTH_CHANGED_EVENT, refresh)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', refresh)
    window.removeEventListener(AUTH_CHANGED_EVENT, refresh)
  })

  return {
    token,
    user,
    isLoggedIn: computed(() => !!token.value),
    refresh
  }
}
