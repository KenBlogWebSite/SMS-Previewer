<script setup>
import { ref, watchEffect, computed } from 'vue'
import MessageList from '../components/MessageList.vue'
import ContactList from '../components/ContactList.vue'
import SearchBar from '../components/SearchBar.vue'
import { parseXMLFile } from '../utils/xmlParser'
import { useDevice } from '../composables/useDevice'
import { useTheme } from '../composables/useTheme'

// 状态管理
const messages = ref([])
const isLoading = ref(false)
const filteredMessages = ref([])
const selectedContactId = ref(null)
const showMessageView = ref(false)

// 获取设备类型
const { isMobile } = useDevice()

// 获取主题配置
const { currentThemeConfig } = useTheme()

// 选中联系人的消息列表
const selectedContactMessages = computed(() => {
  if (!selectedContactId.value) return []
  return filteredMessages.value.filter(msg => msg.address === selectedContactId.value)
})

// 处理联系人选择
function handleContactSelect(contactId) {
  selectedContactId.value = contactId
  
  // 在移动设备上，选择联系人后显示消息视图
  if (isMobile.value) {
    showMessageView.value = true
  }
}

// 返回联系人列表
function backToContacts() {
  showMessageView.value = false
}

// 处理文件上传
async function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  if (!files.length) return

  try {
    isLoading.value = true
    for (const file of files) {
      // 检查文件名是否符合短信文件格式
      if (!file.name.startsWith('sms-')) {
        throw new Error(`文件 ${file.name} 不是有效的短信记录文件`)
      }
      const result = await parseXMLFile(file)
      messages.value = [...messages.value, ...result.messages]
    }
  } catch (error) {
    const event = new CustomEvent('show-error', {
      detail: { message: error.message }
    })
    window.dispatchEvent(event)
  } finally {
    isLoading.value = false
  }
}

// 处理搜索
function handleSearch({ query, date }) {
  if (!query && !date) {
    filteredMessages.value = messages.value
    return
  }

  filteredMessages.value = messages.value.filter(msg => {
    const contentMatch = !query || 
      msg.body.toLowerCase().includes(query.toLowerCase()) ||
      msg.address.includes(query)
    const dateMatch = !date || 
      new Date(msg.date).toLocaleDateString() === new Date(date).toLocaleDateString()
    return contentMatch && dateMatch
  })
}

// 初始化filteredMessages
watchEffect(() => {
  filteredMessages.value = messages.value
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 搜索栏和文件上传区域 -->
    <div class="mb-6 flex flex-col md:flex-row gap-4 items-center">
      <SearchBar @search="handleSearch" class="flex-grow" />
      <div class="flex-shrink-0">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          @change="handleFileUpload"
          accept=".xml"
        >
        <md-filled-tonal-button @click="$refs.fileInput.click()">
          <template #icon>
            <md-icon>upload_file</md-icon>
          </template>
          <span>上传短信文件</span>
        </md-filled-tonal-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <md-circular-progress indeterminate></md-circular-progress>
    </div>

    <!-- 移动设备布局 -->
    <div v-else-if="isMobile" class="h-[calc(100vh-12rem)]">
      <!-- 联系人列表视图 -->
      <div v-if="!showMessageView" class="h-full overflow-y-auto border rounded-lg dark:border-gray-700">
        <ContactList 
          :messages="filteredMessages"
          @select-contact="handleContactSelect" />
      </div>
      
      <!-- 消息对话视图 -->
      <div v-else class="h-full flex flex-col">
        <!-- 返回按钮 -->
        <div class="mb-2 flex items-center">
          <button 
            @click="backToContacts"
            class="flex items-center text-primary"
            :style="{
              borderRadius: currentThemeConfig.borderRadius
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>返回联系人</span>
          </button>
        </div>
        
        <!-- 消息内容 -->
        <div class="flex-1 overflow-y-auto border rounded-lg dark:border-gray-700 p-4">
          <MessageList 
            v-if="selectedContactMessages.length"
            :messages="selectedContactMessages" />
          <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            选择联系人以查看对话
          </div>
        </div>
      </div>
    </div>

    <!-- 桌面设备布局：双栏 -->
    <div v-else class="flex gap-4 h-[calc(100vh-12rem)]">
      <!-- 联系人列表 -->
      <div class="w-1/3 overflow-y-auto border rounded-lg dark:border-gray-700">
        <ContactList 
          :messages="filteredMessages"
          @select-contact="handleContactSelect" />
      </div>
      
      <!-- 消息对话界面 -->
      <div class="flex-1 overflow-y-auto border rounded-lg dark:border-gray-700 p-4">
        <MessageList 
          v-if="selectedContactMessages.length"
          :messages="selectedContactMessages" />
        <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          选择联系人以查看对话
        </div>
      </div>
    </div>
  </div>
</template>