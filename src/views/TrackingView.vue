<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService, transferStorage } from '../services/authService'

const router = useRouter()
const transferData = ref(null)

const trackingSteps = [
  { id: 'processing', label: 'Processing', description: 'Your transfer is being processed', icon: '⏳' },
  { id: 'sent', label: 'Sent', description: 'Funds have been sent', icon: '📤' },
  { id: 'in_transit', label: 'In Transit', description: 'On its way to destination', icon: '🚚' },
  { id: 'delivered', label: 'Delivered', description: 'Arrived at destination', icon: '✅' }
]

const currentStepIndex = ref(0)

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  transferData.value = transferStorage.getTransferData()
  
  if (!transferData.value) {
    router.push('/converter')
    return
  }

  simulateTracking()
})

const simulateTracking = () => {
  const interval = setInterval(() => {
    if (currentStepIndex.value < trackingSteps.length - 1) {
      currentStepIndex.value++
    } else {
      clearInterval(interval)
    }
  }, 3000)
}

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
  <div class="tracking-container">
    <div class="tracking-card">
      <div class="tracking-header">
        <span class="icon">📦</span>
        <h1>Shipment Tracking</h1>
        <p class="subtitle">Track your transfer in real-time</p>
      </div>
      
      <div class="tracking-timeline">
        <div 
          v-for="(step, index) in trackingSteps" 
          :key="step.id"
          class="timeline-step"
          :class="{ 
            'completed': index < currentStepIndex,
            'active': index === currentStepIndex
          }"
        >
          <div class="step-connector" v-if="index > 0"></div>
          <div class="step-indicator">
            <span class="step-icon">{{ step.icon }}</span>
          </div>
          <div class="step-content">
            <span class="step-label">{{ step.label }}</span>
            <span class="step-description">{{ step.description }}</span>
          </div>
        </div>
      </div>

      <div class="transfer-info" v-if="transferData">
        <div class="info-row">
          <span class="info-label">Amount Sent</span>
          <span class="info-value">{{ transferData.amount }} {{ transferData.fromCurrency }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Recipient Gets</span>
          <span class="info-value highlight">{{ transferData.convertedAmount }} {{ transferData.toCurrency }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Method</span>
          <span class="info-value">{{ transferData.paymentMethod === 'debit' ? 'Credit/Debit Card' : 'PayPal' }}</span>
        </div>
      </div>

      <div class="tracking-actions">
        <button @click="goToDashboard" class="dashboard-button">
          Go to Dashboard
        </button>
        <button @click="startNewTransfer" class="new-transfer-button">
          New Transfer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tracking-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.tracking-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 520px;
}

.tracking-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}

.tracking-header h1 {
  color: #FFFFFF;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #A0A0A0;
  font-size: 1rem;
  margin: 0;
}

.tracking-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 32px;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-bottom: 24px;
}

.timeline-step:last-child {
  padding-bottom: 0;
}

.step-connector {
  position: absolute;
  left: 20px;
  top: -24px;
  width: 2px;
  height: 24px;
  background: #1a2e29;
}

.timeline-step.completed .step-connector {
  background: #00E676;
}

.step-indicator {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #1a2e29;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-step.completed .step-indicator {
  background: #00C853;
}

.timeline-step.active .step-indicator {
  background: #00E676;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(0, 230, 118, 0);
  }
}

.step-icon {
  font-size: 1.25rem;
}

.step-content {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  padding-top: 10px;
}

.step-label {
  color: #5a6a65;
  font-size: 1rem;
  font-weight: 500;
}

.timeline-step.completed .step-label,
.timeline-step.active .step-label {
  color: #FFFFFF;
}

.step-description {
  color: #5a6a65;
  font-size: 0.875rem;
  margin-top: 2px;
}

.transfer-info {
  padding: 20px;
  background: rgba(10, 31, 26, 0.5);
  border: 1px solid #1a2e29;
  border-radius: 12px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #1a2e29;
}

.info-label {
  color: #A0A0A0;
  font-size: 0.9375rem;
}

.info-value {
  color: #FFFFFF;
  font-size: 0.9375rem;
  font-weight: 500;
}

.info-value.highlight {
  color: #00E676;
  font-weight: 600;
}

.tracking-actions {
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

@media (max-width: 480px) {
  .tracking-card {
    padding: 32px 20px;
  }
  
  .tracking-header h1 {
    font-size: 1.5rem;
  }
  
  .step-indicator {
    width: 36px;
    height: 36px;
  }
  
  .step-icon {
    font-size: 1rem;
  }
}
</style>
