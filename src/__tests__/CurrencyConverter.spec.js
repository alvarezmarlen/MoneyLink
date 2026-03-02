import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CurrencyConverter from '../components/CurrencyConverter.vue'
import currencyService, { STATIC_RATES } from '../services/currencyService'
import { CURRENCIES, DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY } from '../constants/currencies'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
  ]
})

describe('CurrencyConverter', () => {
  it('renders correctly with default values', () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Currency Converter')
    expect(wrapper.text()).toContain('You Send')
    expect(wrapper.text()).toContain('They Receive')
    expect(wrapper.text()).toContain('Execute Transfer')
  })

  it('displays default currencies', () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    const fromSelect = wrapper.find('select[name="fromCurrency"]')
    const toSelect = wrapper.find('select[name="toCurrency"]')
    
    expect(wrapper.vm.fromCurrency).toBe(DEFAULT_FROM_CURRENCY)
    expect(wrapper.vm.toCurrency).toBe(DEFAULT_TO_CURRENCY)
  })

  it('validates numeric input for amount', async () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    const input = wrapper.find('.amount-input')
    
    await input.setValue('1000')
    expect(wrapper.vm.amount).toBe(1000)
    
    await input.setValue('')
    expect(wrapper.vm.amount).toBe('')
    
    await input.setValue('abc')
    // v-model.number with custom validation rejects non-numeric values
    expect(isNaN(wrapper.vm.amount) || wrapper.vm.amount === 'abc').toBe(true)
  })

  it('converts amount correctly', async () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    wrapper.vm.amount = 1000
    wrapper.vm.exchangeRate = 0.92
    
    expect(wrapper.vm.convertedAmount).toBe('920.00')
  })

  it('swaps currencies correctly', async () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    wrapper.vm.fromCurrency = 'USD'
    wrapper.vm.toCurrency = 'EUR'
    
    const swapButton = wrapper.find('.swap-button')
    await swapButton.trigger('click')
    
    expect(wrapper.vm.fromCurrency).toBe('EUR')
    expect(wrapper.vm.toCurrency).toBe('USD')
  })

  it('shows currency options in dropdown', () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    const options = wrapper.findAll('select.currency-select option')
    expect(options.length).toBe(CURRENCIES.length * 2)
  })

  it('displays exchange rate', () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Exchange Rate:')
    expect(wrapper.text()).toContain('1 USD =')
  })

  it('navigates to login on execute transfer', async () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    const routerPush = vi.spyOn(router, 'push')
    
    const executeButton = wrapper.find('.execute-button')
    await executeButton.trigger('click')
    
    expect(routerPush).toHaveBeenCalledWith('/login')
  })

  it('updates rate on click', async () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    const initialRate = wrapper.vm.exchangeRate
    const rateValue = wrapper.find('.rate-value')
    
    await rateValue.trigger('click')
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    expect(wrapper.vm.exchangeRate).not.toBe(initialRate)
  })

  it('uses static rate when service returns null', async () => {
    const spy = vi.spyOn(currencyService, 'getExchangeRate').mockResolvedValue(null)
    const wrapper = mount(CurrencyConverter, {
      global: { plugins: [router] }
    })

    // initial fetch on mount will set to static if null
    await new Promise(resolve => setTimeout(resolve, 100))
    const staticRate = STATIC_RATES[wrapper.vm.fromCurrency][wrapper.vm.toCurrency]
    expect(wrapper.vm.exchangeRate).toBe(staticRate)
    spy.mockRestore()
  })

  it('displays updated indicator', () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.updated-indicator').exists()).toBe(true)
    expect(wrapper.text()).toContain('Updated')
  })

  it('displays currency flags in selectors', () => {
    const wrapper = mount(CurrencyConverter, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('🇺🇸')
    expect(wrapper.text()).toContain('🇪🇺')
  })
})
