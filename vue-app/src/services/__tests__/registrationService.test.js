import test from 'node:test'
import assert from 'node:assert/strict'
import axios from 'axios'
import { activateAccount, mapActivationApiError, mapRegistrationApiError, registerAccount } from '../registrationService.js'

test('registerAccount happy path', async () => {
  const originalPost = axios.post
  axios.post = async () => ({
    data: {
      message: 'Registered',
      registrationStatus: 'PENDING_EMAIL_VERIFICATION',
      activationEmailSent: true,
      adminApprovalRequired: false
    }
  })

  const response = await registerAccount({
    email: 'user@example.com',
    username: 'user',
    fullName: 'User',
    password: 'secret123',
    roleName: 'USER',
    b2bCompany: null
  })

  assert.equal(response.registrationStatus, 'PENDING_EMAIL_VERIFICATION')
  assert.equal(response.activationEmailSent, true)
  axios.post = originalPost
})

test('activateAccount happy path', async () => {
  const originalGet = axios.get
  axios.get = async () => ({ data: { message: 'activated' } })
  const response = await activateAccount('token123')
  assert.equal(response.message, 'activated')
  axios.get = originalGet
})

test('error mapping for 409 registration and expired activation', () => {
  const regMsg = mapRegistrationApiError({ response: { status: 409 } })
  assert.equal(regMsg, 'An account with this email already exists.')

  const actMsg = mapActivationApiError({ response: { data: { message: 'Token expired' } } })
  assert.equal(actMsg, 'This activation link has expired.')
})
