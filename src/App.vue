<script setup>
import { ref, computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import ThemeSwitch from './components/ThemeSwitch.vue'
import { useTheme } from './composables/useTheme'

// 错误提示状态
const errorMessage = ref('')
const showError = ref(false)

// 主题配置
const { currentThemeConfig } = useTheme()

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
</script>

<template>
  <div class="min-h-screen" :style="{
    backgroundColor: currentThemeConfig.colors.background,
    color: currentThemeConfig.colors.text
  }">
    <!-- 顶部导航栏 - 只在非欢迎页面显示 -->
    <md-top-app-bar v-if="showNavbar" class="sticky top-0 z-40">
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold">SMS Previewer</h1>
      <template #end>
        <md-segmented-button-set>
          <md-segmented-button 
            :selected="$route.path === '/sms'"
            @click="$router.push('/sms')"
          >
            <template #icon>
              <md-icon>sms</md-icon>
            </template>
            <span>短信记录</span>
          </md-segmented-button>
          <md-segmented-button 
            :selected="$route.path === '/calls'"
            @click="$router.push('/calls')"
          >
            <template #icon>
              <md-icon>call</md-icon>
            </template>
            <span>通话记录</span>
          </md-segmented-button>
        </md-segmented-button-set>
      </template>
    </md-top-app-bar>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <RouterView />
    </div>

    <!-- 主题切换组件 -->
    <ThemeSwitch />

    <!-- 错误提示 Snackbar -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <md-snackbar
        v-if="showError"
        :open="showError"
        action="关闭"
        @close="showError = false"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        :style="{
          backgroundColor: currentThemeConfig.colors.surfaceContainer,
          color: currentThemeConfig.colors.onSurface,
          boxShadow: 'var(--mdui-elevation-level3)'
        }"
      >
        <div class="flex items-center gap-2">
          <md-icon class="text-error">error</md-icon>
          <span>{{ errorMessage }}</span>
        </div>
      </md-snackbar>
    </Transition>
  </div>
</template>
