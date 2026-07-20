<template>
  <div class="product-reviews mt-8">
    <h4 class="fw-medium mb-4">Customer Reviews ({{ reviews.length }})</h4>

    <!-- Review Summary -->
    <div v-if="reviews.length > 0" class="review-summary d-flex align-items-center gap-4 mb-5 p-4 bg-light">
      <div class="text-center">
        <div class="display-6 fw-bold">{{ averageRating.toFixed(1) }}</div>
        <ul class="d-flex justify-content-center list-unstyled mb-1 gap-1">
          <li v-for="star in 5" :key="star">
            <i :class="star <= Math.round(averageRating) ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star text-muted'"></i>
          </li>
        </ul>
        <small class="text-muted">{{ reviews.length }} review(s)</small>
      </div>
      <div class="flex-grow-1">
        <div v-for="star in 5" :key="star" class="d-flex align-items-center gap-2 mb-1">
          <small class="text-nowrap" style="width: 40px;">{{ 6 - star }} <i class="fa-solid fa-star text-warning" style="font-size: 0.65rem;"></i></small>
          <div class="progress flex-grow-1" style="height: 6px;">
            <div class="progress-bar bg-warning" :style="{ width: starPercentage(6 - star) + '%' }"></div>
          </div>
          <small style="width: 30px;">{{ ratingCounts[6 - star] || 0 }}</small>
        </div>
      </div>
    </div>

    <!-- Review Form -->
    <div v-if="canReview" class="review-form border p-4 mb-5">
      <h5 class="fw-medium mb-3">{{ isLoggedIn ? 'Write a Review' : 'Sign in to Review' }}</h5>
      <template v-if="isLoggedIn">
        <div class="mb-3">
          <label class="form-label fw-normal">Your Rating</label>
          <div class="d-flex gap-1">
            <a v-for="star in 5" :key="star" href="javascript:void(0);" @click="newRating = star"
              class="text-decoration-none fs-5" :class="star <= newRating ? 'text-warning' : 'text-muted'">
              <i :class="star <= newRating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
            </a>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-normal">Title <span class="text-muted">(optional)</span></label>
          <input type="text" class="form-control rounded-0" v-model="newTitle" placeholder="Summarize your review" maxlength="100">
        </div>
        <div class="mb-3">
          <label class="form-label fw-normal">Review</label>
          <textarea class="form-control rounded-0" rows="3" v-model="newComment" placeholder="Share your experience with this product" maxlength="1000"></textarea>
        </div>
        <button class="btn btn-dark rounded-0" :disabled="submittingReview || !newRating || !newComment.trim()" @click="submitReview">
          <span v-if="submittingReview"><span class="spinner-border spinner-border-sm me-2"></span>Submitting...</span>
          <span v-else>Submit Review</span>
        </button>
        <small v-if="reviewError" class="d-block text-danger mt-2">{{ reviewError }}</small>
        <small v-if="reviewSuccess" class="d-block text-success mt-2">{{ reviewSuccess }}</small>
      </template>
      <template v-else>
        <p class="text-muted">Please <router-link to="/signin">sign in</router-link> to write a review.</p>
      </template>
    </div>

    <!-- Review List -->
    <div v-if="reviews.length > 0">
      <div v-for="review in publishedReviews" :key="review.id" class="review-item border-bottom pb-4 mb-4">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <ul class="d-flex gap-1 list-unstyled mb-1">
              <li v-for="star in 5" :key="star">
                <i :class="star <= review.rating ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star text-muted'" style="font-size: 0.75rem;"></i>
              </li>
            </ul>
            <strong class="d-block small">{{ review.commentTitle || '' }}</strong>
            <small class="text-muted">by {{ reviewerName(review) }}</small>
          </div>
          <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
        </div>
        <p class="mb-1 small">{{ review.commentText }}</p>
        <div class="d-flex align-items-center gap-3">
          <small v-if="review.isVerifiedPurchase" class="text-success"><i class="fa-solid fa-circle-check me-1"></i>Verified Purchase</small>
          <small v-if="review.helpfulCount > 0" class="text-muted">
            <i class="fa-regular fa-thumbs-up me-1"></i>{{ review.helpfulCount }} found helpful
          </small>
        </div>
      </div>
    </div>
    <div v-else-if="!reviewsLoading" class="text-muted py-3">
      <p>No reviews yet. Be the first to review this product.</p>
    </div>

    <!-- Loading -->
    <div v-if="reviewsLoading" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-dark" role="status"></div>
      <p class="mt-2 text-muted small">Loading reviews...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE, isAuthenticated } from '../services/apiConfig'

const props = defineProps({
  productId: { type: [Number, String], required: true }
})

const reviews = ref([])
const reviewsLoading = ref(false)
const isLoggedIn = ref(false)
const canReview = computed(() => true) // Always show review form

const newRating = ref(0)
const newTitle = ref('')
const newComment = ref('')
const submittingReview = ref(false)
const reviewError = ref('')
const reviewSuccess = ref('')

// Only show published reviews in the list
const publishedReviews = computed(() =>
  reviews.value.filter(r => r.isPublished !== false)
)

const averageRating = computed(() => {
  if (!publishedReviews.value.length) return 0
  return publishedReviews.value.reduce((s, r) => s + (r.rating || 0), 0) / publishedReviews.value.length
})

const ratingCounts = computed(() => {
  const counts = {}
  publishedReviews.value.forEach(r => {
    counts[r.rating] = (counts[r.rating] || 0) + 1
  })
  return counts
})

function starPercentage(star) {
  if (!publishedReviews.value.length) return 0
  return ((ratingCounts.value[star] || 0) / publishedReviews.value.length) * 100
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return dateStr }
}

function reviewerName(review) {
  if (review.user?.fullName) return review.user.fullName
  if (review.user?.username) return review.user.username
  if (review.userName) return review.userName
  return 'Anonymous'
}

async function fetchReviews() {
  if (!props.productId) return
  reviewsLoading.value = true
  try {
    const res = await axios.get(`${API_BASE}/api/v1/products/${props.productId}/reviews`)
    reviews.value = Array.isArray(res.data) ? res.data : (res.data?.content || [])
  } catch {
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}

async function submitReview() {
  if (!newRating.value || !newComment.value.trim()) return
  reviewError.value = ''
  reviewSuccess.value = ''
  submittingReview.value = true
  try {
    const payload = {
      rating: newRating.value,
      commentTitle: newTitle.value.trim() || undefined,
      commentText: newComment.value.trim()
    }
    await axios.post(`${API_BASE}/api/v1/products/${props.productId}/reviews`, payload)
    reviewSuccess.value = 'Thank you! Your review has been submitted.'
    newRating.value = 0
    newTitle.value = ''
    newComment.value = ''
    await fetchReviews()
  } catch (e) {
    if (e.response?.status === 401) {
      reviewError.value = 'Please sign in to submit a review.'
    } else {
      reviewError.value = e.response?.data?.message || e.response?.data?.error || 'Failed to submit review. Please try again.'
    }
  } finally {
    submittingReview.value = false
  }
}

onMounted(() => {
  isLoggedIn.value = isAuthenticated()
  fetchReviews()
})

watch(() => props.productId, () => {
  fetchReviews()
})
</script>

<style scoped>
.review-summary {
  border-radius: 8px;
}
.review-item:last-child {
  border-bottom: none !important;
}
</style>