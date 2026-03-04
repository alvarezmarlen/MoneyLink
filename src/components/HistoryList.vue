<script setup>
import { CURRENCIES } from '../constants/currencies'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const formatCurrency = (amount, currency) => {
  if (amount === null || amount === undefined || !currency) return '---'
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (e) {
    return `${amount} ${currency || ''}`
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const getCountryName = (code) => {
  const currency = CURRENCIES.find(c => c.code === code)
  return currency ? currency.region : code
}
</script>

<template>
  <div class="history-list">
    <div v-if="transactions.length === 0" class="empty-state">
      <span class="empty-icon">📭</span>
      <p class="empty-text">You don't have any transactions yet</p>
      <p class="empty-subtext">Your history will appear here</p>
    </div>
    
    <div v-else class="transactions">
      <div 
        v-for="tx in transactions" 
        :key="tx.id" 
        class="transaction-item"
        @click="emit('select', tx)"
      >
        <div class="tx-main">
          <div class="tx-amounts">
            <span class="amount-sent">{{ formatCurrency(tx.amount, tx.fromCurrency) }}</span>
            <span class="arrow">→</span>
            <span class="amount-received">{{ formatCurrency(tx.convertedAmount, tx.toCurrency) }}</span>
          </div>
          <div class="tx-meta">
            <span class="recipient">{{ tx.recipient?.fullName || 'N/A' }}</span>
            <span class="country">({{ getCountryName(tx.recipient?.country) }})</span>
          </div>
        </div>
        
        <div class="tx-right">
          <span class="tx-date">{{ formatDate(tx.createdAt) }}</span>
          <span class="tx-status completed">Completed</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-list {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.empty-text {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.empty-subtext {
  color: #5a6a65;
  font-size: 0.875rem;
  margin: 0;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.transaction-item:hover {
  border-color: #00E676;
  transform: translateX(4px);
}

.tx-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tx-amounts {
  display: flex;
  align-items: center;
  gap: 10px;
}

.amount-sent {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
}

.arrow {
  color: #00E676;
  font-size: 0.875rem;
}

.amount-received {
  color: #00E676;
  font-size: 1rem;
  font-weight: 600;
}

.tx-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recipient {
  color: #A0A0A0;
  font-size: 0.8125rem;
}

.country {
  color: #5a6a65;
  font-size: 0.75rem;
}

.tx-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.tx-date {
  color: #5a6a65;
  font-size: 0.75rem;
}

.tx-status {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.tx-status.completed {
  background: rgba(0, 200, 83, 0.15);
  color: #00C853;
}

@media (max-width: 480px) {
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .tx-right {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
