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
    if (!transactions.find(t => t.id === transaction.id)) {
      transactions.unshift(transaction)
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(transactions))
    }
  },

  async getTransactions() {
    const user = authService.getCurrentUser()
    if (!user) return []

    try {
      const response = await fetch(`${API_URL}?userId=${String(user.id)}`)
      if (!response.ok) throw new Error('API unstable')

      const apiTransactions = await response.json()

      // Filtrar transacciones corruptas (sin monto o sin divisas)
      const validApiTx = apiTransactions.filter(t => t.amount !== null && t.fromCurrency && t.toCurrency)

      const localTransactions = this._getLocalTransactions(user.id)
      const combined = [...validApiTx]

      localTransactions.forEach(lt => {
        if (!combined.find(at => at.id === lt.id)) {
          if (lt.amount !== null && lt.fromCurrency && lt.toCurrency) {
            combined.push(lt)
          }
        }
      })

      return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.warn('Usando respaldo local para el historial')
      return this._getLocalTransactions(user.id)
        .filter(t => t.amount !== null && t.fromCurrency && t.toCurrency)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  },

  async saveTransaction(transaction) {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    // Validar datos mínimos antes de intentar guardar
    if (!transaction.amount || !transaction.fromCurrency || !transaction.toCurrency) {
      console.warn('Evitando guardar transaccion incompleta:', transaction)
      return null
    }

    const newTransaction = {
      ...transaction,
      id: transaction.id || String(Date.now()),
      userId: String(user.id),
      amount: Number(transaction.amount),
      convertedAmount: Number(transaction.convertedAmount),
      sender: transaction.sender ? {
        fullName: transaction.sender.fullName,
        idNumber: transaction.sender.idNumber,
        phone: transaction.sender.phone,
        email: transaction.sender.email,
        address: transaction.sender.address
      } : undefined,
      createdAt: transaction.createdAt || new Date().toISOString(),
      status: 'completed'
    }

    this._saveLocalTransaction(user.id, newTransaction)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      })
      if (!response.ok) throw new Error('API error')
      return await response.json()
    } catch (error) {
      console.warn('Transacción guardada solo localmente')
      return newTransaction
    }
  },

  async getRecentTransactions(limit = 5) {
    const transactions = await this.getTransactions()
    return transactions.slice(0, limit)
  }
}

export default transactionService
