<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()

const currentUser = ref(null)
const isLoading = ref(false)
const successMessage = ref(null)
const errorMessage = ref(null)

const profileForm = ref({
  fullName: '',
  email: '',
  phone: '',
  address: ''
})

const errors = ref({})

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  currentUser.value = authService.getCurrentUser()
  
  if (currentUser.value) {
    profileForm.value.fullName = currentUser.value.fullName || ''
    profileForm.value.email = currentUser.value.email || ''
    profileForm.value.phone = currentUser.value.phone || ''
    profileForm.value.address = currentUser.value.address || ''
  }
})

const validateForm = () => {
  errors.value = {}
  
  if (!profileForm.value.fullName || profileForm.value.fullName.length < 2) {
    errors.value.fullName = 'Name must be at least 2 characters long'
  }
  
  if (!profileForm.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.value.email)) {
    errors.value.email = 'Valid email is required'
  }
  
  if (!profileForm.value.phone) {
    errors.value.phone = 'Phone number is required'
  } else if (!/^\+?[\d\s-]{8,}$/.test(profileForm.value.phone)) {
    errors.value.phone = 'Invalid phone format'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  successMessage.value = null
  errorMessage.value = null
  
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await authService.updateProfile(profileForm.value)
    successMessage.value = 'Profile updated successfully'
    currentUser.value = authService.getCurrentUser()
  } catch (error) {
    errorMessage.value = error.message || 'Error updating profile'
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <button class="back-btn" @click="handleCancel">
          ← Back
        </button>
        <h1>Edit Profile</h1>
        <p class="subtitle">Update your personal information</p>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label for="profile-name">Full Name</label>
          <input
            id="profile-name"
            v-model="profileForm.fullName"
            type="text"
            placeholder="Your full name"
            :class="{ 'input-error': errors.fullName }"
          />
          <span v-if="errors.fullName" class="error-text">{{ errors.fullName }}</span>
        </div>

        <div class="form-group">
          <label for="profile-email">Email</label>
          <input
            id="profile-email"
            v-model="profileForm.email"
            type="email"
            placeholder="your@email.com"
            :class="{ 'input-error': errors.email }"
            disabled
          />
          <span class="help-text">Email cannot be changed</span>
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="profile-phone">Phone Number</label>
          <input
            id="profile-phone"
            v-model="profileForm.phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            :class="{ 'input-error': errors.phone }"
          />
          <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="profile-address">Address (Optional)</label>
          <input
            id="profile-address"
            v-model="profileForm.address"
            type="text"
            placeholder="Your address"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="handleCancel">
            Cancel
          </button>
          <button type="submit" class="submit-button" :disabled="isLoading">
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.profile-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
}

.profile-header {
  margin-bottom: 24px;
}

.back-btn {
  background: none;
  border: none;
  color: #A0A0A0;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: #00E676;
}

.profile-header h1 {
  color: #FFFFFF;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #A0A0A0;
  font-size: 0.9375rem;
  margin: 0;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.875rem;
}

.alert-success {
  background: rgba(0, 230, 118, 0.1);
  border: 1px solid rgba(0, 230, 118, 0.3);
  color: #00E676;
}

.alert-error {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff6b7a;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #A0A0A0;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 8px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #5a6a65;
}

.form-group input:focus {
  border-color: #00E676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.2);
}

.form-group input.input-error {
  border-color: #ff6b7a;
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.help-text {
  color: #5a6a65;
  font-size: 0.75rem;
}

.error-text {
  color: #ff6b7a;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.cancel-button {
  flex: 1;
  background: transparent;
  border: 1px solid #1a2e29;
  color: #A0A0A0;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  border-color: #00E676;
  color: #00E676;
}

.submit-button {
  flex: 2;
  background: #00E676;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #00C853;
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .profile-card {
    padding: 24px 20px;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
