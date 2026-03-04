import { describe, it, expect, beforeEach } from 'vitest'
import { recipientService } from '../services/recipientService'

const mockUser = {
  id: '1',
  email: 'test@example.com',
  fullName: 'Test User'
}

describe('recipientService.js - MCP Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('moneylink_auth', JSON.stringify(mockUser))
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
})
