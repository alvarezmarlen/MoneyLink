import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import { authService } from '../services/authService'

// router will be created fresh inside beforeEach to avoid stale state between tests
let router

describe('AuthView - E2E Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    // recreate router to isolate each test
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/converter', name: 'converter', component: { template: '<div>Converter</div>' } },
        { path: '/login', name: 'login', component: AuthView },
        { path: '/register', name: 'register', component: AuthView },
        { path: '/transfer', name: 'transfer', component: { template: '<div>Transfer</div>' } }
      ]
    })

    // stub authService.login to make tests deterministic
    vi.spyOn(authService, 'login').mockImplementation(async (email, password) => {
      if (email === 'test@example.com' && password === 'password123') {
        return { id: '1', email, fullName: 'Test User' }
      }
      // simulate rejection for wrong credentials
      throw new Error('Invalid credentials')
    })
  })

  afterEach(() => {
    authService.login.mockRestore && authService.login.mockRestore()
  })

  describe('Scenario 1: Login Form Rendering', () => {
    it('renders login form by default', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain('Welcome Back')
      expect(wrapper.text()).toContain('Log in to continue your transfer')
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Log In')
    })

    it('shows sign up link', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.text()).toContain("Don't have an account?")
      expect(wrapper.text()).toContain('Sign up')
    })
  })

  describe('Scenario 2: Registration Form', () => {
    it('toggles to registration form', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('.link-button').trigger('click')
      // navigation is asynchronous, wait for router and component update
      await flushPromises()
      await wrapper.vm.$nextTick()
      await router.isReady()

      expect(wrapper.text()).toContain('Create Account')
      expect(wrapper.text()).toContain('Sign up to get started')
      expect(wrapper.find('input#register-name').exists()).toBe(true)
      expect(wrapper.find('input#register-confirm').exists()).toBe(true)
      expect(wrapper.find('input#register-id').exists()).toBe(true)
    })

    it('shows login link in register mode', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('.link-button').trigger('click')
      await flushPromises()
      await wrapper.vm.$nextTick()
      await router.isReady()

      expect(wrapper.text()).toContain('Already have an account?')
      expect(wrapper.text()).toContain('Log in')
    })
  })

  describe('Scenario 3: Login Authentication', () => {
    it('sets error on invalid credentials', async () => {
      router.push('/login')
      await router.isReady()
      // prevent actual navigation in test (it will clear messages)
      const pushSpy = vi.spyOn(router, 'push').mockResolvedValue()

      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('input[type="email"]').setValue('wrong@test.com')
      await wrapper.find('input[type="password"]').setValue('wrongpass')
      await wrapper.find('form').trigger('submit')

      await flushPromises()

      expect(wrapper.vm.error).toBeDefined()

      pushSpy.mockRestore()
    })

    it('sets success message on successful login', async () => {
      router.push('/login')
      await router.isReady()
      const pushSpy = vi.spyOn(router, 'push').mockResolvedValue()

      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('form').trigger('submit')

      await flushPromises()

      expect(wrapper.vm.successMessage).toBe('Login successful!')

      pushSpy.mockRestore()
    })
  })

  describe('Scenario 4: Validation Errors', () => {
    it('shows error for empty email', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.vm.errors.email).toBeDefined()
    })

    it('shows error for invalid email format', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('input[type="email"]').setValue('invalid-email')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.vm.errors.email).toBeDefined()
    })

    it('shows error for empty password in login', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('input[type="email"]').setValue('test@test.com')
      await wrapper.find('input[type="password"]').setValue('')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.vm.errors.password).toBeDefined()
    })

    it('shows error for password mismatch in registration', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('.link-button').trigger('click')
      await flushPromises()
      await wrapper.vm.$nextTick()
      await router.isReady()

      await wrapper.find('input#register-name').setValue('John Doe')
      await wrapper.find('input#register-email').setValue('new@test.com')
      await wrapper.find('input#register-password').setValue('password123')
      await wrapper.find('input#register-confirm').setValue('differentpassword')
      await wrapper.find('input#register-id').setValue('123456')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.vm.errors.confirmPassword).toBeDefined()
    })

    it('shows error for short password in registration', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('.link-button').trigger('click')
      await flushPromises()
      await wrapper.vm.$nextTick()
      await router.isReady()

      await wrapper.find('input#register-name').setValue('John Doe')
      await wrapper.find('input#register-email').setValue('new@test.com')
      await wrapper.find('input#register-password').setValue('short')
      await wrapper.find('input#register-confirm').setValue('short')
      await wrapper.find('input#register-id').setValue('123456')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.vm.errors.password).toBeDefined()
    })

    it('shows error for short ID number', async () => {
      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await wrapper.find('.link-button').trigger('click')
      await flushPromises()
      await wrapper.vm.$nextTick()
      await router.isReady()

      await wrapper.find('input#register-name').setValue('John Doe')
      await wrapper.find('input#register-email').setValue('new@test.com')
      await wrapper.find('input#register-password').setValue('password123')
      await wrapper.find('input#register-confirm').setValue('password123')
      await wrapper.find('input#register-id').setValue('123')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.vm.errors.idNumber).toBeDefined()
    })
  })

  describe('Transfer Data Flow', () => {
    it('loads transfer data from localStorage', async () => {
      localStorage.setItem('moneylink_transfer_data', JSON.stringify({
        amount: 1000,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        convertedAmount: '920.00',
        exchangeRate: 0.92
      }))

      router.push('/login')
      await router.isReady()
      
      const wrapper = mount(AuthView, {
        global: {
          plugins: [router]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.transferData).toBeDefined()
      expect(wrapper.vm.transferData.amount).toBe(1000)
    })
  })
})
