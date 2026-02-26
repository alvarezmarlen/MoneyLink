<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipients: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'edit', 'delete'])

const countryNames = {
  'CO': 'Colombia',
  'MX': 'México',
  'PE': 'Perú',
  'CL': 'Chile',
  'AR': 'Argentina',
  'ES': 'España',
  'US': 'Estados Unidos'
}

const getCountryName = (code) => countryNames[code] || code

const handleSelect = (recipient) => {
  emit('select', recipient)
}

const handleEdit = (recipient, event) => {
  event.stopPropagation()
  emit('edit', recipient)
}

const handleDelete = (recipient, event) => {
  event.stopPropagation()
  emit('delete', recipient)
}
</script>

<template>
  <div class="recipient-list">
    <div v-if="recipients.length === 0" class="empty-state">
      <span class="empty-icon">👥</span>
      <p class="empty-text">Sin destinatarios guardados</p>
      <p class="empty-subtext">Guarda destinatarios frecuentes al realizar transferencias</p>
    </div>
    
    <div v-else class="recipients-grid">
      <div 
        v-for="recipient in recipients" 
        :key="recipient.id"
        class="recipient-chip"
        @click="handleSelect(recipient)"
      >
        <span class="avatar">{{ recipient.fullName.charAt(0).toUpperCase() }}</span>
        <div class="recipient-info">
          <span class="name">{{ recipient.fullName }}</span>
          <span class="country">{{ getCountryName(recipient.country) }}</span>
        </div>
        <div class="action-buttons">
          <button class="edit-btn" @click="handleEdit(recipient, $event)" title="Editar">
            ✏️
          </button>
          <button class="delete-btn" @click="handleDelete(recipient, $event)" title="Eliminar">
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipient-list {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 24px 16px;
}

.empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 8px;
}

.empty-text {
  color: #A0A0A0;
  font-size: 0.9375rem;
  margin: 0 0 4px 0;
}

.empty-subtext {
  color: #5a6a65;
  font-size: 0.8125rem;
  margin: 0;
}

.recipients-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.recipient-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(10, 31, 26, 0.5);
  border: 1px solid #1a2e29;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
  position: relative;
}

.recipient-chip:hover {
  border-color: #00E676;
  background: rgba(0, 230, 118, 0.05);
  transform: translateY(-2px);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00FF85 0%, #00E676 100%);
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

.recipient-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.name {
  color: #FFFFFF;
  font-size: 0.9375rem;
  font-weight: 500;
}

.country {
  color: #5a6a65;
  font-size: 0.75rem;
}

.edit-btn {
  position: absolute;
  top: 8px;
  right: 40px;
  background: rgba(10, 31, 26, 0.8);
  border: 1px solid #1a2e29;
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(10, 31, 26, 0.8);
  border: 1px solid #1a2e29;
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.recipient-chip:hover .edit-btn,
.recipient-chip:hover .delete-btn {
  opacity: 1;
}

.edit-btn:hover {
  background: rgba(0, 230, 118, 0.2);
  border-color: #00E676;
}

.delete-btn:hover {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff6b7a;
}

@media (max-width: 480px) {
  .recipients-grid {
    flex-direction: column;
  }
  
  .recipient-chip {
    width: 100%;
  }
}
</style>
