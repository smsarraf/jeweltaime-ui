<template>
  <div class="social-login-wrap">
    <div class="divider text-center mb-4">
      <span class="px-3 text-muted small">or continue with</span>
    </div>
    <div class="d-flex flex-column gap-3">
      <!-- Google Login -->
      <a :href="googleAuthUrl" class="btn btn-outline-dark d-flex align-items-center justify-content-center gap-3 py-2 social-btn">
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
          <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
          <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
          <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
        </svg>
        <span class="fw-medium">Continue with Google</span>
      </a>

      <!-- Facebook Login -->
      <a :href="facebookAuthUrl" class="btn btn-outline-dark d-flex align-items-center justify-content-center gap-3 py-2 social-btn">
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4C12.954 4 4 12.954 4 24c0 9.88 7.314 18.066 16.875 19.55V29.75h-5.078V24h5.078v-4.406c0-5.013 2.986-7.782 7.555-7.782 2.188 0 4.476.39 4.476.39v4.922h-2.522c-2.484 0-3.259 1.542-3.259 3.125V24h5.547l-.887 5.75h-4.66v13.8C36.686 42.066 44 33.88 44 24c0-11.046-8.954-20-20-20z" fill="#1877F2"/>
          <path d="M30.66 29.75l.887-5.75H26v-3.75c0-1.583.775-3.125 3.259-3.125h2.522V12.203s-2.288-.39-4.476-.39c-4.569 0-7.555 2.77-7.555 7.782V24h-5.078v5.75h5.078v13.8c1.02.16 2.06.25 3.125.25s2.105-.09 3.125-.25V29.75h4.66z" fill="#fff"/>
        </svg>
        <span class="fw-medium">Continue with Facebook</span>
      </a>

      <!-- Instagram Login -->
      <a :href="instagramAuthUrl" class="btn btn-outline-dark d-flex align-items-center justify-content-center gap-3 py-2 social-btn">
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <radialGradient id="instagramGradient" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#fdf497"/>
            <stop offset="5%" stop-color="#fdf497"/>
            <stop offset="45%" stop-color="#fd5949"/>
            <stop offset="50%" stop-color="#d6249f"/>
            <stop offset="90%" stop-color="#285AEB"/>
            <stop offset="100%" stop-color="#285AEB"/>
          </radialGradient>
          <path d="M24 4C14.06 4 4 14.06 4 24s10.06 20 20 20 20-10.06 20-20S33.94 4 24 4z" fill="url(#instagramGradient)"/>
          <path d="M33 14H15c-.55 0-1 .45-1 1v18c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V15c0-.55-.45-1-1-1zm-9 5.5c2.48 0 4.5 2.02 4.5 4.5s-2.02 4.5-4.5 4.5-4.5-2.02-4.5-4.5 2.02-4.5 4.5-4.5zM33 31c0 .55-.45 1-1 1H16c-.55 0-1-.45-1-1v-6.5h2.02c-.14.48-.22.99-.22 1.5 0 3.31 2.69 6 6 6s6-2.69 6-6c0-.51-.08-1.02-.22-1.5H33V31z" fill="#fff"/>
        </svg>
        <span class="fw-medium">Continue with Instagram</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const googleAuthUrl = computed(() => `${API_BASE}/api/auth/social/google`)
const facebookAuthUrl = computed(() => `${API_BASE}/api/auth/social/facebook`)
const instagramAuthUrl = computed(() => `${API_BASE}/api/auth/social/instagram`)
</script>

<style scoped>
.divider {
  position: relative;
  border-top: 1px solid #dee2e6;
  margin-top: 1.5rem;
}
.divider span {
  position: relative;
  top: -0.75rem;
  background: #fff;
  display: inline-block;
}
.social-btn {
  border-radius: 0;
  transition: all 0.2s ease;
}
.social-btn:hover {
  background-color: #f8f9fa;
  border-color: #1a1a1a;
}
</style>