<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService, transferStorage } from '../services/authService'
import { recipientService } from '../services/recipientService'
import { transactionService } from '../services/transactionService'
import TransactionCard from '../components/TransactionCard.vue'
import HistoryList from '../components/HistoryList.vue'
import RecipientQuickList from '../components/RecipientQuickList.vue'

const emit = defineEmits(['auth-change'])

const router = useRouter()
const route = useRoute()

const currentUser = ref(null)
const currentTransaction = ref(null)
const recentTransactions = ref([])
const frequentRecipients = ref([])
const isLoadingRecipients = ref(true)

const loadData = async () => {
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  currentUser.value = authService.getCurrentUser()
  
  const transferData = transferStorage.getTransferData()
  if (transferData && transferData.step && transferData.step !== 'complete' && transferData.amount) {
    currentTransaction.value = transferData
  }
  
  try {
    frequentRecipients.value = await recipientService.getRecipients(true)
  } catch (error) {
    console.error('Error loading recipients:', error)
    frequentRecipients.value = []
  } finally {
    isLoadingRecipients.value = false
  }
  
  recentTransactions.value = await transactionService.getRecentTransactions(5)
}



onMounted(loadData)

// Reload data when the user lands on the dashboard
watch(() => route.path, (newPath) => {
  if (newPath === '/dashboard') {
    loadData()
  }
})

const greeting = computed(() => {
  if (!currentUser.value) return 'Welcome'
  
  const hour = new Date().getHours()
  let timeGreeting = 'Good morning'
  
  if (hour >= 12 && hour < 18) {
    timeGreeting = 'Good afternoon'
  } else if (hour >= 18) {
    timeGreeting = 'Good evening'
  }
  
  return `${timeGreeting}, ${currentUser.value.fullName?.split(' ')[0] || 'usuario'}`
})

const startNewTransfer = () => {
  transferStorage.clearTransferData()
  router.push('/converter')
}

const continueTransaction = () => {
  const transferData = transferStorage.getTransferData()
  if (transferData?.recipient) {
    router.push('/sender')
  } else {
    router.push('/recipient')
  }
}

const handleRecipientSelect = (recipient) => {
  const transferData = transferStorage.getTransferData() || {}
  
  transferStorage.saveTransferData({
    ...transferData,
    recipient: recipient,
    step: 'sender'
  })
  
  router.push('/sender')
}

const handleRecipientEdit = (recipient) => {
  router.push(`/edit-recipient/${recipient.id}`)
}

const handleRecipientDelete = async (recipient) => {
  const confirmed = confirm(`Are you sure you want to delete ${recipient.fullName} from your frequent recipients?`)
  
  if (confirmed) {
    try {
      await recipientService.deleteRecipient(recipient.id)
      frequentRecipients.value = await recipientService.getRecipients()
    } catch (error) {
      console.error('Error deleting recipient:', error)
    }
  }
}

const handleTransactionSelect = (transaction) => {
  console.log('Ver detalle de transacción:', transaction.id)
}

const goToProfile = () => {
  router.push('/profile')
}

const handleLogout = () => {
  authService.logout()
  emit('auth-change') // Inform App.vue to hide user info
  router.push('/converter')
}
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-left">
        <h1>{{ greeting }}</h1>
        <p class="subtitle">Activity summary</p>
      </div>
      <div class="header-right">
        <button class="new-transfer-btn" @click="startNewTransfer">
          <span class="btn-icon">➕</span>
          New Transfer
        </button>
        <button class="profile-btn" @click="goToProfile">
          <span class="btn-icon">👤</span>
          My Profile
        </button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <section v-if="currentTransaction" class="dashboard-section current-tx">
        <h2 class="section-title">
          <span class="title-icon">⏳</span>
          Transaction in Progress
        </h2>
        <TransactionCard 
          :transaction="currentTransaction" 
          @continue="continueTransaction"
        />
      </section>
      
      <section class="dashboard-section recipients-section">
        <h2 class="section-title">
          <span class="title-icon">⭐</span>
          Frequent Recipients
        </h2>
        <div v-if="isLoadingRecipients" class="loading-indicator">
          <span>Loading...</span>
        </div>
        <RecipientQuickList 
          v-else
          :recipients="frequentRecipients"
          @select="handleRecipientSelect"
          @edit="handleRecipientEdit"
          @delete="handleRecipientDelete"
        />
      </section>
      
      <section class="dashboard-section history-section">
        <h2 class="section-title">
          <span class="title-icon">📊</span>
          Transaction History
        </h2>
        <HistoryList 
          :transactions="recentTransactions"
          @select="handleTransactionSelect"
        />
      </section>
    </div>
    
    <div class="dashboard-footer">
      <button class="logout-btn" @click="handleLogout">
        Log Out
      </button>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h1 {
  color: var(--text-primary);
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.header-left .subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin: 0;
}

.new-transfer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-color);
  color: #000000;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-transfer-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.btn-icon {
  font-size: 1rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.title-icon {
  font-size: 1.25rem;
}

.current-tx {
  background: var(--bg-secondary);
  border-color: var(--accent-color);
}

.recipients-section {
  background: var(--bg-secondary);
}

.history-section {
  background: var(--bg-secondary);
}

.dashboard-footer {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-tertiary);
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: #ff6b7a;
  color: #ff6b7a;
}

@media (max-width: 640px) {
  .dashboard-container {
    padding: 24px 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .new-transfer-btn {
    width: 100%;
    justify-content: center;
  }
  
  .header-left h1 {
    font-size: 1.5rem;
  }
  
  .dashboard-section {
    padding: 20px 16px;
  }
}

.loading-indicator {
  text-align: center;
  padding: 24px;
  color: var(--text-tertiary);
}
</style>
