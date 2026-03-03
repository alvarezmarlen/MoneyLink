import { describe, it, expect, beforeEach } from 'vitest'
import { transactionService } from '../services/transactionService'

const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User'
}

describe('transactionService.js - MCP Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('moneylink_auth', JSON.stringify(mockUser))
  })
  
  describe('getTransactions', () => {
    it('returns empty array when no transactions exist', () => {
      const transactions = transactionService.getTransactions()
      expect(transactions).toEqual([])
    })
    
    it('returns stored transactions for current user', () => {
      const mockTransactions = [
        { id: '1', amount: 500, fromCurrency: 'USD', toCurrency: 'EUR' }
      ]
      localStorage.setItem('moneylink_current_user_transactions_1', JSON.stringify(mockTransactions))
      
      const transactions = transactionService.getTransactions()
      expect(transactions).toHaveLength(1)
    })
  })
  
  describe('saveTransaction', () => {
    it('saves new transaction', () => {
      const txData = {
        amount: 500,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        convertedAmount: 450,
        recipient: { fullName: 'John Doe', country: 'CO' }
      }
      
      const result = transactionService.saveTransaction(txData)
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.amount).toBe(500)
      expect(result.status).toBe('completed')
    })
    
    it('adds timestamp to new transaction', () => {
      const txData = { amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' }
      
      const result = transactionService.saveTransaction(txData)
      
      expect(result.createdAt).toBeDefined()
    })
  })
  
  describe('getTransactionById', () => {
    it('returns undefined when no transactions exist', () => {
      const tx = transactionService.getTransactionById('1')
      expect(tx).toBeUndefined()
    })
    
    it('returns transaction by id', () => {
      const mockTransactions = [
        { id: '1', amount: 500 },
        { id: '2', amount: 300 }
      ]
      localStorage.setItem('moneylink_current_user_transactions_1', JSON.stringify(mockTransactions))
      
      const tx = transactionService.getTransactionById('2')
      expect(tx.amount).toBe(300)
    })
  })
  
  describe('deleteTransaction', () => {
    it('removes transaction by id', () => {
      const mockTransactions = [
        { id: '1', amount: 500 },
        { id: '2', amount: 300 }
      ]
      localStorage.setItem('moneylink_current_user_transactions_1', JSON.stringify(mockTransactions))
      
      transactionService.deleteTransaction('1')
      
      const transactions = transactionService.getTransactions()
      expect(transactions).toHaveLength(1)
      expect(transactions[0].id).toBe('2')
    })
  })
  
  describe('getRecentTransactions', () => {
    it('returns limited transactions', () => {
      const mockTransactions = [
        { id: '1', amount: 100 },
        { id: '2', amount: 200 },
        { id: '3', amount: 300 },
        { id: '4', amount: 400 },
        { id: '5', amount: 500 },
        { id: '6', amount: 600 }
      ]
      localStorage.setItem('moneylink_current_user_transactions_1', JSON.stringify(mockTransactions))
      
      const recent = transactionService.getRecentTransactions(3)
      
      expect(recent).toHaveLength(3)
    })
  })
  
  describe('getTotalSent', () => {
    it('calculates total sent for currency', () => {
      const mockTransactions = [
        { id: '1', amount: 500, fromCurrency: 'USD' },
        { id: '2', amount: 300, fromCurrency: 'USD' },
        { id: '3', amount: 200, fromCurrency: 'EUR' }
      ]
      localStorage.setItem('moneylink_current_user_transactions_1', JSON.stringify(mockTransactions))
      
      const total = transactionService.getTotalSent('USD')
      
      expect(total).toBe(800)
    })
  })
  
  describe('simulateDelay', () => {
    it('returns a promise', () => {
      const result = transactionService.simulateDelay()
      expect(result).toBeInstanceOf(Promise)
    })
  })
})
