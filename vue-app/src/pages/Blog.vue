<template>
  <main>
    <header class="bannerHead bannerheader w-100 overflow-hidden position-relative d-flex text-center">
      <div class="alignHolder w-100 d-flex">
        <div class="align my-auto py-2 w-100">
          <div class="container headingHead">
            <h1 class="hhHeading HDii">Our Blog</h1>
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb justify-content-center">
                <li class="breadcrumb-item">
                  <router-link to="/" class="text-decoration-none">Home</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Our Blog</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <span class="bgCover w-100 h-100 position-absolute bhBgImage" style="background-image: url(https://cdn.jeweltaime.com/img63.jpg);"></span>
    </header>

    <section class="itemContentBlock pt-8 pb-10 pt-lg-14 pb-lg-14">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-10">
          <div class="spinner-border text-dark" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading blog posts...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-10">
          <p class="text-muted">{{ error }}</p>
          <button class="btn btn-outline-dark mt-3" @click="fetchBlogs">Try Again</button>
        </div>

        <!-- Blog Grid -->
        <div v-else>
          <div class="row row-gap-6">
            <div class="col-12 col-md-6 col-lg-4" v-for="post in blogPosts" :key="post.id">
              <router-link :to="`/blog/${post.slug}`" class="blogColumn overflow-hidden d-block text-decoration-none">
                <div class="imgHolder mb-5 position-relative">
                  <ImageWithSkeleton :src="post.coverImageUrl || 'https://placehold.co/435x285'" :alt="post.title" aspect-ratio="435 / 285" />
                  <strong class="position-absolute fw-medium text-uppercase blgTag py-1 px-2" v-if="post.keywords && post.keywords.length">{{ post.keywords[0] }}</strong>
                </div>
                <div class="blgTitle mb-2">
                  <strong class="blgAuthor fw-normal">{{ post.author?.fullName || post.author?.username || 'Admin' }}</strong>
                  -
                  <time class="fw-normal" :datetime="post.publishDate">{{ formatDate(post.publishDate) }}</time>
                </div>
                <h3 class="fw-medium blgHeading mb-4">{{ post.title }}</h3>
                <span class="btnLink">Continue Reading</span>
              </router-link>
            </div>
          </div>

          <!-- No posts -->
          <div v-if="!loading && blogPosts.length === 0" class="text-center py-10">
            <h4 class="mb-3">No blog posts yet.</h4>
            <p class="text-muted">Check back soon for new articles.</p>
          </div>

          <!-- Pagination -->
          <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-8">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 0 }">
                <a class="page-link" href="javascript:void(0);" @click="goToPage(currentPage - 1)">Previous</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
                <a class="page-link" href="javascript:void(0);" @click="goToPage(page - 1)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                <a class="page-link" href="javascript:void(0);" @click="goToPage(currentPage + 1)">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ImageWithSkeleton from '../components/ImageWithSkeleton.vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081'

const blogPosts = ref([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(0)
const totalPages = ref(0)
const pageSize = 9

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()
}

async function fetchBlogs() {
  loading.value = true
  error.value = ''

  try {
    const res = await axios.get(`${API_BASE}/api/v1/blogs/published`, {
      params: {
        page: currentPage.value,
        size: pageSize,
        sort: ['publishDate,desc']
      }
    })

    if (res.data) {
      blogPosts.value = res.data.content || []
      totalPages.value = res.data.totalPages || 0
    }
  } catch (e) {
    console.warn('Failed to fetch blogs:', e.message)
    error.value = 'Unable to load blog posts. Please try again later.'
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 0 || page >= totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchBlogs()
}

onMounted(() => {
  fetchBlogs()
})
</script>