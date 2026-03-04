<script setup>
import { CURRENCIES } from '../constants/currencies'

const props = defineProps({
  recipients: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select', 'edit', 'delete'])

const getCountryName = (code) => {
  const currency = CURRENCIES.find(c => c.code === code)
  return currency ? currency.region : code
}

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
      <p class="empty-text">No saved recipients</p>
      <p class="empty-subtext">Save frequent recipients when making transfers</p>
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
        <div class="action-buttons" @click.stop>
          <button class="edit-btn" @click="handleEdit(recipient, $event)" title="Edit">
            ✏️
          </button>
          <button class="delete-btn" @click="handleDelete(recipient, $event)" title="Delete">
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
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin: 0 0 4px 0;
}

.empty-subtext {
  color: var(--text-tertiary);
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
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
  position: relative;
}

.recipient-chip:hover {
  border-color: var(--accent-color);
  background: rgba(0, 230, 118, 0.05);
  transform: translateY(-2px);
}

.avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
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
  flex: 1;
  min-width: 0;
}

.name {
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.country {
  color: var(--text-tertiary);
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.action-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.recipient-chip:hover .action-buttons {
  opacity: 1;
}

.edit-btn,
.delete-btn {
  background: rgba(10, 31, 26, 0.9);
  border: 1px solid #1a2e29;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.edit-btn:hover {
  background: rgba(0, 230, 118, 0.2);
  border-color: #00E676;
  transform: scale(1.05);
}

.delete-btn:hover {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff6b7a;
  transform: scale(1.05);
}

@media (max-width: 480px) {
  .recipients-grid {
    flex-direction: column;
  }
  
  .recipient-chip {
    width: 100%;
    min-width: unset;
  }
  
  .action-buttons {
    opacity: 1;
  }
  
  .edit-btn,
  .delete-btn {
    min-width: 28px;
    height: 28px;
    padding: 4px 6px;
    font-size: 0.75rem;
  }
}
</style>
