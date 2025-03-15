<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import { onMounted } from 'vue'

const router = useRouter()
const { currentThemeConfig } = useTheme()

// 添加调试日志函数
function logDebug(message, data = null) {
  console.log(`[DEBUG] ${message}`, data || '')
  // 将日志显示在页面上，方便移动设备调试
  const event = new CustomEvent('show-info', {
    detail: { message: `[DEBUG] ${message}` }
  })
  window.dispatchEvent(event)
}

// 导航函数
function navigate(mode, type) {
  logDebug(`navigate 被调用: mode=${mode}, type=${type}`)
  router.push(`/${mode}/${type}`)
}

// 直接导航到特定页面的快捷函数
function navigateToLocal(type) {
  logDebug(`navigateToLocal 被调用: type=${type}`)
  try {
    router.push(`/local/${type || 'sms'}`)
    logDebug(`路由推送完成: /local/${type || 'sms'}`)
  } catch (error) {
    logDebug(`路由错误: ${error.message}`, error)
  }
}

function navigateToServer(type) {
  logDebug(`navigateToServer 被调用: type=${type}`)
  try {
    router.push(`/server/${type || 'sms'}`)
    logDebug(`路由推送完成: /server/${type || 'sms'}`)
  } catch (error) {
    logDebug(`路由错误: ${error.message}`, error)
  }
}

// 直接点击卡片的导航函数
function navigateToLocalCard() {
  logDebug('navigateToLocalCard 被调用')
  navigateToLocal('sms')
}

function navigateToServerCard() {
  logDebug('navigateToServerCard 被调用')
  navigateToServer('sms')
}

// 组件挂载时记录路由信息
onMounted(() => {
  logDebug('WelcomeView 组件已挂载')
  logDebug(`当前路由: ${router.currentRoute.value.fullPath}`)
  logDebug('路由配置:', router.options.routes)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
    <!-- 欢迎标题 -->
    <div class="text-center mb-8 sm:mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold mb-4" style="color: var(--mdui-color-primary);">欢迎使用 SMS Previewer</h1>
      <p class="text-lg sm:text-xl" style="color: var(--mdui-color-on-surface-variant);">请选择使用模式</p>
    </div>
    
    <!-- 模式选择卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
      <!-- 本地模式卡片 -->
      <div 
        class="p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 welcome-card"
        :style="{
          backgroundColor: 'var(--mdui-color-surface-container)',
          boxShadow: 'var(--mdui-elevation-level2)'
        }"
        @click="navigateToLocalCard"
      >
        <div class="flex flex-col items-center text-center">
          <div 
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4"
            :style="{
              backgroundColor: 'var(--mdui-color-primary-container)'
            }"
          >
            <mdui-icon name="smartphone" style="font-size: 28px; color: var(--mdui-color-on-primary-container);"></mdui-icon>
          </div>
          <h2 class="text-xl sm:text-2xl font-semibold mb-2" style="color: var(--mdui-color-on-surface);">本地模式</h2>
          <p class="mb-4 text-sm sm:text-base" style="color: var(--mdui-color-on-surface-variant);">通过上传XML文件在本地查看短信和通话记录</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button 
              class="mdui-button-tonal px-4 py-2 rounded-lg flex items-center gap-2"
              @click.stop="navigateToLocal('sms')"
            >
              <mdui-icon name="sms"></mdui-icon>
              <span>短信记录</span>
            </button>
            <button 
              class="mdui-button-tonal px-4 py-2 rounded-lg flex items-center gap-2"
              @click.stop="navigateToLocal('calls')"
            >
              <mdui-icon name="call"></mdui-icon>
              <span>通话记录</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 服务器模式卡片 -->
      <div 
        class="p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 welcome-card"
        :style="{
          backgroundColor: 'var(--mdui-color-surface-container)',
          boxShadow: 'var(--mdui-elevation-level2)'
        }"
        @click="navigateToServerCard"
      >
        <div class="flex flex-col items-center text-center">
          <div 
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4"
            :style="{
              backgroundColor: 'var(--mdui-color-tertiary-container)'
            }"
          >
            <mdui-icon name="cloud" style="font-size: 28px; color: var(--mdui-color-on-tertiary-container);"></mdui-icon>
          </div>
          <h2 class="text-xl sm:text-2xl font-semibold mb-2" style="color: var(--mdui-color-on-surface);">服务器模式</h2>
          <p class="mb-4 text-sm sm:text-base" style="color: var(--mdui-color-on-surface-variant);">连接到服务器自动解析上传的XML文件</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <button 
              class="mdui-button-tonal px-4 py-2 rounded-lg flex items-center gap-2"
              @click.stop="navigateToServer('sms')"
            >
              <mdui-icon name="sms"></mdui-icon>
              <span>短信记录</span>
            </button>
            <button 
              class="mdui-button-tonal px-4 py-2 rounded-lg flex items-center gap-2"
              @click.stop="navigateToServer('calls')"
            >
              <mdui-icon name="call"></mdui-icon>
              <span>通话记录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 版本信息 -->
    <div class="mt-8 sm:mt-12 text-center">
      <p class="text-sm" style="color: var(--mdui-color-on-surface-variant);">版本 1.0.0</p>
    </div>
  </div>
</template>

<style scoped>
/* 移动设备优化 */
@media (max-width: 640px) {
  .welcome-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .welcome-card h2 {
    font-size: 1.25rem;
  }
  
  .welcome-card p {
    font-size: 0.875rem;
  }
}

/* 按钮样式 */
.mdui-button-tonal {
  background-color: var(--mdui-color-secondary-container);
  color: var(--mdui-color-on-secondary-container);
  transition: all 0.3s ease;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  border: none;
  outline: none;
}

.mdui-button-tonal:hover {
  background-color: var(--mdui-color-secondary);
  color: var(--mdui-color-on-secondary);
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mdui-button-tonal:active {
  transform: translateY(0);
}

.mdui-button-tonal:focus {
  outline: 2px solid var(--mdui-color-secondary);
  outline-offset: 2px;
}

/* 性能优化 */
.welcome-card {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 动画优化 */
@media (prefers-reduced-motion: reduce) {
  .welcome-card {
    transition: none;
  }
  
  .mdui-button-tonal:hover {
    transform: none;
  }
}
</style>