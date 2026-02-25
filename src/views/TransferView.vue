<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService, transferStorage } from '../services/authService'

const router = useRouter()

onMounted(() => {
  if (!authService.isAuthenticated()) {
    const transferData = transferStorage.getTransferData()
    if (transferData) {
      router.push('/login')
    } else {
      router.push('/converter')
    }
  }
})
</script>

<template>
  <div class="transfer-container">
    <div class="transfer-card">
      <div class="transfer-header">
        <span class="icon">💰</span>
        <h1>Transfer Confirmation</h1>
      </div>
      
      <div class="transfer-content">
        <p>Transfer view coming soon...</p>
        <p class="subtitle">This is where you'll confirm and execute your transfer.</p>
      </div>

      <div class="transfer-actions">
        <button @click="router.push('/converter')" class="back-button">
          Back to Converter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transfer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.transfer-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  text-align: center;
}

.transfer-header {
  margin-bottom: 32px;
}

.icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

.transfer-header h1 {
  color: #FFFFFF;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
}

.transfer-content {
  margin-bottom: 32px;
}

.transfer-content p {
  color: #A0A0A0;
  font-size: 1rem;
  margin: 0 0 8px 0;
}

.transfer-content .subtitle {
  color: #5a6a65;
  font-size: 0.875rem;
}

.transfer-actions {
  display: flex;
  justify-content: center;
}

.back-button {
  background: transparent;
  border: 1px solid #1a2e29;
  color: #A0A0A0;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  border-color: #00E676;
  color: #00E676;
}
</style>
