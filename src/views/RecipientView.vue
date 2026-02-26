<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService, transferStorage } from '../services/authService'
import RecipientForm from '../components/RecipientForm.vue'

const router = useRouter()

const currentStep = ref(1)
const recipientData = ref(null)
const transferData = ref(null)

onMounted(() => {
  if (!authService.isAuthenticated()) {
    transferStorage.saveTransferData(transferStorage.getTransferData() || { step: 'recipient' })
    router.push('/login')
    return
  }
  
  transferData.value = transferStorage.getTransferData()
})

const handleRecipientSubmit = (data) => {
  recipientData.value = data
  
  const updatedTransferData = {
    ...transferData.value,
    recipient: data,
    step: 'sender'
  }
  transferStorage.saveTransferData(updatedTransferData)
  
  router.push('/sender')
}

const handleCancel = () => {
  router.push('/converter')
}

const getCountryName = (code) => {
  const countries = {
    'CO': 'Colombia',
    'MX': 'México',
    'PE': 'Perú',
    'CL': 'Chile',
    'AR': 'Argentina',
    'ES': 'España',
    'US': 'Estados Unidos'
  }
  return countries[code] || code
}
</script>

<template>
  <div class="recipient-container">
    <div class="recipient-card">
      <div class="recipient-header">
        <span class="step-icon">👤</span>
        <h1>Datos del Destinatario</h1>
        <p class="subtitle">Ingresa la información de quien recibirá el dinero</p>
      </div>

      <div class="steps-indicator">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <span class="step-number">1</span>
          <span class="step-label">Destinatario</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <span class="step-number">2</span>
          <span class="step-label">Remitente</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <span class="step-number">3</span>
          <span class="step-label">Pago</span>
        </div>
      </div>

      <div class="recipient-content">
        <RecipientForm 
          @submit="handleRecipientSubmit" 
          @cancel="handleCancel"
        />
      </div>

      <div v-if="transferData" class="transfer-summary">
        <div class="summary-item">
          <span class="summary-label">Monto a enviar</span>
          <span class="summary-value">{{ transferData.amount }} {{ transferData.fromCurrency }}</span>
        </div>
        <div class="summary-arrow">→</div>
        <div class="summary-item">
          <span class="summary-label">Recibirá</span>
          <span class="summary-value highlight">{{ transferData.convertedAmount }} {{ transferData.toCurrency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipient-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.recipient-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 520px;
}

.recipient-header {
  text-align: center;
  margin-bottom: 28px;
}

.step-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.recipient-header h1 {
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

.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a2e29;
  color: #5a6a65;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #00E676;
  color: #000000;
}

.step.completed .step-number {
  background: #00C853;
  color: #000000;
}

.step-label {
  font-size: 0.75rem;
  color: #5a6a65;
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: #A0A0A0;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #1a2e29;
  margin: 0 8px;
  margin-bottom: 20px;
  transition: background 0.3s ease;
}

.step-line.active {
  background: #00E676;
}

.recipient-content {
  margin-bottom: 24px;
}

.transfer-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 230, 118, 0.05);
  border: 1px solid #1a2e29;
  border-radius: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 0.75rem;
  color: #5a6a65;
}

.summary-value {
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
}

.summary-value.highlight {
  color: #00E676;
}

.summary-arrow {
  color: #00E676;
  font-size: 1.25rem;
}

@media (max-width: 480px) {
  .recipient-card {
    padding: 24px 20px;
  }
  
  .recipient-header h1 {
    font-size: 1.25rem;
  }
  
  .steps-indicator {
    margin-bottom: 24px;
  }
  
  .step-line {
    width: 24px;
  }
  
  .transfer-summary {
    flex-direction: column;
    gap: 8px;
  }
  
  .summary-arrow {
    transform: rotate(90deg);
  }
}
</style>
