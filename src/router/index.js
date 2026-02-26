import { createRouter, createWebHistory } from 'vue-router'
import ConverterView from '../views/ConverterView.vue'
import AuthView from '../views/AuthView.vue'
import TransferView from '../views/TransferView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/converter'
    },
    {
      path: '/converter',
      name: 'converter',
      component: ConverterView
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView
    },
    {
      path: '/register',
      name: 'register',
      component: AuthView
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: TransferView
    }
  ],
})

export default router
