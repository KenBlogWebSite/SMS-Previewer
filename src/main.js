import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import SMSView from './views/SMSView.vue'
import CallsView from './views/CallsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/sms' },
    { path: '/sms', component: SMSView },
    { path: '/calls', component: CallsView }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
