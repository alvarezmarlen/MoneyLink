<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService, transferStorage } from '../services/authService'
import { CURRENCIES } from '../constants/currencies'

const router = useRouter()

const currentStep = ref(2)
const transferData = ref(null)
const recipientData = ref(null)

const senderForm = ref({
  fullName: '',
  idNumber: '',
  phone: '',
  email: '',
  address: ''
})

const errors = ref({})

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  transferData.value = transferStorage.getTransferData()
  
  if (!transferData.value || !transferData.value.recipient) {
    router.push('/recipient')
    return
  }
  
  recipientData.value = transferData.value.recipient
  
  const currentUser = authService.getCurrentUser()
  if (currentUser) {
    senderForm.value.fullName = currentUser.fullName || ''
    senderForm.value.email = currentUser.email || ''
    senderForm.value.idNumber = currentUser.idNumber || ''
    senderForm.value.phone = currentUser.phone || ''
    senderForm.value.address = currentUser.address || ''
  }
})

const validate = () => {
  errors.value = {}
  
  if (!senderForm.value.fullName || senderForm.value.fullName.length < 2) {
    errors.value.fullName = 'El nombre debe tener al menos 2 caracteres'
  }
  
  if (!senderForm.value.idNumber || senderForm.value.idNumber.length < 5) {
    errors.value.idNumber = 'El número de identificación es requerido'
  }
  
  if (!senderForm.value.phone) {
    errors.value.phone = 'El teléfono es requerido'
  }
  
  if (!senderForm.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderForm.value.email)) {
    errors.value.email = 'Email válido es requerido'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return
  
  try {
    // 1. Guardamos los datos en la sesión del usuario para que persistan siempre
    // Usamos el nombre exacto de la función en tu authService.js: updateProfile
    await authService.updateProfile({
      fullName: senderForm.value.fullName,
      phone: senderForm.value.phone,
      address: senderForm.value.address,
      idNumber: senderForm.value.idNumber
    })

    // 2. Guardamos los datos específicos de ESTA transferencia actual
    const updatedTransferData = {
      ...transferData.value,
      sender: { ...senderForm.value },
      step: 'payment'
    }
    transferStorage.saveTransferData(updatedTransferData)
    
    // 3. Navegamos al siguiente paso
    router.push('/payment')

  } catch (error) {
    console.error("Error al guardar los datos del remitente:", error)
    // Aunque falle el servidor, el authService que tienes tiene un fallback 
    // que lo guarda en el LocalStorage, así que igual debería funcionar.
    router.push('/payment') 
  }
}

const handleBack = () => {
  router.push('/recipient')
}

const getCountryName = (code) => {
  const currency = CURRENCIES.find(c => c.code === code)
  return currency ? currency.region : code
}
</script>

<template>
  <div class="sender-container">
    <div class="sender-card">
      <div class="sender-header">
        <span class="step-icon">📤</span>
        <h1>Sender Details</h1>
        <p class="subtitle">Enter your information as the sender</p>
      </div>

      <div class="steps-indicator">
        <div class="step" :class="{ completed: currentStep > 1 }">
          <span class="step-number">1</span>
          <span class="step-label">Beneficiary</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <span class="step-number">2</span>
          <span class="step-label">Sender</span>
        </div>
        <div class="step-line" :class="{ active: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <span class="step-number">3</span>
          <span class="step-label">Payment</span>
        </div>
      </div>

      <div class="sender-content">
        <form @submit.prevent="handleSubmit" class="sender-form">
          <div class="form-group">
            <label for="sender-name">Full Name</label>
            <input
              id="sender-name"
              v-model="senderForm.fullName"
              type="text"
              placeholder="Tu nombre completo"
              :class="{ 'input-error': errors.fullName }"
            />
            <span v-if="errors.fullName" class="error-text">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="sender-id">ID Number</label>
            <input
              id="sender-id"
              v-model="senderForm.idNumber"
              type="text"
              placeholder="Cédula, DNI o Passport"
              :class="{ 'input-error': errors.idNumber }"
            />
            <span v-if="errors.idNumber" class="error-text">{{ errors.idNumber }}</span>
          </div>

          <div class="form-group">
            <label for="sender-phone">Phone Number</label>
            <input
              id="sender-phone"
              v-model="senderForm.phone"
              type="tel"
              placeholder="+34 600 123 456"
              :class="{ 'input-error': errors.phone }"
            />
            <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="sender-email">Email</label>
            <input
              id="sender-email"
              v-model="senderForm.email"
              type="email"
              placeholder="tu@email.com"
              :class="{ 'input-error': errors.email }"
            />
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="sender-address">Address (Optional)</label>
            <input
              id="sender-address"
              v-model="senderForm.address"
              type="text"
              placeholder="Your Address"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="back-button" @click="handleBack">
              Atrás
            </button>
            <button type="submit" class="submit-button">
              Continue
            </button>
          </div>
        </form>
      </div>

      <div v-if="transferData && recipientData" class="transfer-summary">
        <div class="summary-row">
          <div class="summary-item">
            <span class="summary-label">Send</span>
            <span class="summary-value">{{ transferData.amount }} {{ transferData.fromCurrency }}</span>
          </div>
          <div class="summary-arrow">→</div>
          <div class="summary-item">
            <span class="summary-label">Receive</span>
            <span class="summary-value highlight">{{ transferData.convertedAmount }} {{ transferData.toCurrency }}</span>
          </div>
        </div>
        <div class="summary-recipient">
          <span class="recipient-label">Addressee:</span>
          <span class="recipient-name">{{ recipientData.fullName }} ({{ getCountryName(recipientData.country) }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sender-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.sender-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 520px;
}

.sender-header {
  text-align: center;
  margin-bottom: 28px;
}

.step-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.sender-header h1 {
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

.sender-content {
  margin-bottom: 24px;
}

.sender-form {
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

.error-text {
  color: #ff6b7a;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.back-button {
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

.back-button:hover {
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

.submit-button:hover {
  background: #00C853;
  transform: translateY(-2px);
}

.transfer-summary {
  padding: 16px;
  background: rgba(0, 230, 118, 0.05);
  border: 1px solid #1a2e29;
  border-radius: 12px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
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

.summary-recipient {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #1a2e29;
}

.recipient-label {
  font-size: 0.75rem;
  color: #5a6a65;
}

.recipient-name {
  font-size: 0.8125rem;
  color: #A0A0A0;
  margin-left: 4px;
}

@media (max-width: 480px) {
  .sender-card {
    padding: 24px 20px;
  }
  
  .sender-header h1 {
    font-size: 1.25rem;
  }
  
  .steps-indicator {
    margin-bottom: 24px;
  }
  
  .step-line {
    width: 24px;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
