<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/authService'
import { recipientService } from '../services/recipientService'
import RecipientForm from '../components/RecipientForm.vue'

const router = useRouter()
const route = useRoute()

const recipient = ref(null)
const isLoading = ref(false)
const successMessage = ref(null)
const errorMessage = ref(null)

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  const recipientId = route.params.id
  if (!recipientId) {
    router.push('/dashboard')
    return
  }
  
  recipient.value = await recipientService.getRecipientById(recipientId)
  
  if (!recipient.value) {
    router.push('/dashboard')
  }
})

const handleSubmit = async (data) => {
  successMessage.value = null
  errorMessage.value = null
  
  isLoading.value = true
  
  try {
    await recipientService.updateRecipient(recipient.value.id, data)
    successMessage.value = 'Recipient updated successfully'
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    errorMessage.value = error.message || 'Error updating recipient'
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="edit-recipient-container">
    <div class="edit-recipient-card">
      <div class="edit-header">
        <button class="back-btn" @click="handleCancel">
          ← Back
        </button>
        <h1>Edit Recipient</h1>
        <p class="subtitle">Update recipient information</p>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <div v-if="recipient" class="form-container">
        <RecipientForm 
          :initial-data="recipient"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>

      <div v-else class="loading">
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-recipient-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.edit-recipient-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 520px;
}

.edit-header {
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

.edit-header h1 {
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

.form-container {
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #A0A0A0;
}

@media (max-width: 480px) {
  .edit-recipient-card {
    padding: 24px 20px;
  }
}
</style>
