<script setup>
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { currentThemeConfig } = useTheme()

// 导航函数
function navigate(mode, type) {
  router.push(`/${mode}/${type}`)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
    <!-- 欢迎标题 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4" style="color: var(--mdui-color-primary);">欢迎使用 SMS Previewer</h1>
      <p class="text-xl" style="color: var(--mdui-color-on-surface-variant);">请选择使用模式</p>
    </div>
    
    <!-- 模式选择卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <!-- 本地模式卡片 -->
      <div 
        class="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
        :style="{
          backgroundColor: 'var(--mdui-color-surface-container)',
          boxShadow: 'var(--mdui-elevation-level2)'
        }"
        @click="navigateToLocal"
      >
        <div class="flex flex-col items-center text-center">
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            :style="{
              backgroundColor: 'var(--mdui-color-primary-container)'
            }"
          >
            <mdui-icon name="smartphone" style="font-size: 32px; color: var(--mdui-color-on-primary-container);"></mdui-icon>
          </div>
          <h2 class="text-2xl font-semibold mb-2" style="color: var(--mdui-color-on-surface);">本地模式</h2>
          <p class="mb-4" style="color: var(--mdui-color-on-surface-variant);">通过上传XML文件在本地查看短信和通话记录</p>
          <div class="flex gap-2">
            <mdui-button variant="tonal" @click="navigate('local', 'sms')">
              <template v-slot:icon>
                <mdui-icon name="sms"></mdui-icon>
              </template>
              短信记录
            </mdui-button>
            <mdui-button variant="tonal" @click="navigate('local', 'calls')">
              <template v-slot:icon>
                <mdui-icon name="call"></mdui-icon>
              </template>
              通话记录
            </mdui-button>
          </div>
        </div>
      </div>
      
      <!-- 服务器模式卡片 -->
      <div 
        class="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
        :style="{
          backgroundColor: 'var(--mdui-color-surface-container)',
          boxShadow: 'var(--mdui-elevation-level2)'
        }"
        @click="navigateToServer"
      >
        <div class="flex flex-col items-center text-center">
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            :style="{
              backgroundColor: 'var(--mdui-color-tertiary-container)'
            }"
          >
            <mdui-icon name="cloud" style="font-size: 32px; color: var(--mdui-color-on-tertiary-container);"></mdui-icon>
          </div>
          <h2 class="text-2xl font-semibold mb-2" style="color: var(--mdui-color-on-surface);">服务器模式</h2>
          <p class="mb-4" style="color: var(--mdui-color-on-surface-variant);">连接到服务器自动解析上传的XML文件</p>
          <div class="flex gap-2">
            <mdui-button variant="tonal" @click="navigate('server', 'sms')">
              <template v-slot:icon>
                <mdui-icon name="sms"></mdui-icon>
              </template>
              短信记录
            </mdui-button>
            <mdui-button variant="tonal" @click="navigate('server', 'calls')">
              <template v-slot:icon>
                <mdui-icon name="call"></mdui-icon>
              </template>
              通话记录
            </mdui-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 版本信息 -->
    <div class="mt-12 text-center">
      <p class="text-sm" style="color: var(--mdui-color-on-surface-variant);">版本 1.0.0</p>
    </div>
  </div>
</template>