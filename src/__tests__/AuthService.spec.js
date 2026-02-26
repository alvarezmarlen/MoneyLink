import { describe, it, expect, beforeEach } from 'vitest'
import { authService, transferStorage } from '../services/authService'

describe('AuthService - MCP Tests', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Login Flow', () => {
    it('should authenticate valid user', async () => {
      const user = await authService.login('test@example.com', 'password123')
      
      expect(user).toBeDefined()
      expect(user.email).toBe('test@example.com')
      expect(user.fullName).toBe('Test User')
      expect(user.id).toBe('1')
    })

    it('should reject invalid credentials', async () => {
      await expect(
        authService.login('wrong@example.com', 'wrongpass')
      ).rejects.toThrow('Invalid credentials')
    })

    it('should store user in localStorage after login', async () => {
      await authService.login('test@example.com', 'password123')
      
      const stored = localStorage.getItem('moneylink_auth')
      expect(stored).toBeTruthy()
      
      const user = JSON.parse(stored)
      expect(user.email).toBe('test@example.com')
    })

    it('should not store password in localStorage', async () => {
      await authService.login('test@example.com', 'password123')
      
      const stored = localStorage.getItem('moneylink_auth')
      const user = JSON.parse(stored)
      
      expect(user.password).toBeUndefined()
    })
  })

  describe('Registration Flow', () => {
    it('should register new user', async () => {
      const userData = {
        email: 'newuser@test.com',
        password: 'newpass123',
        fullName: 'New User',
        idNumber: '9876543'
      }
      
      const user = await authService.register(userData)
      
      expect(user).toBeDefined()
      expect(user.email).toBe('newuser@test.com')
      expect(user.fullName).toBe('New User')
    })

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'somepass123',
        fullName: 'Duplicate User',
        idNumber: '1111111'
      }
      
      await expect(
        authService.register(userData)
      ).rejects.toThrow('Email already exists')
    })

    it('should store new user in localStorage', async () => {
      const userData = {
        email: 'another@test.com',
        password: 'pass12345',
        fullName: 'Another User',
        idNumber: '5555555'
      }
      
      await authService.register(userData)
      
      const stored = localStorage.getItem('moneylink_auth')
      const user = JSON.parse(stored)
      
      expect(user.email).toBe('another@test.com')
    })
  })

  describe('Logout Flow', () => {
    it('should clear user from localStorage', async () => {
      await authService.login('test@example.com', 'password123')
      expect(localStorage.getItem('moneylink_auth')).toBeTruthy()
      
      authService.logout()
      expect(localStorage.getItem('moneylink_auth')).toBeNull()
    })
  })

  describe('Session Management', () => {
    it('should return current user when authenticated', async () => {
      await authService.login('test@example.com', 'password123')
      
      const user = authService.getCurrentUser()
      expect(user).toBeDefined()
      expect(user.email).toBe('test@example.com')
    })

    it('should return null when not authenticated', () => {
      localStorage.clear()
      
      const user = authService.getCurrentUser()
      expect(user).toBeNull()
    })

    it('should correctly identify authenticated state', async () => {
      expect(authService.isAuthenticated()).toBe(false)
      
      await authService.login('test@example.com', 'password123')
      expect(authService.isAuthenticated()).toBe(true)
      
      authService.logout()
      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('Transfer Data Storage', () => {
    it('should save transfer data', () => {
      const data = {
        amount: 1000,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        convertedAmount: '920.00',
        exchangeRate: 0.92
      }
      
      transferStorage.saveTransferData(data)
      
      const stored = localStorage.getItem('moneylink_transfer_data')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored)
      expect(parsed.amount).toBe(1000)
      expect(parsed.fromCurrency).toBe('USD')
    })

    it('should retrieve transfer data', () => {
      const data = {
        amount: 500,
        fromCurrency: 'GBP',
        toCurrency: 'COP',
        convertedAmount: '2400000.00',
        exchangeRate: 4800
      }
      
      transferStorage.saveTransferData(data)
      const retrieved = transferStorage.getTransferData()
      
      expect(retrieved).toEqual(data)
    })

    it('should clear transfer data', () => {
      const data = { amount: 100 }
      transferStorage.saveTransferData(data)
      
      transferStorage.clearTransferData()
      
      expect(localStorage.getItem('moneylink_transfer_data')).toBeNull()
    })

    it('should return null for empty transfer data', () => {
      localStorage.clear()
      
      const data = transferStorage.getTransferData()
      expect(data).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should handle network delay simulation', async () => {
      const start = Date.now()
      await authService.login('test@example.com', 'password123')
      const duration = Date.now() - start
      
      expect(duration).toBeGreaterThanOrEqual(450)
    })

    it('should handle empty credentials', async () => {
      await expect(
        authService.login('', '')
      ).rejects.toThrow()
    })
  })
})
