<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService, transferStorage } from '../services/authService'

const router = useRouter()
const route = useRoute()

const emit = defineEmits(['auth-change'])

const isLogin = ref(true)
const isLoading = ref(false)
const error = ref(null)
const successMessage = ref(null)

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  idNumber: ''
})

const errors = ref({})

const transferData = ref(null)

const checkRoute = () => {
  isLogin.value = route.path === '/login'
}

onMounted(() => {
  transferData.value = transferStorage.getTransferData()
  checkRoute()
})

watch(() => route.path, () => {
  checkRoute()
  error.value = null
  successMessage.value = null
  errors.value = {}
})

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validateLogin = () => {
  const newErrors = {}
  
  if (!loginForm.value.email) {
    newErrors.email = 'Email is required'
  } else if (!validateEmail(loginForm.value.email)) {
    newErrors.email = 'Invalid email format'
  }
  
  if (!loginForm.value.password) {
    newErrors.password = 'Password is required'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const validateRegister = () => {
  const newErrors = {}
  
  if (!registerForm.value.fullName) {
    newErrors.fullName = 'Full name is required'
  } else if (registerForm.value.fullName.length < 2) {
    newErrors.fullName = 'Full name must be at least 2 characters'
  }
  
  if (!registerForm.value.email) {
    newErrors.email = 'Email is required'
  } else if (!validateEmail(registerForm.value.email)) {
    newErrors.email = 'Invalid email format'
  }
  
  if (!registerForm.value.password) {
    newErrors.password = 'Password is required'
  } else if (registerForm.value.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  }
  
  if (!registerForm.value.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }
  
  if (!registerForm.value.idNumber) {
    newErrors.idNumber = 'ID number is required'
  } else if (registerForm.value.idNumber.length < 5) {
    newErrors.idNumber = 'ID number must be at least 5 characters'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleLogin = async () => {
  error.value = null
  successMessage.value = null
  
  if (!validateLogin()) return
  
  isLoading.value = true
  
  try {
    await authService.login(loginForm.value.email, loginForm.value.password)
    successMessage.value = 'Login successful!'
    
    setTimeout(() => {
      // Redirigir a la vista de destinatario para continuar con el envío
      emit('auth-change')
      router.push('/recipient')
    }, 500)
  } catch (e) {
    error.value = e.message || 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  error.value = null
  successMessage.value = null
  
  if (!validateRegister()) return
  
  isLoading.value = true
  
  try {
    await authService.register({
      email: registerForm.value.email,
      password: registerForm.value.password,
      fullName: registerForm.value.fullName,
      idNumber: registerForm.value.idNumber
    })
    successMessage.value = 'Registration successful!'
    
    setTimeout(() => {
      // Redirigir a la vista de destinatario para continuar con el envío
      emit('auth-change')
      router.push('/recipient')
    }, 500)
  } catch (e) {
    error.value = e.message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  const newPath = isLogin.value ? '/register' : '/login'
  router.push(newPath)
}

const title = computed(() => isLogin.value ? 'Welcome Back' : 'Create Account')
const subtitle = computed(() => isLogin.value ? 'Log in to continue your transfer' : 'Sign up to get started')
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input
            id="login-email"
            v-model="loginForm.email"
            type="email"
            placeholder="Enter your email"
            :class="{ 'input-error': errors.email }"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            :class="{ 'input-error': errors.password }"
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>

      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="register-name">Full Name</label>
          <input
            id="register-name"
            v-model="registerForm.fullName"
            type="text"
            placeholder="Enter your full name"
            :class="{ 'input-error': errors.fullName }"
          />
          <span v-if="errors.fullName" class="error-text">{{ errors.fullName }}</span>
        </div>

        <div class="form-group">
          <label for="register-email">Email</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            placeholder="Enter your email"
            :class="{ 'input-error': errors.email }"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="register-password">Password</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            placeholder="Create a password (min 8 chars)"
            :class="{ 'input-error': errors.password }"
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="register-confirm">Confirm Password</label>
          <input
            id="register-confirm"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            :class="{ 'input-error': errors.confirmPassword }"
          />
          <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <label for="register-id">ID Number (National ID)</label>
          <input
            id="register-id"
            v-model="registerForm.idNumber"
            type="text"
            placeholder="Enter your national ID number"
            :class="{ 'input-error': errors.idNumber }"
          />
          <span v-if="errors.idNumber" class="error-text">{{ errors.idNumber }}</span>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="auth-footer">
        <p v-if="isLogin">
          Don't have an account?
          <button type="button" class="link-button" @click="toggleMode">Sign up</button>
        </p>
        <p v-else>
          Already have an account?
          <button type="button" class="link-button" @click="toggleMode">Log in</button>
        </p>
      </div>

      <div v-if="transferData" class="transfer-preview">
        <p>Transfer data saved:</p>
        <span>{{ transferData.amount }} {{ transferData.fromCurrency }} → {{ transferData.convertedAmount }} {{ transferData.toCurrency }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
}

.auth-card {
  background: rgba(10, 31, 26, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 46, 41, 0.8);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-header h1 {
  color: #FFFFFF;
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.auth-header p {
  color: #A0A0A0;
  font-size: 0.9375rem;
  margin: 0;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.875rem;
}

.alert-error {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff6b7a;
}

.alert-success {
  background: rgba(0, 230, 118, 0.1);
  border: 1px solid rgba(0, 230, 118, 0.3);
  color: #00E676;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #A0A0A0;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  background: #020b08;
  border: 1px solid #1a2e29;
  border-radius: 8px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: #5a6a65;
}

.form-group input:focus {
  border-color: #00E676;
  box-shadow: 0 0 0 2px rgba(0, 230, 118, 0.2);
}

.form-group input.input-error {
  border-color: #ff6b7a;
}

.error-text {
  color: #ff6b7a;
  font-size: 0.75rem;
}

.submit-button {
  background: #00E676;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.submit-button:hover:not(:disabled) {
  background: #00C853;
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
}

.auth-footer p {
  color: #A0A0A0;
  font-size: 0.875rem;
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: #00E676;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.link-button:hover {
  color: #00C853;
}

.transfer-preview {
  margin-top: 20px;
  padding: 12px;
  background: rgba(0, 230, 118, 0.05);
  border: 1px solid #1a2e29;
  border-radius: 8px;
  text-align: center;
}

.transfer-preview p {
  color: #A0A0A0;
  font-size: 0.75rem;
  margin: 0 0 4px 0;
}

.transfer-preview span {
  color: #00E676;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 20px;
  }

  .auth-header h1 {
    font-size: 1.5rem;
  }
}
</style>
