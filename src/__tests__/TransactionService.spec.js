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
    it('returns empty array when no transactions exist', async () => {
      const transactions = await transactionService.getTransactions()
      expect(transactions).toEqual([])
    })
    
    it('returns stored transactions for current user', async () => {
      const mockTransactions = [
        { id: '1', amount: 500, fromCurrency: 'USD', toCurrency: 'EUR' }
      ]
      localStorage.setItem('moneylink_transactions_1', JSON.stringify(mockTransactions))
      
      // debug info
      console.log('auth user inside test:', localStorage.getItem('moneylink_auth'))
      console.log('transactions raw inside test:', localStorage.getItem('moneylink_transactions_1'))
      
      const transactions = await transactionService.getTransactions()
      expect(transactions).toHaveLength(1)
    })
  })
  
  describe('saveTransaction', () => {
    it('saves new transaction', async () => {
      const txData = {
        amount: 500,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        convertedAmount: 450,
        recipient: { fullName: 'John Doe', country: 'CO' }
      }
      
      const result = await transactionService.saveTransaction(txData)
      
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.amount).toBe(500)
      expect(result.status).toBe('completed')
    })
    
    it('adds timestamp to new transaction', async () => {
      const txData = { amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' }
      
      const result = await transactionService.saveTransaction(txData)
      
      expect(result.createdAt).toBeDefined()
    })
  })
  
  describe('getTransactionById', () => {
    it('returns undefined when no transactions exist', async () => {
      const tx = await transactionService.getTransactionById('1')
      expect(tx).toBeUndefined()
    })
    
    it('returns transaction by id', async () => {
      const mockTransactions = [
        { id: '1', amount: 500, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '2', amount: 300, fromCurrency: 'USD', toCurrency: 'EUR' }
      ]
      localStorage.setItem('moneylink_transactions_1', JSON.stringify(mockTransactions))
      
      console.log('auth user before getTransactionById', localStorage.getItem('moneylink_auth'))
      console.log('local tx list', localStorage.getItem('moneylink_transactions_1'))
      
      const tx = await transactionService.getTransactionById('2')
      expect(tx.amount).toBe(300)
    })
  })
  
  describe('deleteTransaction', () => {
    it('removes transaction by id', async () => {
      const mockTransactions = [
        { id: '1', amount: 500, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '2', amount: 300, fromCurrency: 'USD', toCurrency: 'EUR' }
      ]
      localStorage.setItem('moneylink_transactions_1', JSON.stringify(mockTransactions))
      
      console.log('before delete auth user', localStorage.getItem('moneylink_auth'))
      console.log('before delete tx list', localStorage.getItem('moneylink_transactions_1'))
      
      await transactionService.deleteTransaction('1')
      
      const transactions = await transactionService.getTransactions()
      expect(transactions).toHaveLength(1)
      expect(transactions[0].id).toBe('2')
    })
  })
  
  describe('getRecentTransactions', () => {
    it('returns limited transactions', async () => {
      const mockTransactions = [
        { id: '1', amount: 100, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '2', amount: 200, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '3', amount: 300, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '4', amount: 400, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '5', amount: 500, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '6', amount: 600, fromCurrency: 'USD', toCurrency: 'EUR' }
      ]
      localStorage.setItem('moneylink_transactions_1', JSON.stringify(mockTransactions))
      
      console.log('recent test auth user', localStorage.getItem('moneylink_auth'))
      console.log('recent test local tx', localStorage.getItem('moneylink_transactions_1'))
      
      const recent = await transactionService.getRecentTransactions(3)
      
      expect(recent).toHaveLength(3)
    })
  })
  
  describe('getTotalSent', () => {
    it('calculates total sent for currency', async () => {
      const mockTransactions = [
        { id: '1', amount: 500, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '2', amount: 300, fromCurrency: 'USD', toCurrency: 'EUR' },
        { id: '3', amount: 200, fromCurrency: 'EUR', toCurrency: 'USD' }
      ]
      localStorage.setItem('moneylink_transactions_1', JSON.stringify(mockTransactions))
      
      const total = await transactionService.getTotalSent('USD')
      
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
