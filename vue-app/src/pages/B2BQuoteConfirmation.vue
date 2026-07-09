<template>
  <div class="b2b-confirmation-page">
    <div class="page-header">
      <div class="container">
        <h1>Quote Request Submitted!</h1>
      </div>
    </div>

    <div class="container">
      <div class="confirmation-card">
        <div class="success-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>

        <h2>Your quote request has been received</h2>

        <div class="quote-details">
          <div class="detail-row">
            <span class="label">Quote Number:</span>
            <span class="value quote-number">{{ quoteNumber }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="badge bg-info status-badge">PENDING</span>
          </div>
          <div class="detail-row">
            <span class="label">Submitted:</span>
            <span class="value">{{ submissionDate }}</span>
          </div>
        </div>

        <div class="next-steps">
          <h3>What's Next</h3>
          <ul>
            <li>
              <i class="bi bi-check-lg"></i>
              Our B2B team will review your request
            </li>
            <li>
              <i class="bi bi-check-lg"></i>
              You will receive an email when pricing is ready
            </li>
            <li>
              <i class="bi bi-check-lg"></i>
              Expected response: 24-48 business hours
            </li>
          </ul>
        </div>

        <div class="action-buttons">
          <router-link to="/b2b/quotes" class="btn btn-primary">
            <i class="bi bi-list"></i> View My Quotes
          </router-link>
          <router-link to="/b2b/products" class="btn btn-outline-primary">
            <i class="bi bi-grid"></i> Back to Catalog
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const quoteNumber = ref('')
const submissionDate = ref('')

onMounted(() => {
  quoteNumber.value = route.query.quoteNumber || 'N/A'
  
  const now = new Date()
  submissionDate.value = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.b2b-confirmation-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.confirmation-card {
  max-width: 600px;
  margin: 0 auto 3rem;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.success-icon i {
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.confirmation-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #333;
}

.quote-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-row:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.detail-row .label {
  font-weight: 600;
  color: #666;
}

.detail-row .value {
  color: #333;
}

.quote-number {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.status-badge {
  font-size: 0.875rem;
  padding: 0.35rem 0.75rem;
}

.next-steps {
  background: #e8f4fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.next-steps h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #0c5460;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #0c5460;
}

.next-steps li i {
  color: #28a745;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-buttons .btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}
</style>