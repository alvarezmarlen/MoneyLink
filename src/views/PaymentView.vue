<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService, transferStorage } from '../services/authService'
import { CURRENCIES } from '../constants/currencies'
import { transactionService } from '../services/transactionService'

const router = useRouter()

const currentStep = ref(3)
const transferData = ref(null)
const recipientData = ref(null)
const senderData = ref(null)
const selectedPaymentMethod = ref('')
const isProcessing = ref(false)

const cardholderName = ref('')
const cardCvc = ref('')
const cardExpiryDate = ref('')
const paypalEmail = ref('')

const showCardInputs = computed(() => selectedPaymentMethod.value === 'debit')
const showPaypalInputs = computed(() => selectedPaymentMethod.value === 'paypal')

const isFormValid = computed(() => {
  if (!selectedPaymentMethod.value) return false
  if (selectedPaymentMethod.value === 'debit') {
    return cardholderName.value && cardCvc.value && cardExpiryDate.value
  }
  if (selectedPaymentMethod.value === 'paypal') {
    return paypalEmail.value
  }
  return false
})

const paymentMethods = [
  { id: 'debit', name: 'Credit/Debit Card', icon: '💳', description: 'Pay with Visa/Mastercard debit or credit card' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Fast payment with your PayPal account' }
]

const exchangeRate = ref(1)
const commissionRate = 0.02

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  transferData.value = transferStorage.getTransferData()
  
  if (!transferData.value || !transferData.value.recipient || !transferData.value.sender) {
    router.push('/recipient')
    return
  }
  
  recipientData.value = transferData.value.recipient
  senderData.value = transferData.value.sender
})

const commission = computed(() => {
  if (!transferData.value) return 0
  return transferData.value.amount * commissionRate
})

const total = computed(() => {
  if (!transferData.value) return 0
  return transferData.value.amount + commission.value
})

const getCountryName = (code) => {
  const currency = CURRENCIES.find(c => c.code === code)
  return currency ? currency.region : code
}

const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: currency 
  }).format(amount)
}

const handlePayment = async () => {
  if (!selectedPaymentMethod.value || !isFormValid.value) return
  
  isProcessing.value = true
  
  const paymentData = {
    method: selectedPaymentMethod.value,
    ...(selectedPaymentMethod.value === 'debit' && {
      cardholderName: cardholderName.value,
      cvc: cardCvc.value,
      expiryDate: cardExpiryDate.value
    }),
    ...(selectedPaymentMethod.value === 'paypal' && {
      paypalEmail: paypalEmail.value
    })
  }
  
  const currentTransferData = transferStorage.getTransferData()
  const updatedData = { 
    ...currentTransferData, 
    paymentMethod: selectedPaymentMethod.value, 
    paymentData: paymentData,
    id: String(Date.now()),
    status: 'completed'
  }
  
  try {
    // Persistent storage of the transaction
    await transactionService.saveTransaction(updatedData)
    transferStorage.saveTransferData(updatedData)
    
    setTimeout(() => {
      isProcessing.value = false
      router.push('/tracking')
    }, 1500)
  } catch (error) {
    console.error('Error saving transaction:', error)
    isProcessing.value = false
    alert('Payment successful, but there was an error recording the transaction.') // Basic error handling
    router.push('/tracking')
  }
}

const handleBack = () => {
  router.push('/sender')
}
</script>

<template>
  <div class="payment-container">
    <div class="payment-card">
      <div class="payment-header">
        <span class="step-icon">💳</span>
        <h1>Payment Method</h1>
        <p class="subtitle">Select how you want to make the payment</p>
      </div>

      <div class="steps-indicator">
        <div class="step completed">
          <span class="step-number">1</span>
          <span class="step-label">Recipient</span>
        </div>
        <div class="step-line active"></div>
        <div class="step completed">
          <span class="step-number">2</span>
          <span class="step-label">Sender</span>
        </div>
        <div class="step-line active"></div>
        <div class="step" :class="{ active: currentStep >= 3 }">
          <span class="step-number">3</span>
          <span class="step-label">Payment</span>
        </div>
      </div>

      <div class="payment-content">
        <div class="payment-methods">
          <label 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="method-option"
            :class="{ selected: selectedPaymentMethod === method.id }"
          >
            <input 
              type="radio" 
              :value="method.id" 
              v-model="selectedPaymentMethod"
            />
            <span class="method-icon">{{ method.icon }}</span>
            <div class="method-info">
              <span class="method-name">{{ method.name }}</span>
              <span class="method-desc">{{ method.description }}</span>
            </div>
          </label>
        </div>

        <div v-if="showCardInputs" class="card-inputs">
          <h3>Card Details</h3>
          <div class="form-group">
            <label>Cardholder Name</label>
            <input 
              type="text" 
              v-model="cardholderName" 
              placeholder="Name on card"
              class="form-input"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>CVC</label>
              <input 
                type="text" 
                v-model="cardCvc" 
                placeholder="123"
                maxlength="4"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Expiry Date</label>
              <input 
                type="text" 
                v-model="cardExpiryDate" 
                placeholder="MM/YY"
                maxlength="5"
                class="form-input"
              />
            </div>
          </div>
        </div>

        <div v-if="showPaypalInputs" class="paypal-inputs">
          <h3>PayPal Details</h3>
          <div class="form-group">
            <label>PayPal Email</label>
            <input 
              type="email" 
              v-model="paypalEmail" 
              placeholder="your@email.com"
              class="form-input"
            />
          </div>
        </div>

        <div class="summary-card">
          <h3>Transaction Summary</h3>
          
          <div class="summary-section">
            <div class="summary-row">
              <span class="summary-label">Amount to send</span>
              <span class="summary-value">{{ transferData?.amount }} {{ transferData?.fromCurrency }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Exchange rate</span>
              <span class="summary-value">1 {{ transferData?.fromCurrency }} = {{ transferData?.convertedAmount / transferData?.amount }} {{ transferData?.toCurrency }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Recipient receives</span>
              <span class="summary-value highlight">{{ transferData?.convertedAmount }} {{ transferData?.toCurrency }}</span>
            </div>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-section">
            <div class="summary-row">
              <span class="summary-label">Fee (2%)</span>
              <span class="summary-value">{{ commission.toFixed(2) }} {{ transferData?.fromCurrency }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Total to pay</span>
              <span class="summary-value">{{ total.toFixed(2) }} {{ transferData?.fromCurrency }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="back-button" @click="handleBack">
            Back
          </button>
          <button 
            type="button" 
            class="submit-button" 
            :disabled="!isFormValid || isProcessing"
            @click="handlePayment"
          >
            {{ isProcessing ? 'Processing...' : 'Continue and Pay' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.payment-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 560px;
}

.payment-header {
  text-align: center;
  margin-bottom: 28px;
}

.step-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}

.payment-header h1 {
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
}

.step-line.active {
  background: #00E676;
}

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.method-option:hover {
  border-color: #00E676;
}

.method-option.selected {
  border-color: #00E676;
  background: rgba(0, 230, 118, 0.05);
}

.method-option input[type="radio"] {
  display: none;
}

.method-icon {
  font-size: 1.75rem;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.method-name {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 500;
}

.method-desc {
  color: #5a6a65;
  font-size: 0.8125rem;
}

.summary-card {
  padding: 20px;
  background: rgba(10, 31, 26, 0.5);
  border: 1px solid #1a2e29;
  border-radius: 12px;
}

.summary-card h3 {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: #A0A0A0;
  font-size: 0.875rem;
}

.summary-value {
  color: #FFFFFF;
  font-size: 0.9375rem;
}

.summary-value.highlight {
  color: #00E676;
  font-weight: 600;
}

.summary-row.total {
  margin-top: 8px;
}

.summary-row.total .summary-label,
.summary-row.total .summary-value {
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
}

.summary-row.total .summary-value {
  color: #00E676;
}

.summary-divider {
  height: 1px;
  background: #1a2e29;
  margin: 16px 0;
}

.form-actions {
  display: flex;
  gap: 12px;
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

.submit-button:hover:not(:disabled) {
  background: #00C853;
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-inputs,
.paypal-inputs {
  padding: 20px;
  background: rgba(10, 31, 26, 0.5);
  border: 1px solid #1a2e29;
  border-radius: 12px;
}

.card-inputs h3,
.paypal-inputs h3 {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  color: #A0A0A0;
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 8px;
  color: #FFFFFF;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #00E676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.1);
}

.form-input::placeholder {
  color: #5a6a65;
}

@media (max-width: 480px) {
  .payment-card {
    padding: 24px 20px;
  }
  
  .payment-header h1 {
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
