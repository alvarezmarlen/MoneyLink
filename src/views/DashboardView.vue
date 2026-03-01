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
  
  try {
    recentTransactions.value = await transactionService.getRecentTransactions(5)
  } catch (error) {
    console.error('Error loading transactions:', error)
    recentTransactions.value = []
  }
}

onMounted(loadData)

// Reload data when the user lands on the dashboard
watch(() => route.path, (newPath) => {
  if (newPath === '/dashboard') {
    loadData()
  }
})

const greeting = computed(() => {
  if (!currentUser.value) return 'Bienvenido'
  
  const hour = new Date().getHours()
  let timeGreeting = 'Buenos días'
  
  if (hour >= 12 && hour < 18) {
    timeGreeting = 'Buenas tardes'
  } else if (hour >= 18) {
    timeGreeting = 'Buenas noches'
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
  const confirmed = confirm(`¿Estás seguro de eliminar a ${recipient.fullName} de tus destinatarios frecuentes?`)
  
  if (confirmed) {
    try {
      await recipientService.deleteRecipient(recipient.id)
      frequentRecipients.value = await recipientService.getRecipients()
    } catch (error) {
      console.error('Error al eliminar destinatario:', error)
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
        <p class="subtitle">Resumen de tu actividad</p>
      </div>
      <div class="header-right">
        <button class="new-transfer-btn" @click="startNewTransfer">
          <span class="btn-icon">➕</span>
          Nueva Transferencia
        </button>
        <button class="profile-btn" @click="goToProfile">
          <span class="btn-icon">👤</span>
          Mi Perfil
        </button>
      </div>
    </div>
    
    <div class="dashboard-content">
      <section v-if="currentTransaction" class="dashboard-section current-tx">
        <h2 class="section-title">
          <span class="title-icon">⏳</span>
          Transacción en Curso
        </h2>
        <TransactionCard 
          :transaction="currentTransaction" 
          @continue="continueTransaction"
        />
      </section>
      
      <section class="dashboard-section recipients-section">
        <h2 class="section-title">
          <span class="title-icon">⭐</span>
          Destinatarios Frecuentes
        </h2>
        <div v-if="isLoadingRecipients" class="loading-indicator">
          <span>Cargando...</span>
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
          Historial de Transacciones
        </h2>
        <HistoryList 
          :transactions="recentTransactions"
          @select="handleTransactionSelect"
        />
      </section>
    </div>
    
    <div class="dashboard-footer">
      <button class="logout-btn" @click="handleLogout">
        Cerrar Sesión
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
  color: #FFFFFF;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.header-left .subtitle {
  color: #A0A0A0;
  font-size: 0.9375rem;
  margin: 0;
}

.new-transfer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #00E676;
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
  background: #00C853;
  transform: translateY(-2px);
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #A0A0A0;
  border: 1px solid #1a2e29;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-btn:hover {
  border-color: #00E676;
  color: #00E676;
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
  background: rgba(10, 31, 26, 0.4);
  border: 1px solid #1a2e29;
  border-radius: 16px;
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #FFFFFF;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.title-icon {
  font-size: 1.25rem;
}

.current-tx {
  background: rgba(10, 31, 26, 0.6);
}

.recipients-section {
  background: rgba(10, 31, 26, 0.3);
}

.history-section {
  background: rgba(10, 31, 26, 0.3);
}

.dashboard-footer {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.logout-btn {
  background: transparent;
  border: 1px solid #1a2e29;
  color: #5a6a65;
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
  color: #5a6a65;
}
</style>
