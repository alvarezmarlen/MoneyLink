import { describe, it, expect, beforeEach } from 'vitest'
import { recipientService } from '../services/recipientService'

describe('recipientService.js - MCP Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  describe('getRecipients', () => {
    it('returns empty array when no recipients exist', () => {
      const recipients = recipientService.getRecipients()
      expect(recipients).toEqual([])
    })
    
    it('returns stored recipients', () => {
      const mockRecipients = [
        { id: '1', fullName: 'John Doe', email: 'john@test.com' }
      ]
      localStorage.setItem('moneylink_recipients', JSON.stringify(mockRecipients))
      
      const recipients = recipientService.getRecipients()
      expect(recipients).toHaveLength(1)
      expect(recipients[0].fullName).toBe('John Doe')
    })
  })
  
  describe('getRecipientById', () => {
    it('returns undefined when no recipients exist', () => {
      const recipient = recipientService.getRecipientById('1')
      expect(recipient).toBeUndefined()
    })
    
    it('returns recipient by id', () => {
      const mockRecipients = [
        { id: '1', fullName: 'John Doe' },
        { id: '2', fullName: 'Jane Doe' }
      ]
      localStorage.setItem('moneylink_recipients', JSON.stringify(mockRecipients))
      
      const recipient = recipientService.getRecipientById('2')
      expect(recipient.fullName).toBe('Jane Doe')
    })
  })
  
  describe('saveRecipient', () => {
    it('saves new recipient', () => {
      const recipientData = {
        fullName: 'Test User',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567',
        email: 'test@test.com'
      }
      
      recipientService.saveRecipient(recipientData)
      
      const recipients = recipientService.getRecipients()
      expect(recipients).toHaveLength(1)
      expect(recipients[0].fullName).toBe('Test User')
    })
    
    it('adds id and timestamp to new recipient', () => {
      const recipientData = {
        fullName: 'Test User',
        country: 'CO'
      }
      
      recipientService.saveRecipient(recipientData)
      
      const recipients = recipientService.getRecipients()
      expect(recipients[0].id).toBeDefined()
      expect(recipients[0].createdAt).toBeDefined()
    })
    
    it('updates existing recipient by email', () => {
      const recipient1 = {
        fullName: 'User One',
        email: 'user@test.com',
        country: 'CO'
      }
      recipientService.saveRecipient(recipient1)
      
      const recipient2 = {
        fullName: 'User One Updated',
        email: 'user@test.com',
        country: 'MX'
      }
      recipientService.saveRecipient(recipient2)
      
      const recipients = recipientService.getRecipients()
      expect(recipients).toHaveLength(1)
      expect(recipients[0].fullName).toBe('User One Updated')
      expect(recipients[0].country).toBe('MX')
    })
  })
  
  describe('deleteRecipient', () => {
    it('removes recipient by id', () => {
      const mockRecipients = [
        { id: '1', fullName: 'John' },
        { id: '2', fullName: 'Jane' }
      ]
      localStorage.setItem('moneylink_recipients', JSON.stringify(mockRecipients))
      
      recipientService.deleteRecipient('1')
      
      const recipients = recipientService.getRecipients()
      expect(recipients).toHaveLength(1)
      expect(recipients[0].fullName).toBe('Jane')
    })
  })
  
  describe('validateRecipient', () => {
    it('returns valid for correct data', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })
    
    it('returns error for empty fullName', () => {
      const data = {
        fullName: '',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.fullName).toBeDefined()
    })
    
    it('returns error for short fullName', () => {
      const data = {
        fullName: 'A',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
    })
    
    it('returns error for missing country', () => {
      const data = {
        fullName: 'John Doe',
        country: '',
        accountNumber: '123456',
        phone: '+57 300 123 4567'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.country).toBeDefined()
    })
    
    it('returns error for missing accountNumber', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '',
        phone: '+57 300 123 4567'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.accountNumber).toBeDefined()
    })
    
    it('returns error for missing phone', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '123456',
        phone: ''
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.phone).toBeDefined()
    })
    
    it('returns error for invalid phone format', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '123456',
        phone: '123'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
    })
    
    it('returns error for invalid email format', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567',
        email: 'invalid-email'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBeDefined()
    })
    
    it('accepts valid email', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567',
        email: 'valid@email.com'
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(true)
    })
    
    it('accepts optional empty email', () => {
      const data = {
        fullName: 'John Doe',
        country: 'CO',
        accountNumber: '123456',
        phone: '+57 300 123 4567',
        email: ''
      }
      
      const result = recipientService.validateRecipient(data)
      expect(result.isValid).toBe(true)
    })
  })
  
  describe('simulateDelay', () => {
    it('returns a promise', () => {
      const result = recipientService.simulateDelay()
      expect(result).toBeInstanceOf(Promise)
    })
    
    it('resolves after delay', async () => {
      const start = Date.now()
      await recipientService.simulateDelay()
      const elapsed = Date.now() - start
      
      expect(elapsed).toBeGreaterThanOrEqual(250)
    })
  })
})
