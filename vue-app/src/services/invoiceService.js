import axios from 'axios'
import { API_BASE, authHeaders } from './apiConfig'

function normalizeInvoice(invoice) {
  if (!invoice || typeof invoice !== 'object') return null
  return {
    ...invoice,
    id: invoice.id ?? invoice.invoiceId ?? null,
    invoiceNumber: invoice.invoiceNumber ?? invoice.number ?? '-',
    orderId: invoice.orderId ?? invoice.salesOrderId ?? null,
    status: invoice.status ?? 'DRAFT',
    dueDate: invoice.dueDate ?? invoice.paymentDueDate ?? null,
    grandTotal: Number(invoice.grandTotal ?? invoice.total ?? invoice.totalAmount ?? 0),
    issueDate: invoice.issueDate ?? invoice.invoiceDate ?? invoice.createdAt ?? null,
    items: Array.isArray(invoice.items) ? invoice.items : []
  }
}

export async function getInvoicesByCustomer(customerId) {
  if (!customerId) return []
  const res = await axios.get(`${API_BASE}/api/v1/invoices/customer/${customerId}`, {
    headers: authHeaders()
  })
  const rows = Array.isArray(res.data?.content)
    ? res.data.content
    : (Array.isArray(res.data) ? res.data : [])
  return rows.map(normalizeInvoice).filter(Boolean)
}

export async function getInvoiceById(invoiceId) {
  const res = await axios.get(`${API_BASE}/api/v1/invoices/${invoiceId}`, {
    headers: authHeaders()
  })
  return normalizeInvoice(res.data)
}

export async function getInvoiceByOrderId(orderId) {
  const res = await axios.get(`${API_BASE}/api/v1/invoices/order/${orderId}`, {
    headers: authHeaders()
  })
  return normalizeInvoice(res.data)
}

export async function getInvoiceByNumber(invoiceNumber) {
  const res = await axios.get(`${API_BASE}/api/v1/invoices/number/${encodeURIComponent(invoiceNumber)}`, {
    headers: authHeaders()
  })
  return normalizeInvoice(res.data)
}
