<script setup>
// 导入必要的组件和函数
import { ref, watchEffect, computed } from 'vue'
import MessageList from './components/MessageList.vue'
import ContactList from './components/ContactList.vue'
import { parseXMLFile } from './utils/xmlParser'
import SearchBar from './components/SearchBar.vue'

// 状态管理
const messages = ref([])
const isLoading = ref(false)
const selectedContactId = ref(null)

// 处理联系人选择
function handleContactSelect(contactId) {
  selectedContactId.value = contactId
}

// 过滤当前选中联系人的消息
const currentContactMessages = computed(() => {
  if (!selectedContactId.value) return []
  return filteredMessages.value.filter(msg => msg.address === selectedContactId.value)
})

// 处理文件上传
async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    isLoading.value = true
    const result = await parseXMLFile(file)
    messages.value = result.messages
  } catch (error) {
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

// 搜索相关状态
const filteredMessages = ref([])

// 处理搜索
function handleSearch({ query, date }) {
  if (!query && !date) {
    filteredMessages.value = messages.value
    return
  }

  filteredMessages.value = messages.value.filter(msg => {
    const contentMatch = !query || msg.body.toLowerCase().includes(query.toLowerCase())
    const dateMatch = !date || new Date(msg.date).toLocaleDateString() === new Date(date).toLocaleDateString()
    return contentMatch && dateMatch
  })
}

// 初始化filteredMessages
watchEffect(() => {
  filteredMessages.value = messages.value
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">SMS Previewer</h1>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索栏和文件上传区域 -->
      <div class="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <SearchBar @search="handleSearch" class="flex-grow" />
        <div class="flex-shrink-0">
          <label class="flex items-center px-4 py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 transition-colors duration-200">
            <svg class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <span class="text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">点击上传</span> 或拖拽文件</span>
            <input type="file" class="hidden" accept=".xml" @change="handleFileUpload" />
          </label>
        </div>
      </div>

      <!-- 两栏布局：联系人列表和短信详情 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <!-- 联系人列表区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">联系人列表</h2>
          </div>
          <!-- 加载状态显示 -->
          <div v-if="isLoading" class="flex justify-center items-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
          <!-- 空状态显示 -->
          <div v-else-if="messages.length === 0" class="text-center p-8">
            <p class="text-gray-500 dark:text-gray-400">请上传短信备份文件</p>
          </div>
          <!-- 联系人列表（独立滚动） -->
          <div v-else class="overflow-y-auto h-[calc(100vh-16rem)]">
            <ContactList :messages="filteredMessages" @select-contact="handleContactSelect" />
          </div>
        </div>

        <!-- 短信列表区域 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow col-span-2 overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">短信列表</h2>
          </div>
          <!-- 短信列表（独立滚动） -->
          <div v-if="!isLoading && messages.length > 0" class="overflow-y-auto h-[calc(100vh-16rem)] p-4">
            <MessageList :messages="currentContactMessages" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* 全局样式 */
</style>
