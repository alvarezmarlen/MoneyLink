<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CURRENCIES, DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY } from '../constants/currencies'
import { authService, transferStorage } from '../services/authService'

const router = useRouter()

const amount = ref(1000)
const fromCurrency = ref(DEFAULT_FROM_CURRENCY)
const toCurrency = ref(DEFAULT_TO_CURRENCY)
const isLoading = ref(false)
const error = ref(null)
const lastUpdated = ref(new Date())

const exchangeRate = ref(0.92)

const convertedAmount = computed(() => {
  if (!amount.value || isNaN(amount.value)) return 0
  return (amount.value * exchangeRate.value).toFixed(2)
})

const fromCurrencyData = computed(() => {
  return CURRENCIES.find(c => c.code === fromCurrency.value) || CURRENCIES[0]
})

const toCurrencyData = computed(() => {
  return CURRENCIES.find(c => c.code === toCurrency.value) || CURRENCIES[1]
})

const handleAmountInput = (event) => {
  const value = event.target.value
  if (value === '' || /^\d+\.?\d*$/.test(value)) {
    amount.value = value === '' ? '' : parseFloat(value)
  }
}

const swapCurrencies = () => {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
  lastUpdated.value = new Date()
}

const executeTransfer = () => {
  transferStorage.saveTransferData({
    amount: amount.value,
    fromCurrency: fromCurrency.value,
    toCurrency: toCurrency.value,
    convertedAmount: convertedAmount.value,
    exchangeRate: exchangeRate.value
  })
  
  if (authService.isAuthenticated()) {
    router.push('/recipient')
  } else {
    router.push('/login')
  }
}

const updateRate = () => {
  isLoading.value = true
  error.value = null
  setTimeout(() => {
    exchangeRate.value = exchangeRate.value + (Math.random() - 0.5) * 0.02
    lastUpdated.value = new Date()
    isLoading.value = false
  }, 500)
}

const timeAgo = computed(() => {
  const seconds = Math.floor((new Date() - lastUpdated.value) / 1000)
  if (seconds < 5) return 'just now'
  return `${seconds}s ago`
})
</script>

<template>
  <div class="converter-card">
    <div class="converter-header">
      <h2>Currency Converter</h2>
      <span class="updated-indicator" @click="updateRate" :class="{ loading: isLoading }">
        Updated {{ timeAgo }}
      </span>
    </div>

    <div class="converter-body">
      <div class="currency-row">
        <div class="currency-input-group">
          <label>You Send</label>
          <div class="input-wrapper">
            <input
              type="text"
              :value="amount"
              @input="handleAmountInput"
              placeholder="Enter amount"
              class="amount-input"
            />
          </div>
        </div>

        <div class="currency-select-group">
          <select v-model="fromCurrency" class="currency-select">
            <option v-for="currency in CURRENCIES" :key="currency.code" :value="currency.code">
              {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="swap-button-container">
        <button class="swap-button" @click="swapCurrencies" title="Swap currencies">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        </button>
      </div>

      <div class="currency-row">
        <div class="currency-input-group">
          <label>They Receive</label>
          <div class="input-wrapper result-wrapper">
            <span class="currency-symbol">{{ toCurrencyData.symbol }}</span>
            <span class="result-amount">{{ convertedAmount }}</span>
          </div>
        </div>

        <div class="currency-select-group">
          <select v-model="toCurrency" class="currency-select">
            <option v-for="currency in CURRENCIES" :key="currency.code" :value="currency.code">
              {{ currency.flag }} {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="rate-display">
        <span class="rate-label">Exchange Rate:</span>
        <span class="rate-value" @click="updateRate" title="Click to update">
          1 {{ fromCurrency }} = {{ exchangeRate.toFixed(4) }} {{ toCurrency }}
        </span>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button class="execute-button" @click="executeTransfer">
        Execute Transfer
      </button>
    </div>
  </div>
</template>

<style scoped>
.converter-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

.converter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.converter-header h2 {
  color: #FFFFFF;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.updated-indicator {
  color: #A0A0A0;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.updated-indicator:hover {
  color: #00E676;
}

.updated-indicator.loading {
  opacity: 0.5;
}

.currency-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.currency-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.currency-input-group label {
  color: #A0A0A0;
  font-size: 0.875rem;
}

.input-wrapper {
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #00E676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.2);
}

.amount-input {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 1.25rem;
  width: 100%;
  outline: none;
}

.amount-input::placeholder {
  color: #A0A0A0;
}

.result-wrapper {
  gap: 8px;
}

.currency-symbol {
  color: #00E676;
  font-size: 1.25rem;
}

.result-amount {
  color: #00E676;
  font-size: 1.5rem;
  font-weight: 600;
}

.currency-select-group {
  width: 100%;
}

.currency-select {
  width: 100%;
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 8px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A0A0A0' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.currency-select:focus {
  border-color: #00E676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.2);
}

.currency-select option {
  background: #0a1f1a;
  color: #FFFFFF;
}

.swap-button-container {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.swap-button {
  background: #0a1f1a;
  border: 1px solid #1a2e29;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #00E676;
  transition: all 0.2s ease;
}

.swap-button:hover {
  background: #00E676;
  color: #000000;
  transform: scale(1.05);
}

.swap-button:active {
  transform: scale(0.95);
}

.rate-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 12px;
  background: rgba(0, 230, 118, 0.05);
  border-radius: 8px;
}

.rate-label {
  color: #A0A0A0;
  font-size: 0.875rem;
}

.rate-value {
  color: #00E676;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.rate-value:hover {
  opacity: 0.8;
}

.error-message {
  color: #ff4757;
  font-size: 0.875rem;
  margin: 12px 0;
  padding: 8px;
  background: rgba(255, 71, 87, 0.1);
  border-radius: 8px;
}

.execute-button {
  width: 100%;
  background: #00E676;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.execute-button:hover {
  background: #00C853;
  transform: translateY(-2px);
}

.execute-button:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .converter-card {
    padding: 16px;
  }

  .converter-header h2 {
    font-size: 1.25rem;
  }

  .amount-input {
    font-size: 1.125rem;
  }

  .result-amount {
    font-size: 1.25rem;
  }
}
</style>
