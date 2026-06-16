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
            <router-link to="/dashboard" class="text-decoration-none">Dashboard</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">My Profile</li>
        </ol>
      </nav>
    </div>

    <!-- Not Logged In -->
    <section v-if="!isLoggedIn" class="carttablewrap pt-7 pb-20">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center py-10">
            <i class="fa-solid fa-lock text-muted" style="font-size: 4rem; margin-bottom: 1.5rem;"></i>
            <h3 class="mb-3">Please Sign In</h3>
            <p class="mb-5">Sign in to manage your profile.</p>
            <router-link to="/signin" class="btn btn-dark py-3 px-6 text-uppercase fw-medium">Sign In</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Profile Content -->
    <section v-else class="py-7">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-12 col-lg-3 mb-6 mb-lg-0">
            <div class="card rounded-0 border">
              <div class="card-body text-center py-6">
                <div class="avatar-placeholder rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                  {{ userInitial }}
                </div>
                <h5 class="fw-medium mb-1">{{ userData?.firstName }} {{ userData?.lastName }}</h5>
                <p class="text-muted small mb-0">{{ userData?.email }}</p>
              </div>
              <div class="list-group list-group-flush rounded-0">
                <router-link to="/dashboard" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                  <i class="fa-solid fa-gauge-high me-3"></i> Dashboard
                </router-link>
                <router-link to="/profile" class="list-group-item list-group-item-action d-flex align-items-center py-3 active">
                  <i class="fa-solid fa-user me-3"></i> My Profile
                </router-link>
                <router-link to="/wishlist" class="list-group-item list-group-item-action d-flex align-items-center py-3">
                  <i class="fa-regular fa-heart me-3"></i> Wishlist
                </router-link>
                <a href="javascript:void(0);" class="list-group-item list-group-item-action d-flex align-items-center py-3 text-danger" @click="handleLogout">
                  <i class="fa-solid fa-sign-out-alt me-3"></i> Sign Out
                </a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-12 col-lg-9">
            <!-- Profile Info -->
            <div class="card rounded-0 border mb-6">
              <div class="card-header bg-white py-3 px-4">
                <h5 class="fw-medium mb-0">Profile Information</h5>
              </div>
              <div class="card-body p-4">
                <div v-if="profileMessage" :class="profileSuccess ? 'alert alert-success rounded-0 py-2' : 'alert alert-danger rounded-0 py-2'" class="mb-4">
                  <small><i :class="profileSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'" class="me-2"></i>{{ profileMessage }}</small>
                </div>

                <form @submit.prevent="updateProfile">
                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">First Name <em class="req">*</em></label>
                        <input type="text" class="form-control rounded-0" v-model="form.firstName" required>
                      </div>
                    </div>
                    <div class="col-md-6 mb-4">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">Last Name <em class="req">*</em></label>
                        <input type="text" class="form-control rounded-0" v-model="form.lastName" required>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mb-4">
                    <label class="d-block f-label fw-normal mb-2">Email Address <em class="req">*</em></label>
                    <input type="email" class="form-control rounded-0" v-model="form.email" required>
                  </div>
                  <div class="form-group mb-4">
                    <label class="d-block f-label fw-normal mb-2">Phone Number</label>
                    <input type="tel" class="form-control rounded-0" v-model="form.phone">
                  </div>
                  <button type="submit" class="btn btn-dark fw-medium text-uppercase px-6 py-2 rounded-0" :disabled="isUpdatingProfile">
                    <span v-if="isUpdatingProfile">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...
                    </span>
                    <span v-else>Save Changes</span>
                  </button>
                </form>
              </div>
            </div>

            <!-- Shipping Addresses -->
            <div class="card rounded-0 border mb-6">
              <div class="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 class="fw-medium mb-0">Shipping Addresses</h5>
                <button class="btn btn-dark btn-sm rounded-0" @click="showAddAddress = true" v-if="!showAddAddress">
                  <i class="fa-solid fa-plus me-1"></i>Add New
                </button>
              </div>
              <div class="card-body p-4">
                <div v-if="addressMessage" :class="addressSuccess ? 'alert alert-success rounded-0 py-2' : 'alert alert-danger rounded-0 py-2'" class="mb-4">
                  <small><i :class="addressSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'" class="me-2"></i>{{ addressMessage }}</small>
                </div>

                <!-- Address List -->
                <div v-if="!showAddAddress && addresses.length === 0" class="text-center py-3">
                  <p class="text-muted mb-0">No shipping addresses yet.</p>
                </div>

                <div v-if="!showAddAddress && addresses.length > 0">
                  <div v-for="addr in addresses" :key="addr.id" class="address-card border rounded-0 p-3 mb-3 position-relative">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{{ addr.label || 'Address' }}</strong>
                        <span v-if="addr.isDefault" class="badge bg-dark rounded-0 ms-2">Default</span>
                      </div>
                      <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-dark rounded-0" @click="editAddress(addr)" title="Edit">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-0" @click="deleteAddress(addr.id)" title="Delete">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                        <button v-if="!addr.isDefault" class="btn btn-sm btn-outline-secondary rounded-0" @click="setDefaultAddress(addr.id)" title="Set as default">
                          <i class="fa-solid fa-star"></i>
                        </button>
                      </div>
                    </div>
                    <p class="mb-1 mt-2">{{ addr.firstName }} {{ addr.lastName }}<span v-if="addr.phone"> — {{ addr.phone }}</span></p>
                    <p class="mb-0 text-muted small">{{ addr.addressLine1 }}<span v-if="addr.addressLine2">, {{ addr.addressLine2 }}</span></p>
                    <p class="mb-0 text-muted small">{{ addr.city }}, {{ addr.state ? addr.state + ', ' : '' }}{{ addr.postcode }}</p>
                    <p class="mb-0 text-muted small">{{ getCountryName(addr.country) }}</p>
                  </div>
                </div>

                <!-- Add/Edit Address Form -->
                <form v-if="showAddAddress" @submit.prevent="saveAddress" class="border-top pt-4">
                  <h6 class="fw-medium mb-3">{{ editingAddressId ? 'Edit Address' : 'New Shipping Address' }}</h6>
                  <div class="form-group mb-3">
                    <label class="d-block f-label fw-normal mb-2">Address Label</label>
                    <input type="text" class="form-control rounded-0" v-model="addressForm.label" placeholder="e.g. Home, Office, Parents' House">
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">First Name <em class="req">*</em></label>
                        <input type="text" class="form-control rounded-0" v-model="addressForm.firstName" required>
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">Last Name <em class="req">*</em></label>
                        <input type="text" class="form-control rounded-0" v-model="addressForm.lastName" required>
                      </div>
                    </div>
                  </div>
                  <div class="form-group mb-3">
                    <label class="d-block f-label fw-normal mb-2">Phone Number</label>
                    <input type="tel" class="form-control rounded-0" v-model="addressForm.phone">
                  </div>
                  <div class="form-group mb-3">
                    <label class="d-block f-label fw-normal mb-2">Address Line 1 <em class="req">*</em></label>
                    <input type="text" class="form-control rounded-0" v-model="addressForm.addressLine1" placeholder="Street address" required>
                  </div>
                  <div class="form-group mb-3">
                    <label class="d-block f-label fw-normal mb-2">Address Line 2</label>
                    <input type="text" class="form-control rounded-0" v-model="addressForm.addressLine2" placeholder="Apartment, suite, unit etc.">
                  </div>
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">Country <em class="req">*</em></label>
                        <select class="form-control rounded-0" v-model="addressForm.country" @change="onCountryChange" required>
                          <option value="">Select Country</option>
                          <option v-for="c in locationStore.getCountries" :key="c.id" :value="c.id">{{ c.name }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">State / Province <em class="req">*</em></label>
                        <select class="form-control rounded-0" v-model="addressForm.state" @change="onStateChange" :disabled="!addressForm.country" required>
                          <option value="">Select State</option>
                          <option v-for="s in selectedStates" :key="s.id" :value="s.id">{{ s.name }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4 mb-3">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">City <em class="req">*</em></label>
                        <select class="form-control rounded-0" v-model="addressForm.city" :disabled="!addressForm.state" required>
                          <option value="">Select City</option>
                          <option v-for="c in selectedCities" :key="c.id" :value="c.id">{{ c.name }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">Postcode <em class="req">*</em></label>
                        <input type="text" class="form-control rounded-0" v-model="addressForm.postcode" required>
                      </div>
                    </div>
                    <div class="col-md-8 mb-3 d-flex align-items-end">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="set-default-address" v-model="addressForm.isDefault">
                        <label class="form-check-label fw-normal" for="set-default-address">Set as default address</label>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-dark fw-medium text-uppercase px-5 py-2 rounded-0" :disabled="isSavingAddress">
                      <span v-if="isSavingAddress">
                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>Saving...
                      </span>
                      <span v-else>{{ editingAddressId ? 'Update' : 'Save' }} Address</span>
                    </button>
                    <button type="button" class="btn btn-outline-dark rounded-0 px-4 py-2" @click="cancelAddressForm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Change Password -->
            <div class="card rounded-0 border">
              <div class="card-header bg-white py-3 px-4">
                <h5 class="fw-medium mb-0">Change Password</h5>
              </div>
              <div class="card-body p-4">
                <div v-if="passwordMessage" :class="passwordSuccess ? 'alert alert-success rounded-0 py-2' : 'alert alert-danger rounded-0 py-2'" class="mb-4">
                  <small><i :class="passwordSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'" class="me-2"></i>{{ passwordMessage }}</small>
                </div>

                <form @submit.prevent="changePassword">
                  <div class="row">
                    <div class="col-md-4 mb-4">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">Current Password <em class="req">*</em></label>
                        <input type="password" class="form-control rounded-0" v-model="passwordForm.currentPassword" required>
                      </div>
                    </div>
                    <div class="col-md-4 mb-4">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">New Password <em class="req">*</em></label>
                        <input type="password" class="form-control rounded-0" v-model="passwordForm.newPassword" required>
                      </div>
                    </div>
                    <div class="col-md-4 mb-4">
                      <div class="form-group">
                        <label class="d-block f-label fw-normal mb-2">Confirm New Password <em class="req">*</em></label>
                        <input type="password" class="form-control rounded-0" v-model="passwordForm.confirmNewPassword" required>
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-dark fw-medium text-uppercase px-6 py-2 rounded-0" :disabled="isUpdatingPassword">
                    <span v-if="isUpdatingPassword">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>Updating...
                    </span>
                    <span v-else>Update Password</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocationStore } from '../stores/locationStore'
import axios from 'axios'

const router = useRouter()
const locationStore = useLocationStore()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const isLoggedIn = computed(() => !!localStorage.getItem('authToken'))
const userData = computed(() => {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
})

const userInitial = computed(() => {
  if (userData.value?.firstName) return userData.value.firstName.charAt(0).toUpperCase()
  return 'U'
})

// -- Profile form
const form = reactive({
  firstName: '', lastName: '', email: '', phone: ''
})
const isUpdatingProfile = ref(false)
const profileMessage = ref('')
const profileSuccess = ref(false)

// -- Password form
const passwordForm = reactive({
  currentPassword: '', newPassword: '', confirmNewPassword: ''
})
const isUpdatingPassword = ref(false)
const passwordMessage = ref('')
const passwordSuccess = ref(false)

// -- Shipping Addresses
const addresses = ref([])
const showAddAddress = ref(false)
const editingAddressId = ref(null)
const isSavingAddress = ref(false)
const addressMessage = ref('')
const addressSuccess = ref(false)

const addressForm = reactive({
  label: '', firstName: '', lastName: '', phone: '',
  addressLine1: '', addressLine2: '',
  country: '', state: '', city: '', postcode: '',
  isDefault: false
})

const selectedStates = computed(() => {
  if (!addressForm.country) return []
  return locationStore.getStates(addressForm.country)
})

const selectedCities = computed(() => {
  if (!addressForm.state) return []
  return locationStore.getCities(addressForm.state)
})

function getCountryName(countryId) {
  const c = locationStore.getCountries.find(c => c.id === countryId)
  return c ? c.name : countryId
}

function onCountryChange() {
  addressForm.state = ''
  addressForm.city = ''
}

function onStateChange() {
  addressForm.city = ''
}

// -- API calls
async function loadProfile() {
  if (!isLoggedIn.value) return
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      const user = response.data.data
      form.firstName = user.firstName || ''
      form.lastName = user.lastName || ''
      form.email = user.email || ''
      form.phone = user.phone || ''
    }
  } catch (error) {
    console.warn('Failed to load profile:', error.message)
  }
}

async function loadAddresses() {
  if (!isLoggedIn.value) return
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${API_BASE}/api/shipping-addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      addresses.value = response.data.data || []
    }
  } catch (error) {
    console.warn('Failed to load addresses:', error.message)
  }
}

async function updateProfile() {
  profileMessage.value = ''
  profileSuccess.value = false
  if (!form.firstName || !form.lastName || !form.email) {
    profileMessage.value = 'First name, last name and email are required.'
    return
  }
  isUpdatingProfile.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.put(`${API_BASE}/api/auth/profile`, {
      firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone
    }, { headers: { Authorization: `Bearer ${token}` } })
    if (response.data.success) {
      profileSuccess.value = true
      profileMessage.value = 'Profile updated successfully!'
      const updatedUser = response.data.data
      localStorage.setItem('user', JSON.stringify({
        id: updatedUser.id, firstName: updatedUser.firstName,
        lastName: updatedUser.lastName, email: updatedUser.email, phone: updatedUser.phone
      }))
    } else {
      profileSuccess.value = false
      profileMessage.value = response.data.error || 'Failed to update profile.'
    }
  } catch (error) {
    profileSuccess.value = false
    profileMessage.value = error.response?.data?.error || 'Failed to update profile.'
  } finally {
    isUpdatingProfile.value = false
  }
}

async function changePassword() {
  passwordMessage.value = ''
  passwordSuccess.value = false
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
    passwordMessage.value = 'Please fill in all password fields.'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    passwordMessage.value = 'New passwords do not match.'
    return
  }
  if (passwordForm.newPassword.length < 6) {
    passwordMessage.value = 'New password must be at least 6 characters.'
    return
  }
  isUpdatingPassword.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.put(`${API_BASE}/api/auth/password`, {
      currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword
    }, { headers: { Authorization: `Bearer ${token}` } })
    if (response.data.success) {
      passwordSuccess.value = true
      passwordMessage.value = 'Password updated successfully!'
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmNewPassword = ''
    } else {
      passwordSuccess.value = false
      passwordMessage.value = response.data.error || 'Failed to update password.'
    }
  } catch (error) {
    passwordSuccess.value = false
    passwordMessage.value = error.response?.data?.error || 'Failed to update password.'
  } finally {
    isUpdatingPassword.value = false
  }
}

function editAddress(addr) {
  editingAddressId.value = addr.id
  addressForm.label = addr.label || ''
  addressForm.firstName = addr.firstName
  addressForm.lastName = addr.lastName
  addressForm.phone = addr.phone || ''
  addressForm.addressLine1 = addr.addressLine1
  addressForm.addressLine2 = addr.addressLine2 || ''
  addressForm.country = addr.country
  addressForm.state = addr.state || ''
  addressForm.city = addr.city
  addressForm.postcode = addr.postcode
  addressForm.isDefault = addr.isDefault
  showAddAddress.value = true
}

function cancelAddressForm() {
  showAddAddress.value = false
  editingAddressId.value = null
  resetAddressForm()
}

function resetAddressForm() {
  addressForm.label = ''
  addressForm.firstName = ''
  addressForm.lastName = ''
  addressForm.phone = ''
  addressForm.addressLine1 = ''
  addressForm.addressLine2 = ''
  addressForm.country = ''
  addressForm.state = ''
  addressForm.city = ''
  addressForm.postcode = ''
  addressForm.isDefault = false
}

async function saveAddress() {
  addressMessage.value = ''
  addressSuccess.value = false
  if (!addressForm.firstName || !addressForm.lastName || !addressForm.addressLine1 || !addressForm.country || !addressForm.city || !addressForm.postcode) {
    addressMessage.value = 'Please fill in all required fields.'
    return
  }
  isSavingAddress.value = true
  try {
    const token = localStorage.getItem('authToken')
    const payload = { ...addressForm }

    if (editingAddressId.value) {
      // Update existing
      const response = await axios.put(`${API_BASE}/api/shipping-addresses/${editingAddressId.value}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        await loadAddresses()
        addressSuccess.value = true
        addressMessage.value = 'Address updated successfully!'
        cancelAddressForm()
      }
    } else {
      // Add new
      const response = await axios.post(`${API_BASE}/api/shipping-addresses`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        await loadAddresses()
        addressSuccess.value = true
        addressMessage.value = 'Address added successfully!'
        cancelAddressForm()
      }
    }
  } catch (error) {
    addressSuccess.value = false
    addressMessage.value = error.response?.data?.error || 'Failed to save address.'
  } finally {
    isSavingAddress.value = false
  }
}

async function deleteAddress(addrId) {
  if (!confirm('Are you sure you want to delete this address?')) return
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.delete(`${API_BASE}/api/shipping-addresses/${addrId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      addresses.value = response.data.data || []
      addressSuccess.value = true
      addressMessage.value = 'Address deleted successfully!'
    }
  } catch (error) {
    addressSuccess.value = false
    addressMessage.value = error.response?.data?.error || 'Failed to delete address.'
  }
}

async function setDefaultAddress(addrId) {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.put(`${API_BASE}/api/shipping-addresses/${addrId}/default`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      await loadAddresses()
      addressSuccess.value = true
      addressMessage.value = 'Default address updated!'
    }
  } catch (error) {
    addressSuccess.value = false
    addressMessage.value = error.response?.data?.error || 'Failed to set default address.'
  }
}

const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  router.push('/')
}

onMounted(() => {
  loadProfile()
  loadAddresses()
  locationStore.loadAllLocations()
})
</script>

<style scoped>
.list-group-item.active {
  background-color: #000;
  border-color: #000;
}
.f-label {
  font-size: 0.9rem;
}
.avatar-placeholder {
  line-height: 80px;
}
.address-card {
  background: #fafafa;
}
.address-card .badge {
  font-weight: 400;
  font-size: 0.7rem;
}
</style>