import { authService } from './authService'

const API_URL = 'http://localhost:3000/recipients'
const LOCAL_STORAGE_KEY = 'moneylink_recipients'

export const recipientService = {
  _getLocalRecipients() {
    const user = authService.getCurrentUser()
    if (!user) return []
    
    const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${user.id}`)
    return data ? JSON.parse(data) : []
  },

  _saveLocalRecipients(recipients) {
    const user = authService.getCurrentUser()
    if (!user) return
    
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.id}`, JSON.stringify(recipients))
  },

  async getRecipients() {
    const user = authService.getCurrentUser()
    if (!user) return []

    try {
      const response = await fetch(`${API_URL}?userId=${user.id}`)
      if (!response.ok) {
        return this._getLocalRecipients()
      }
      return await response.json()
    } catch (error) {
      console.warn('API no disponible, usando almacenamiento local')
      return this._getLocalRecipients()
    }
  },

  async getRecipientById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`)
      if (!response.ok) {
        const local = this._getLocalRecipients()
        return local.find(r => r.id === id) || null
      }
      return await response.json()
    } catch (error) {
      const local = this._getLocalRecipients()
      return local.find(r => r.id === id) || null
    }
  },

  async saveRecipient(recipient) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

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
        if (!response.ok) throw new Error('API error')
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
        if (!response.ok) throw new Error('API error')
        return await response.json()
      }
    } catch (error) {
      console.warn('API no disponible, guardando localmente')
      const newRecipient = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString()
      }
      
      if (existing) {
        const idx = recipients.findIndex(r => r.email === recipient.email)
        recipients[idx] = { ...existing, ...newRecipient }
      } else {
        recipients.push(newRecipient)
      }
      
      this._saveLocalRecipients(recipients)
      return newRecipient
    }
  },

  async updateRecipient(id, recipientData) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recipientData,
          updatedAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error('API error')
      }

      return await response.json()
    } catch (error) {
      console.warn('API no disponible, actualizando localmente')
      const recipients = this._getLocalRecipients()
      const idx = recipients.findIndex(r => r.id === id)
      
      if (idx >= 0) {
        recipients[idx] = {
          ...recipients[idx],
          ...recipientData,
          updatedAt: new Date().toISOString()
        }
        this._saveLocalRecipients(recipients)
        return recipients[idx]
      }
      
      throw new Error('Destinatario no encontrado')
    }
  },

  async deleteRecipient(id) {
    const user = authService.getCurrentUser()
    if (!user) return

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('API error')
    } catch (error) {
      console.warn('API no disponible, eliminando localmente')
    }
    
    const recipients = this._getLocalRecipients()
    const filtered = recipients.filter(r => r.id !== id)
    this._saveLocalRecipients(filtered)
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
