<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import ThemeSwitch from './components/ThemeSwitch.vue'
import { useTheme } from './composables/useTheme'

// 错误提示状态
const errorMessage = ref('')
const showError = ref(false)

// 主题配置
const { currentThemeConfig } = useTheme()

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
  <div class="min-h-screen" :style="{
    backgroundColor: currentThemeConfig.colors.background,
    color: currentThemeConfig.colors.text
  }">
    <!-- 顶部导航栏 -->
    <mdui-top-app-bar class="sticky top-0 z-40">
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold">SMS Previewer</h1>
      <div slot="end">
        <mdui-segmented-button-group>
          <mdui-segmented-button 
            :selected="$route.path === '/sms'"
            @click="$router.push('/sms')"
          >
            <mdui-icon slot="icon" name="sms"></mdui-icon>
            短信记录
          </mdui-segmented-button>
          <mdui-segmented-button 
            :selected="$route.path === '/calls'"
            @click="$router.push('/calls')"
          >
            <mdui-icon slot="icon" name="call"></mdui-icon>
            通话记录
          </mdui-segmented-button>
        </mdui-segmented-button-group>
      </div>
    </mdui-top-app-bar>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <RouterView />
    </div>

    <!-- 主题切换组件 -->
    <ThemeSwitch />

    <!-- 错误提示 -->
    <mdui-snackbar
      v-if="showError"
      :open="showError"
      action="关闭"
      @close="showError = false"
    >
      {{ errorMessage }}
    </mdui-snackbar>
  </div>
</template>
