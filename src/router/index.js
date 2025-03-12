import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/sms'
  },
  {
    path: '/sms',
    name: 'SMS',
    component: () => import('../views/SMSView.vue')
  },
  {
    path: '/calls',
    name: 'Calls',
    component: () => import('../views/CallsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router