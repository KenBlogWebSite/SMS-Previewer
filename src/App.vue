<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import ThemeSwitch from './components/ThemeSwitch.vue'
import { useTheme } from './composables/useTheme'

// 提示消息状态
const errorMessage = ref('')
const showError = ref(false)
const successMessage = ref('')
const showSuccess = ref(false)
const infoMessage = ref('')
const showInfo = ref(false)

// 主题配置
const { currentThemeConfig, isDarkMode } = useTheme()

// 获取当前路由
const route = useRoute()
const showNavbar = computed(() => route.path !== '/')

// 监听错误事件
window.addEventListener('show-error', (event) => {
  errorMessage.value = event.detail.message
  showError.value = true
  setTimeout(() => {
    showError.value = false
    errorMessage.value = ''
  }, 3000)
})

// 监听成功事件
window.addEventListener('show-success', (event) => {
  successMessage.value = event.detail.message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    successMessage.value = ''
  }, 3000)
})

// 监听信息提示事件
window.addEventListener('show-info', (event) => {
  infoMessage.value = event.detail.message
  showInfo.value = true
  setTimeout(() => {
    showInfo.value = false
    infoMessage.value = ''
  }, 3000)
})
</script>

<template>
  <div class="min-h-screen" :style="{
    backgroundColor: currentThemeConfig.colors.background,
    color: currentThemeConfig.colors.text
  }">
    <!-- 顶部导航栏 - 只在非欢迎页面显示 -->
    <div v-if="showNavbar" class="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow">
      <div class="container mx-auto px-4 py-2 flex items-center justify-between">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold">SMS Previewer</h1>
        <div class="flex gap-2">
          <button 
            class="px-3 py-1 rounded-md"
            :class="{ 
              'bg-[#EADDFF] text-[#21005D] hover:bg-[#D0BCFF]': $route.path.includes('/sms') && !isDarkMode, 
              'bg-[#4F378B] text-[#EADDFF] hover:bg-[#381E72]': $route.path.includes('/sms') && isDarkMode, 
              'text-[#65558F] hover:bg-[#F6EDFF]': !$route.path.includes('/sms') && !isDarkMode,
              'text-[#D0BCFE] hover:bg-[#4A4458]': !$route.path.includes('/sms') && isDarkMode
            }"
            @click="$router.push('/local/sms')"
          >
            短信记录
          </button>
          <button 
            class="px-3 py-1 rounded-md"
            :class="{ 
              'bg-[#EADDFF] text-[#21005D] hover:bg-[#D0BCFF]': $route.path.includes('/calls') && !isDarkMode, 
              'bg-[#4F378B] text-[#EADDFF] hover:bg-[#381E72]': $route.path.includes('/calls') && isDarkMode, 
              'text-[#65558F] hover:bg-[#F6EDFF]': !$route.path.includes('/calls') && !isDarkMode,
              'text-[#D0BCFE] hover:bg-[#4A4458]': !$route.path.includes('/calls') && isDarkMode
            }"
            @click="$router.push('/local/calls')"
          >
            通话记录
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <RouterView />
    </div>

    <!-- 主题切换组件 -->
    <ThemeSwitch />

    <!-- 错误提示 -->
    <div v-if="showError" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-red-100 text-red-800 p-3 rounded-lg shadow-lg flex items-center gap-2">
      <span class="font-bold">错误：</span>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-green-100 text-green-800 p-3 rounded-lg shadow-lg flex items-center gap-2">
      <span class="font-bold">成功：</span>
      <span>{{ successMessage }}</span>
    </div>

    <!-- 信息提示 -->
    <div v-if="showInfo" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-blue-100 text-blue-800 p-3 rounded-lg shadow-lg flex items-center gap-2">
      <span class="font-bold">提示：</span>
      <span>{{ infoMessage }}</span>
    </div>
  </div>
</template>

<style>
/* 全局样式优化 */
:root {
  --toast-z-index: 9999;
}

/* 性能优化 */
* {
  text-rendering: optimizeSpeed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 移动设备优化 */
@media (max-width: 640px) {
  .fixed.bottom-4.left-1\/2 {
    width: 90% !important;
    max-width: 90% !important;
  }
}
</style>
