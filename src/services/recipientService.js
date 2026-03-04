import { authService } from './authService'

const API_URL = 'http://localhost:3000/recipients'
const LOCAL_STORAGE_KEY = 'moneylink_recipients'

export const recipientService = {
  // basic validation helper used by tests
  validateRecipient(data) {
    const errors = {}
    if (!data.fullName || data.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }
    if (!data.country) {
      errors.country = 'Select a country'
    }
    if (!data.accountNumber) {
      errors.accountNumber = 'Account number is required'
    }
    if (!data.phone) {
      errors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-]{8,}$/.test(data.phone)) {
      errors.phone = 'Invalid phone format'
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format'
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  _getLocalRecipients(userId) {
    const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`)
    return data ? JSON.parse(data) : []
  },

  _saveLocalRecipients(userId, recipients) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(recipients))
  },

  async getRecipients(onlyFrequent = false) {
    const user = authService.getCurrentUser()
    if (!user) return []

    try {
      // Intentamos obtener de la API
      let url = `${API_URL}?userId=${String(user.id)}`
      if (onlyFrequent) {
        url += '&isFrequent=true'
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('API unstable')

      const apiRecipients = await response.json()

      // Combinamos con los locales para máxima fidelidad
      const localRecipients = this._getLocalRecipients(user.id)
      const combined = [...apiRecipients]

      localRecipients.forEach(lr => {
        if (!combined.find(ar => ar.id === lr.id || ar.email === lr.email)) {
          if (!onlyFrequent || lr.isFrequent) {
            combined.push(lr)
          }
        }
      })

      return combined
    } catch (error) {
      console.warn('Usando respaldo local para destinatarios')
      const local = this._getLocalRecipients(user.id)
      return onlyFrequent ? local.filter(r => r.isFrequent) : local
    }
  },

  async saveRecipient(recipient) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    const data = {
      ...recipient,
      userId: String(user.id),
      updatedAt: new Date().toISOString(),
      isFrequent: recipient.isFrequent !== undefined ? recipient.isFrequent : true
    }

    // 1. Guardar localmente primero
    const localRecipients = this._getLocalRecipients(user.id)
    const existingIdx = localRecipients.findIndex(r => r.email === recipient.email)

    if (existingIdx >= 0) {
      localRecipients[existingIdx] = { ...localRecipients[existingIdx], ...data }
    } else {
      localRecipients.push({ ...data, id: String(Date.now()) })
    }
    this._saveLocalRecipients(user.id, localRecipients)

    // 2. Intentar guardar en la API
    try {
      // Primero buscamos si ya existe en la API por email
      const checkRes = await fetch(`${API_URL}?email=${recipient.email}&userId=${user.id}`)
      const existingApi = await checkRes.json()

      if (existingApi.length > 0) {
        const response = await fetch(`${API_URL}/${existingApi[0].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
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
      console.warn('Destinatario guardado solo localmente')
      return data
    }
  },

  async deleteRecipient(id) {
    const user = authService.getCurrentUser()
    if (!user) return

    // Eliminar local
    const local = this._getLocalRecipients(user.id)
    this._saveLocalRecipients(user.id, local.filter(r => r.id !== id))

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error al eliminar en API')
    }
  },

  async getRecipientById(id) {
    const user = authService.getCurrentUser()
    if (!user) return null

    try {
      // Intentar obtener de la API
      const response = await fetch(`${API_URL}/${id}`)
      if (response.ok) {
        const recipient = await response.json()
        if (recipient.userId === String(user.id)) {
          return recipient
        }
      }
    } catch (error) {
      console.warn('Error al obtener destinatario de API, buscando en local')
    }

    // Buscar en local storage
    const localRecipients = this._getLocalRecipients(user.id)
    return localRecipients.find(r => r.id === id) || null
  },

  async updateRecipient(id, data) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    const updatedData = {
      ...data,
      userId: String(user.id),
      updatedAt: new Date().toISOString()
    }

    // 1. Actualizar localmente primero
    const localRecipients = this._getLocalRecipients(user.id)
    const existingIdx = localRecipients.findIndex(r => r.id === id)

    if (existingIdx >= 0) {
      localRecipients[existingIdx] = { ...localRecipients[existingIdx], ...updatedData }
      this._saveLocalRecipients(user.id, localRecipients)
    }

    // 2. Intentar actualizar en la API
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      
      if (!response.ok) throw new Error('Error al actualizar en API')
      return await response.json()
    } catch (error) {
      console.warn('Destinatario actualizado solo localmente')
      return { id, ...updatedData }
    }
  }
}

export default recipientService
