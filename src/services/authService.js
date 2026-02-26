const STORAGE_KEY = 'moneylink_auth'
const TRANSFER_DATA_KEY = 'moneylink_transfer_data'
const API_URL = 'http://localhost:3000/users'

export const authService = {
  async login(email, password) {
    // Buscar usuario por correo y contraseña
    const response = await fetch(`${API_URL}?email=${email}&password=${password}`)

    if (!response.ok) {
      throw new Error('Error connecting to the server')
    }

    const users = await response.json()
    const user = users[0] // json-server devuelve un array si se filtra

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Guardamos la sesión en localStorage (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  },

  async register(userData) {
    // 1. Verificar si el email ya existe
    const checkResponse = await fetch(`${API_URL}?email=${userData.email}`)
    const existingUsers = await checkResponse.json()

    if (existingUsers.length > 0) {
      throw new Error('Email already exists')
    }

    // 2. Crear el nuevo usuario
    const newUser = {
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      idNumber: userData.idNumber
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })

    if (!response.ok) {
      throw new Error('Could not create account at this time')
    }

    const createdUser = await response.json()

    // 3. Guardar la sesión directamente al registrarse exitosamente
    const { password: _, ...userWithoutPassword } = createdUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  },

  async updateProfile(userData) {
    const user = this.getCurrentUser()
    if (!user) throw new Error('Usuario no autenticado')

    const updatedData = {
      ...user,
      fullName: userData.fullName,
      phone: userData.phone,
      address: userData.address
    }

    try {
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar el perfil')
      }

      const updatedUser = await response.json()
      
      // Actualizar localStorage
      const { password: _, ...userWithoutPassword } = updatedUser
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword))

      return userWithoutPassword
    } catch (error) {
      console.error('Error updating profile:', error)
      throw new Error('No se pudo actualizar el perfil')
    }
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
