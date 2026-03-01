import { authService } from './authService'

const API_URL = 'http://localhost:3000/transactions'
const LOCAL_STORAGE_KEY = 'moneylink_transactions'

export const transactionService = {
  _getLocalTransactions(userId) {
    const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`)
    return data ? JSON.parse(data) : []
  },

  _saveLocalTransaction(userId, transaction) {
    const transactions = this._getLocalTransactions(userId)
    // Evitar duplicados
    if (!transactions.find(t => t.id === transaction.id)) {
      transactions.unshift(transaction)
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(transactions))
    }
  },

  async getTransactions() {
    const user = authService.getCurrentUser()
    if (!user) return []

    try {
      // Intentamos obtener de la API filtrando por userId (convertido a string para seguridad)
      const response = await fetch(`${API_URL}?userId=${String(user.id)}`)
      if (!response.ok) throw new Error('API unstable')

      const apiTransactions = await response.json()

      // Combinar con locales para asegurar que no falte nada recién creado
      const localTransactions = this._getLocalTransactions(user.id)
      const combined = [...apiTransactions]

      localTransactions.forEach(lt => {
        if (!combined.find(at => at.id === lt.id)) {
          combined.push(lt)
        }
      })

      return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.warn('Usando respaldo local para el historial')
      return this._getLocalTransactions(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  },

  async saveTransaction(transaction) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    const newTransaction = {
      ...transaction,
      userId: String(user.id), // Forzar ID como string para json-server
      amount: Number(transaction.amount),
      convertedAmount: Number(transaction.convertedAmount),
      createdAt: transaction.createdAt || new Date().toISOString(),
      status: 'completed'
    }

    // Guardar localmente primero (feedback instantáneo)
    this._saveLocalTransaction(user.id, newTransaction)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      })
      if (!response.ok) throw new Error('API error during save')
      return await response.json()
    } catch (error) {
      console.warn('Transacción guardada solo localmente por ahora')
      return newTransaction
    }
  },

  async getRecentTransactions(limit = 5) {
    const transactions = await this.getTransactions()
    return transactions.slice(0, limit)
  }
}

export default transactionService
