<template>
  <div class="user-profile-page">
    <div class="container">
      <h1 class="page-title">My Profile</h1>
      <div class="profile-wrapper">
        <div class="profile-avatar">
          <img :src="userStore.user.avatar" :alt="userStore.user.firstName">
        </div>
        <div class="profile-form">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="userStore.user.firstName" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="userStore.user.lastName" type="text" class="form-control">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="userStore.user.email" type="email" class="form-control">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="userStore.user.phone" type="tel" class="form-control">
          </div>
          <div class="form-group">
            <label>Street Address</label>
            <input v-model="userStore.user.address.street" type="text" class="form-control">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>City</label>
              <input v-model="userStore.user.address.city" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>State</label>
              <input v-model="userStore.user.address.state" type="text" class="form-control">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Zip Code</label>
              <input v-model="userStore.user.address.zip" type="text" class="form-control">
            </div>
            <div class="form-group">
              <label>Country</label>
              <input v-model="userStore.user.address.country" type="text" class="form-control">
            </div>
          </div>
          <button @click="saveProfile" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const saveProfile = () => {
  alert('Profile updated successfully!')
}
</script>

<style scoped>
.user-profile-page {
  padding: 40px 0;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 40px;
}

.profile-wrapper {
  display: flex;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.profile-avatar {
  flex-shrink: 0;
}

.profile-avatar img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-form {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #222;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.btn {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .profile-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .profile-form {
    width: 100%;
  }
}
</style>
