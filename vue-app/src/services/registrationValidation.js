/**
 * @typedef {'USER'|'B2B_USER'} RegistrationMode
 *
 * @typedef {Object} B2BCompanyFormData
 * @property {string} companyName
 * @property {string} registrationNumber
 * @property {string} taxId
 * @property {string} addressLine1
 * @property {number|string|null} countryId
 * @property {number|string|null} stateId
 * @property {number|string|null} cityId
 *
 * @typedef {Object} RegistrationFormData
 * @property {string} email
 * @property {string} username
 * @property {string} fullName
 * @property {string} password
 * @property {B2BCompanyFormData} b2bCompany
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * @param {RegistrationFormData} form
 * @param {RegistrationMode} mode
 */
export function validateRegistrationForm(form, mode) {
  /** @type {Record<string,string>} */
  const errors = {}
  const email = String(form.email || '').trim()
  const password = String(form.password || '')
  const username = String(form.username || '').trim()
  const fullName = String(form.fullName || '').trim()
  const b2bCompany = form.b2bCompany || {}

  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (username && username.length < 3) {
    errors.username = 'Username must be at least 3 characters if provided.'
  }

  if (fullName && fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters if provided.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  if (mode === 'B2B_USER') {
    if (!String(b2bCompany.companyName || '').trim()) errors.companyName = 'Company name is required.'
    if (!String(b2bCompany.addressLine1 || '').trim()) errors.addressLine1 = 'Address is required.'
    if (!Number(b2bCompany.countryId || 0)) errors.countryId = 'Country is required.'
    if (!Number(b2bCompany.stateId || 0)) errors.stateId = 'State is required.'
    if (!Number(b2bCompany.cityId || 0)) errors.cityId = 'City is required.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
