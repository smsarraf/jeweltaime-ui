import test from 'node:test'
import assert from 'node:assert/strict'
import { validateRegistrationForm } from '../registrationValidation.js'

test('validates required USER fields', () => {
  const result = validateRegistrationForm({
    email: '',
    username: '',
    fullName: '',
    password: '',
    b2bCompany: {
      companyName: '',
      registrationNumber: '',
      taxId: '',
      addressLine1: '',
      countryId: null,
      stateId: null,
      cityId: null
    }
  }, 'USER')

  assert.equal(result.valid, false)
  assert.equal(Boolean(result.errors.email), true)
  assert.equal(Boolean(result.errors.password), true)
  assert.equal(Boolean(result.errors.companyName), false)
})

test('validates required B2B company fields for B2B_USER', () => {
  const result = validateRegistrationForm({
    email: 'b2b@example.com',
    username: '',
    fullName: '',
    password: 'secret123',
    b2bCompany: {
      companyName: '',
      registrationNumber: '',
      taxId: '',
      addressLine1: '',
      countryId: null,
      stateId: null,
      cityId: null
    }
  }, 'B2B_USER')

  assert.equal(result.valid, false)
  assert.equal(Boolean(result.errors.companyName), true)
  assert.equal(Boolean(result.errors.addressLine1), true)
  assert.equal(Boolean(result.errors.countryId), true)
  assert.equal(Boolean(result.errors.stateId), true)
  assert.equal(Boolean(result.errors.cityId), true)
})

test('accepts valid USER payload', () => {
  const result = validateRegistrationForm({
    email: 'user@example.com',
    username: '',
    fullName: 'Test User',
    password: 'secret123',
    b2bCompany: {
      companyName: '',
      registrationNumber: '',
      taxId: '',
      addressLine1: '',
      countryId: null,
      stateId: null,
      cityId: null
    }
  }, 'USER')

  assert.equal(result.valid, true)
  assert.deepEqual(result.errors, {})
})
