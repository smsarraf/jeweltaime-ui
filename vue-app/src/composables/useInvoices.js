import { ref } from 'vue'
import { getInvoiceById, getInvoiceByOrderId, getInvoicesByCustomer } from '../services/invoiceService'

export function useInvoices() {
  const invoices = ref([])
  const invoice = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function loadInvoices(customerId) {
    loading.value = true
    error.value = ''
    try {
      invoices.value = await getInvoicesByCustomer(customerId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Unable to load invoices right now.'
      invoices.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadInvoiceById(invoiceId) {
    loading.value = true
    error.value = ''
    try {
      invoice.value = await getInvoiceById(invoiceId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Unable to load invoice details.'
      invoice.value = null
    } finally {
      loading.value = false
    }
  }

  async function loadInvoiceByOrder(orderId) {
    loading.value = true
    error.value = ''
    try {
      invoice.value = await getInvoiceByOrderId(orderId)
    } catch (e) {
      error.value = e.response?.data?.message || 'Invoice is being prepared. Please check again shortly.'
      invoice.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    invoices,
    invoice,
    loading,
    error,
    loadInvoices,
    loadInvoiceById,
    loadInvoiceByOrder
  }
}
