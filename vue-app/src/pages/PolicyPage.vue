<template>
  <main>
    <header class="d-flex text-center breadCrumbHeader">
      <div class="alignHolder w-100 d-flex">
        <div class="align py-2 w-100">
          <div class="container">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none">Home</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ title }}</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </header>
    <section class="policyPage py-6 py-md-10">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-8 offset-md-2">
            <div v-if="loading" class="text-center py-10">
              <div class="spinner-border text-muted" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="error" class="text-center py-10">
              <h3>Page not found</h3>
              <p>The requested policy page could not be found.</p>
              <router-link to="/" class="btn btn-dark mt-3">Go Home</router-link>
            </div>
            <div v-else class="policy-content" v-html="content"></div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const title = ref('Policy')
const content = ref('')
const loading = ref(true)
const error = ref(false)

const ERP_API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const LEGACY_API = import.meta.env.VITE_LEGACY_API_URL || 'http://localhost:3001'

// Convert kebab-case slugs (legacy) to UPPER_SNAKE_CASE (ERP API format)
function toErpSlug(slug) {
  if (!slug) return slug
  // Already UPPER_SNAKE_CASE — return as-is
  if (/^[A-Z][A-Z_]*(_[A-Z][A-Z_]*)*$/.test(slug)) return slug
  return slug
    .replace(/-/g, '_')
    .replace(/and/g, 'AND')
    .toUpperCase()
}

async function fetchPolicy(slug) {
  if (!slug) {
    loading.value = false
    error.value = true
    return
  }

  loading.value = true
  error.value = false
  content.value = ''

  // Try ERP backend first (with UPPER_SNAKE_CASE conversion), then fallback to legacy server
  const erpSlug = toErpSlug(slug)
  try {
    const res = await axios.get(`${ERP_API}/api/v1/legal-policies/${erpSlug}`)
    if (res.data && (res.data.title || res.data.contentHtml)) {
      title.value = res.data.title || ''
      content.value = res.data.contentHtml || ''
      loading.value = false
      return
    }
  } catch (e) {
    // ERP legal-policies endpoint failed — try legacy server
  }

  try {
    const res = await axios.get(`${LEGACY_API}/api/policies/${slug}`)
    if (res.data.success) {
      title.value = res.data.data.title
      content.value = res.data.data.content
    } else {
      error.value = true
    }
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPolicy(route.params.slug)
})

// Re-fetch when navigating between policy pages (same component, different slug)
watch(() => route.params.slug, (newSlug) => {
  fetchPolicy(newSlug)
})
</script>

<style scoped>
.policy-content {
  line-height: 1.8;
  color: #333;
}
.policy-content :deep(h1) {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: #000;
}
.policy-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
}
.policy-content :deep(p) {
  margin-bottom: 1rem;
}
.policy-content :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}
.policy-content :deep(li) {
  margin-bottom: 0.5rem;
}
</style>