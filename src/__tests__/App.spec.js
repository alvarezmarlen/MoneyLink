import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '../App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/converter', name: 'converter', component: { template: '<div>Converter</div>' } },
    { path: '/login', name: 'login', component: { template: '<div>Login</div>' } }
  ]
})

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  it('mounts and renders navbar', () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia]
      }
    })
    expect(wrapper.text()).toContain('MoneyLink')
    expect(wrapper.text()).toContain('Pro')
    expect(wrapper.text()).toContain('Log In')
    expect(wrapper.text()).toContain('Sign Up')
  })
})
