import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/WelcomeView.vue')
  },
  {
    path: '/local',
    redirect: '/sms'
  },
  {
    path: '/server',
    redirect: '/sms' // 暂时也重定向到SMS页面，未来可以实现服务器特定功能
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