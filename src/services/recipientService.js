const RECIPIENT_KEY = 'moneylink_recipients'

export const recipientService = {
  getRecipients() {
    const data = localStorage.getItem(RECIPIENT_KEY)
    return data ? JSON.parse(data) : []
  },

  getRecipientById(id) {
    const recipients = this.getRecipients()
    return recipients.find(r => r.id === id)
  },

  saveRecipient(recipient) {
    const recipients = this.getRecipients()
    
    const existingIndex = recipients.findIndex(r => r.email === recipient.email)
    
    if (existingIndex >= 0) {
      recipients[existingIndex] = { ...recipient, updatedAt: new Date().toISOString() }
    } else {
      const newRecipient = {
        ...recipient,
        id: String(Date.now()),
        createdAt: new Date().toISOString()
      }
      recipients.push(newRecipient)
    }
    
    localStorage.setItem(RECIPIENT_KEY, JSON.stringify(recipients))
    return recipient
  },

  deleteRecipient(id) {
    const recipients = this.getRecipients()
    const filtered = recipients.filter(r => r.id !== id)
    localStorage.setItem(RECIPIENT_KEY, JSON.stringify(filtered))
  },

  validateRecipient(data) {
    const errors = {}
    
    if (!data.fullName || data.fullName.length < 2) {
      errors.fullName = 'El nombre debe tener al menos 2 caracteres'
    }
    
    if (!data.country) {
      errors.country = 'El país es requerido'
    }
    
    if (!data.accountNumber) {
      errors.accountNumber = 'El número de cuenta es requerido'
    }
    
    if (!data.phone) {
      errors.phone = 'El teléfono es requerido'
    } else if (!/^\+?[\d\s-]{8,}$/.test(data.phone)) {
      errors.phone = 'Formato de teléfono inválido'
    }
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Formato de email inválido'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default recipientService
