<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, transferStorage } from '../services/authService'
import { transactionService } from '../services/transactionService'

const router = useRouter()
const savedToHistory = ref(false)

onMounted(() => {
  if (!authService.isAuthenticated()) {
    const transferData = transferStorage.getTransferData()
    if (transferData) {
      router.push('/login')
    } else {
      router.push('/converter')
    }
    return
  }
  
  const transferData = transferStorage.getTransferData()
  
  if (transferData && transferData.step === 'complete' && !savedToHistory.value) {
    transactionService.saveTransaction(transferData)
    savedToHistory.value = true
    return
  }
  
  if (!transferData || !transferData.amount) {
    router.push('/converter')
  } else if (!transferData.recipient) {
    router.push('/recipient')
  } else if (!transferData.sender) {
    router.push('/sender')
  } else if (!transferData.paymentMethod) {
    router.push('/payment')
  } else {
    transactionService.saveTransaction(transferData)
    savedToHistory.value = true
    
    const updatedData = { ...transferData, step: 'complete' }
    transferStorage.saveTransferData(updatedData)
  }
})

const goToDashboard = () => {
  transferStorage.clearTransferData()
  router.push('/dashboard')
}

const startNewTransfer = () => {
  transferStorage.clearTransferData()
  router.push('/converter')
}
</script>

<template>
  <div class="transfer-container">
    <div class="transfer-card">
      <div class="transfer-header">
        <span class="icon">✅</span>
        <h1>Transferencia Completada</h1>
      </div>
      
      <div class="transfer-content">
        <p>Tu transferencia ha sido procesada exitosamente.</p>
        <p class="subtitle">Recibirás un correo de confirmación en breve.</p>
      </div>

      <div class="transfer-actions">
        <button @click="goToDashboard" class="dashboard-button">
          Ver en Dashboard
        </button>
        <button @click="startNewTransfer" class="new-transfer-button">
          Nueva Transferencia
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
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.dashboard-button {
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

.dashboard-button:hover {
  border-color: #00E676;
  color: #00E676;
}

.new-transfer-button {
  background: #00E676;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-transfer-button:hover {
  background: #00C853;
  transform: translateY(-2px);
}
</style>
