import { createRouter, createWebHistory } from 'vue-router'
import ConverterView from '../views/ConverterView.vue'
import AuthView from '../views/AuthView.vue'
import TransferView from '../views/TransferView.vue'
import TrackingView from '../views/TrackingView.vue'
import RecipientView from '../views/RecipientView.vue'
import SenderView from '../views/SenderView.vue'
import PaymentView from '../views/PaymentView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import EditRecipientView from '../views/EditRecipientView.vue'
import RatesView from '../views/RatesView.vue'

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
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: TrackingView
    },
    {
      path: '/recipient',
      name: 'recipient',
      component: RecipientView
    },
    {
      path: '/sender',
      name: 'sender',
      component: SenderView
    },
    {
      path: '/payment',
      name: 'payment',
      component: PaymentView
    },
    {
      path: '/rates',
      name: 'rates',
      component: RatesView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/edit-recipient/:id',
      name: 'edit-recipient',
      component: EditRecipientView
    }
  ],
})

export default router
