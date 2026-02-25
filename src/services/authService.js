const STORAGE_KEY = 'moneylink_auth'
const TRANSFER_DATA_KEY = 'moneylink_transfer_data'

const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    idNumber: '12345678'
  }
]

export const authService = {
  async login(email, password) {
    await this.simulateDelay()
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))
    
    return userWithoutPassword
  },

  async register(userData) {
    await this.simulateDelay()
    
    const exists = MOCK_USERS.find(u => u.email === userData.email)
    if (exists) {
      throw new Error('Email already exists')
    }
    
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      idNumber: userData.idNumber
    }
    
    MOCK_USERS.push(newUser)
    
    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))
    
    return userWithoutPassword
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY)
  },

  getCurrentUser() {
    const userData = localStorage.getItem(STORAGE_KEY)
    return userData ? JSON.parse(userData) : null
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null
  },

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500))
  }
}

export const transferStorage = {
  saveTransferData(data) {
    localStorage.setItem(TRANSFER_DATA_KEY, JSON.stringify(data))
  },

  getTransferData() {
    const data = localStorage.getItem(TRANSFER_DATA_KEY)
    return data ? JSON.parse(data) : null
  },

  clearTransferData() {
    localStorage.removeItem(TRANSFER_DATA_KEY)
  }
}

export default authService
