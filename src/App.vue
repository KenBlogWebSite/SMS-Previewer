<script setup>
// 导入必要的组件和函数
import { ref, computed } from 'vue'
import MessageList from './components/MessageList.vue'
import ContactList from './components/ContactList.vue'
import { parseXMLFile } from './utils/xmlParser'

// 状态管理
const messages = ref([])
const isLoading = ref(false)
const selectedContact = ref(null)

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

// 处理联系人选择
function handleContactSelect(contactId) {
  selectedContact.value = contactId
}

// 过滤当前联系人的消息
const currentContactMessages = computed(() => {
  if (!selectedContact.value) return []
  return messages.value.filter(msg => msg.address === selectedContact.value)
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
      <!-- 文件上传区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-center w-full">
          <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">点击上传</span> 或拖拽文件</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">支持 SMS Backup & Restore 导出的 XML 文件</p>
            </div>
            <input type="file" class="hidden" accept=".xml" @change="handleFileUpload" />
          </label>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <!-- 联系人列表 -->
        <div class="border-r border-gray-200 dark:border-gray-700">
          <!-- 加载状态显示 -->
          <div v-if="isLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
          <!-- 空状态显示 -->
          <div v-else-if="messages.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">请上传短信备份文件</p>
          </div>
          <!-- 联系人列表 -->
          <div v-else>
            <ContactList :messages="messages" @select-contact="handleContactSelect" />
          </div>
        </div>

        <!-- 消息内容区域 -->
        <div class="col-span-1 md:col-span-2 lg:col-span-3 p-6">
          <div v-if="!selectedContact" class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>请选择联系人查看对话</p>
          </div>
          <div v-else>
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
