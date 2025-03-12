<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

// 错误提示状态
const errorMessage = ref('')
const showError = ref(false)

// 监听错误事件
window.addEventListener('show-error', (event) => {
  errorMessage.value = event.detail.message
  showError.value = true
  setTimeout(() => {
    showError.value = false
    errorMessage.value = ''
  }, 3000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">SMS Previewer</h1>
          <nav class="flex space-x-4">
            <RouterLink 
              to="/sms" 
              class="px-3 py-2 rounded-md text-sm font-medium" 
              :class="{
                'bg-blue-500 text-white': $route.path === '/sms',
                'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white': $route.path !== '/sms'
              }"
            >
              短信记录
            </RouterLink>
            <RouterLink 
              to="/calls" 
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="{
                'bg-blue-500 text-white': $route.path === '/calls',
                'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white': $route.path !== '/calls'
              }"
            >
              通话记录
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <RouterView />

    <!-- 错误提示 -->
    <div
      v-if="showError"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100"
      :class="{ 'translate-y-full opacity-0': !showError }"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
