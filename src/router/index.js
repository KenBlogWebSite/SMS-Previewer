import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/WelcomeView.vue')
  },
  {
    path: '/local',
    component: { 
      template: '<router-view></router-view>' 
    },
    children: [
      {
        path: 'sms',
        name: 'LocalSMS',
        component: () => import('../views/SMSView.vue')
      },
      {
        path: 'calls',
        name: 'LocalCalls',
        component: () => import('../views/CallsView.vue')
      },
      {
        path: '',
        redirect: '/local/sms'
      }
    ]
  },
  {
    path: '/server',
    component: { 
      template: '<router-view></router-view>' 
    },
    children: [
      {
        path: 'sms',
        name: 'ServerSMS',
        component: () => import('../views/SMSView.vue')
      },
      {
        path: 'calls',
        name: 'ServerCalls',
        component: () => import('../views/CallsView.vue')
      },
      {
        path: '',
        redirect: '/server/sms'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router