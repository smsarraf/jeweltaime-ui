<template>
  <main>
    <hr class="my-0 br">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">Home</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">My Invoices</li>
        </ol>
      </nav>
    </div>

    <section class="carttablewrap py-7">
      <div class="container">
        <div v-if="!isLoggedIn" class="text-center py-10">
          <h3>Please Sign In</h3>
          <router-link to="/signin" class="btn btn-dark rounded-0 mt-3">Sign In</router-link>
        </div>

        <div v-else-if="loading" class="row g-3">
          <div v-for="i in 3" :key="`inv-s-${i}`" class="col-12"><div class="border p-4 placeholder-glow"><span class="placeholder col-12"></span></div></div>
        </div>

        <div v-else-if="error" class="alert alert-warning rounded-0">
          {{ error }} <button class="btn btn-link p-0 align-baseline" @click="fetchInvoices">Retry</button>
        </div>

        <div v-else-if="invoices.length === 0" class="text-center py-10">
          <i class="fa-regular fa-file-lines text-muted" style="font-size: 3.5rem;"></i>
          <h3 class="mt-3">No Invoices Yet</h3>
        </div>

        <div v-else>
          <h1 class="mnHding fw-normal mb-5">My Invoices</h1>
          <div class="table-responsive border">
            <table class="table mb-0">
              <thead class="table-light">
                <tr>
                  <th>Invoice #</th>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Due date</th>
                  <th>Status</th>
                  <th class="text-end">Grand total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inv in invoices" :key="inv.id || inv.invoiceNumber">
                  <td>{{ inv.invoiceNumber || '-' }}</td>
                  <td>#{{ inv.orderId || '-' }}</td>
                  <td>{{ formatDate(inv.issueDate) }}</td>
                  <td>{{ formatDate(inv.dueDate) }}</td>
                  <td><InvoiceStatusBadge :status="inv.status" /></td>
                  <td class="text-end">{{ currencyStore.formatPrice(inv.grandTotal || 0) }}</td>
                  <td class="text-end"><router-link :to="`/invoices/${inv.id}`" class="btn btn-outline-dark btn-sm rounded-0">Details</router-link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCurrencyStore } from '../stores/currencyStore'
import { useInvoices } from '../composables/useInvoices'
import { getCurrentUserId } from '../services/apiConfig'
import InvoiceStatusBadge from '../components/InvoiceStatusBadge.vue'
import { useAuthSession } from '../composables/useAuthSession'

const currencyStore = useCurrencyStore()
const { invoices, loading, error, loadInvoices } = useInvoices()
const { isLoggedIn } = useAuthSession()

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchInvoices() {
  await loadInvoices(getCurrentUserId())
}

onMounted(fetchInvoices)
</script>
