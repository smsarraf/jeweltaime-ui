<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/blog" class="text-decoration-none">Blog</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ post?.title || 'Blog Post' }}</li>
        </ol>
      </nav>
    </div>

    <!-- Loading -->
    <section v-if="loading" class="py-10">
      <div class="container text-center">
        <div class="spinner-border text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading blog post...</p>
      </div>
    </section>

    <!-- Error / Not Found -->
    <section v-else-if="error" class="py-10">
      <div class="container text-center">
        <h3 class="mb-3">Post Not Found</h3>
        <p class="text-muted mb-4">{{ error }}</p>
        <router-link to="/blog" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Back to Blog</router-link>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section v-else class="blogDetailWrap py-7 py-md-10">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            <!-- Cover Image -->
            <div v-if="post.coverImageUrl" class="mb-6">
              <ImageWithSkeleton :src="post.coverImageUrl" :alt="post.title" aspect-ratio="16 / 9" />
            </div>

            <!-- Meta -->
            <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
              <span class="text-muted small">
                <i class="fa-regular fa-user me-1"></i>
                {{ post.author?.fullName || post.author?.username || 'Admin' }}
              </span>
              <span class="text-muted small">
                <i class="fa-regular fa-calendar me-1"></i>
                {{ formatDate(post.publishDate) }}
              </span>
              <span v-if="post.keywords && post.keywords.length" class="d-flex flex-wrap gap-1">
                <span v-for="kw in post.keywords" :key="kw" class="badge bg-light text-dark rounded-0">{{ kw }}</span>
              </span>
            </div>

            <!-- Title -->
            <h1 class="fw-medium mb-4">{{ post.title }}</h1>

            <!-- Excerpt -->
            <p v-if="post.excerpt" class="lead text-muted mb-5">{{ post.excerpt }}</p>

            <!-- Content -->
            <div class="blog-content" v-html="post.contentHtml"></div>

            <!-- Meta Description (SEO) -->
            <div v-if="post.metaDescription" class="mt-6 pt-4 border-top">
              <p class="text-muted small mb-0">
                <strong>{{ post.metaTitle || 'Meta' }}:</strong> {{ post.metaDescription }}
              </p>
            </div>

            <!-- External Link -->
            <div v-if="post.externalLink" class="mt-4">
              <a :href="post.externalLink" target="_blank" rel="noopener" class="btn btn-outline-dark rounded-0">
                <i class="fa-solid fa-external-link-alt me-2"></i>Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Posts -->
    <section v-if="!loading && !error && relatedPosts.length > 0" class="py-7 bg-light">
      <div class="container">
        <h3 class="fw-medium mb-5 text-center">Related Articles</h3>
        <div class="row row-gap-4">
          <div class="col-12 col-md-4" v-for="related in relatedPosts" :key="related.id">
            <router-link :to="`/blog/${related.slug}`" class="text-decoration-none">
              <div class="card rounded-0 border h-100">
                <ImageWithSkeleton :src="related.coverImageUrl || 'https://placehold.co/435x200'" :alt="related.title" aspect-ratio="435 / 200" />
                <div class="card-body">
                  <h5 class="card-title fw-medium">{{ related.title }}</h5>
                  <p class="card-text text-muted small" v-if="related.excerpt">{{ truncate(related.excerpt, 80) }}</p>
                  <span class="text-dark small fw-medium">Read More →</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ImageWithSkeleton from '../components/ImageWithSkeleton.vue'
import axios from 'axios'

const route = useRoute()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const post = ref(null)
const relatedPosts = ref([])
const loading = ref(true)
const error = ref('')

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })
}

function truncate(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

async function fetchPost() {
  loading.value = true
  error.value = ''

  const slug = route.params.slug
  if (!slug) {
    error.value = 'No blog post specified.'
    loading.value = false
    return
  }

  try {
    const res = await axios.get(`${API_BASE}/api/v1/blogs/slug/${encodeURIComponent(slug)}`)
    if (res.data && res.data.id) {
      post.value = res.data
    } else {
      error.value = 'Blog post not found.'
    }
  } catch (e) {
    console.warn('Failed to fetch blog post:', e.message)
    if (e.response?.status === 404) {
      error.value = 'The blog post you are looking for does not exist.'
    } else {
      error.value = 'Unable to load the blog post. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}

async function fetchRelatedPosts() {
  if (!post.value?.keywords || post.value.keywords.length === 0) return

  try {
    const res = await axios.get(`${API_BASE}/api/v1/blogs/search`, {
      params: {
        keywords: post.value.keywords.slice(0, 3),
        page: 0,
        size: 3,
        sort: ['publishDate,desc']
      }
    })

    if (res.data && res.data.content) {
      // Exclude current post
      relatedPosts.value = res.data.content.filter(p => p.id !== post.value.id).slice(0, 3)
    } else if (Array.isArray(res.data)) {
      relatedPosts.value = res.data.filter(p => p.id !== post.value.id).slice(0, 3)
    }
  } catch (e) {
    console.warn('Failed to fetch related posts:', e.message)
  }
}

onMounted(async () => {
  await fetchPost()
  if (post.value) {
    await fetchRelatedPosts()
  }
})
</script>

<style scoped>
.blog-content {
  line-height: 1.8;
  color: #333;
  font-size: 1.05rem;
}
.blog-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #000;
}
.blog-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}
.blog-content :deep(p) {
  margin-bottom: 1.25rem;
}
.blog-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
}
.blog-content :deep(blockquote) {
  border-left: 3px solid #000;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #555;
  font-style: italic;
}
.blog-content :deep(ul), .blog-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}
.blog-content :deep(li) {
  margin-bottom: 0.5rem;
}
.blog-content :deep(a) {
  color: #000;
  text-decoration: underline;
}
.lead {
  font-size: 1.15rem;
  line-height: 1.7;
}
</style>