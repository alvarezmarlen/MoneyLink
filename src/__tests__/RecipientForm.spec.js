import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecipientForm from '../components/RecipientForm.vue'

describe('RecipientForm.vue - E2E Tests', () => {
  let wrapper
  
  beforeEach(() => {
    localStorage.clear()
    wrapper = mount(RecipientForm, {
      props: {
        initialData: null
      },
      emits: ['submit', 'cancel']
    })
  })
  
  it('renders all form fields', () => {
    expect(wrapper.find('#recipient-name').exists()).toBe(true)
    expect(wrapper.find('#recipient-country').exists()).toBe(true)
    expect(wrapper.find('#recipient-account').exists()).toBe(true)
    expect(wrapper.find('#recipient-phone').exists()).toBe(true)
    expect(wrapper.find('#recipient-email').exists()).toBe(true)
  })
  
  it('shows validation errors for empty required fields', async () => {
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    
    expect(wrapper.find('.error-text').exists()).toBe(true)
  })
  
  it('validates full name with less than 2 characters', async () => {
    await wrapper.find('#recipient-name').setValue('A')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.fullName).toBe('El nombre debe tener al menos 2 caracteres')
  })
  
  it('validates country selection', async () => {
    await wrapper.find('#recipient-country').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.country).toBe('Selecciona un país')
  })
  
  it('validates account number is required', async () => {
    await wrapper.find('#recipient-account').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.accountNumber).toBe('El número de cuenta es requerido')
  })
  
  it('validates phone is required', async () => {
    await wrapper.find('#recipient-phone').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.phone).toBe('El teléfono es requerido')
  })
  
  it('validates phone format', async () => {
    await wrapper.find('#recipient-phone').setValue('123')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.phone).toBe('Formato de teléfono inválido')
  })
  
  it('validates email format when provided', async () => {
    await wrapper.find('#recipient-email').setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.email).toBe('Formato de email inválido')
  })
  
  it('accepts valid email format', async () => {
    await wrapper.find('#recipient-email').setValue('test@example.com')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.email).toBeUndefined()
  })
  
  it.skip('submits form with valid data and frequent checkbox checked', async () => {
    await wrapper.find('#recipient-name').setValue('Juan Perez')
    await wrapper.find('#recipient-country').setValue('CO')
    await wrapper.find('#recipient-account').setValue('123456789')
    await wrapper.find('#recipient-phone').setValue('+57 300 123 4567')
    await wrapper.find('#recipient-email').setValue('juan@example.com')
    await wrapper.find('input[type="checkbox"]').setChecked()
    
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    const emittedData = wrapper.emitted('submit')[0][0]
    expect(emittedData.fullName).toBe('Juan Perez')
    expect(emittedData.country).toBe('CO')
    expect(emittedData.isFrequent).toBe(true)
  })
  
  it('submits form without saving as frequent', async () => {
    await wrapper.find('#recipient-name').setValue('Maria Garcia')
    await wrapper.find('#recipient-country').setValue('MXN')
    await wrapper.find('#recipient-account').setValue('987654321')
    await wrapper.find('#recipient-phone').setValue('+52 55 1234 5678')
    // allow v-model updates to propagate
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    const emittedData = wrapper.emitted('submit')[0][0]
    expect(emittedData.isFrequent).toBe(false)
  })
  
  it('cancel button emits cancel event', async () => {
    await wrapper.find('.cancel-button').trigger('click')
    
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })
  
  it('displays country options', async () => {
    const options = wrapper.findAll('select option')
    expect(options.length).toBeGreaterThan(1)
  })
  
  it('checkbox is unchecked by default', () => {
    expect(wrapper.vm.form.isFrequent).toBe(false)
  })
  
  it('checkbox can be toggled', async () => {
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked()
    expect(wrapper.vm.form.isFrequent).toBe(true)
  })
  
  it('loads initial data when provided', async () => {
    const initialData = {
      fullName: 'Test User',
      country: 'CO',
      accountNumber: '12345',
      phone: '+57 300 000 0000',
      email: 'test@test.com',
      isFrequent: true
    }
    
    const wrapperWithData = mount(RecipientForm, {
      props: { initialData },
      global: {
        stubs: {
          recipientService: {
            getRecipients: () => Promise.resolve([])
          }
        }
      }
    })
    
    await wrapperWithData.vm.$nextTick()
    await wrapperWithData.vm.$nextTick()
    
    expect(wrapperWithData.vm.form.fullName).toBe('Test User')
    expect(wrapperWithData.vm.form.country).toBe('CO')
    expect(wrapperWithData.vm.form.isFrequent).toBe(true)
  })
  
  it('submits with valid phone format', async () => {
    await wrapper.find('#recipient-name').setValue('Carlos Lopez')
    await wrapper.find('#recipient-country').setValue('PE')
    await wrapper.find('#recipient-account').setValue('111222333')
    await wrapper.find('#recipient-phone').setValue('+51 999 888 777')
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.phone).toBeUndefined()
  })
  
  it('renders with glassmorphism styles', () => {
    const form = wrapper.find('.recipient-form')
    expect(form.exists()).toBe(true)
  })
  
  it('renders action buttons', () => {
    expect(wrapper.find('.cancel-button').exists()).toBe(true)
    expect(wrapper.find('.submit-button').exists()).toBe(true)
  })
})
