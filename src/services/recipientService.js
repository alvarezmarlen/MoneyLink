import { authService } from './authService'

const API_URL = 'http://localhost:3000/recipients'

export const recipientService = {
  async getRecipients() {
    const user = authService.getCurrentUser()
    if (!user) return []

    try {
      const response = await fetch(`${API_URL}?userId=${user.id}`)
      if (!response.ok) return []
      return await response.json()
    } catch (error) {
      console.error('Error fetching recipients:', error)
      return []
    }
  },

  async getRecipientById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      return null
    }
  },

  async saveRecipient(recipient) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Buscar si ya existe uno con el mismo email para este usuario
    const recipients = await this.getRecipients()
    const existing = recipients.find(r => r.email === recipient.email)

    const data = {
      ...recipient,
      userId: user.id,
      updatedAt: new Date().toISOString()
    }

    try {
      if (existing) {
        const response = await fetch(`${API_URL}/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...existing, ...data })
        })
        return await response.json()
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            createdAt: new Date().toISOString()
          })
        })
        return await response.json()
      }
    } catch (error) {
      console.error('Error saving recipient:', error)
      throw new Error('No se pudo guardar el destinatario')
    }
  },

  async deleteRecipient(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
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
  }
}

export default recipientService
