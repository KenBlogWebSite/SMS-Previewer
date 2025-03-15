<script setup>
import { ref, watchEffect, computed } from 'vue'
import MessageList from '../components/MessageList.vue'
import ContactList from '../components/ContactList.vue'
import SearchBar from '../components/SearchBar.vue'
import { parseXMLFile, analyzeMessageStats } from '../utils/xmlParser'
import { useDevice } from '../composables/useDevice'
import { useTheme } from '../composables/useTheme'

// 状态管理
const messages = ref([])
const isLoading = ref(false)
const filteredMessages = ref([])
const selectedContactId = ref(null)
const showMessageView = ref(false)
const showStats = ref(false)
const messageStats = ref(null)
const processingStats = ref(false)

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
    
    // 重置文件输入框，允许重新上传相同文件
    event.target.value = null
    
    for (const file of files) {
      try {
        // 文件类型验证已经移到解析器内部，这里只检查文件名前缀
        // 这样可以兼容不同命名格式的备份文件
        if (file.name.endsWith('.xml')) {
          const result = await parseXMLFile(file)
          
          if (result && result.messages && result.messages.length > 0) {
            // 添加新消息并去重
            const newMessages = result.messages.filter(newMsg => 
              !messages.value.some(existingMsg => 
                existingMsg.date.getTime() === newMsg.date.getTime() && 
                existingMsg.address === newMsg.address && 
                existingMsg.body === newMsg.body
              )
            )
            
            if (newMessages.length > 0) {
              messages.value = [...messages.value, ...newMessages]
              
              // 显示成功提示
              const successEvent = new CustomEvent('show-success', {
                detail: { 
                  message: `成功导入 ${newMessages.length} 条短信记录` 
                }
              })
              window.dispatchEvent(successEvent)
              
              // 重置统计数据，等待重新计算
              messageStats.value = null
            } else {
              // 如果没有新消息，显示提示
              const infoEvent = new CustomEvent('show-info', {
                detail: { 
                  message: '没有发现新的短信记录' 
                }
              })
              window.dispatchEvent(infoEvent)
            }
          }
        } else {
          throw new Error(`文件 ${file.name} 不是有效的XML文件，请上传.xml格式文件`)
        }
      } catch (fileError) {
        // 单个文件处理错误，但继续处理其他文件
        const errorEvent = new CustomEvent('show-error', {
          detail: { message: fileError.message }
        })
        window.dispatchEvent(errorEvent)
      }
    }
  } catch (error) {
    // 整体处理错误
    const event = new CustomEvent('show-error', {
      detail: { message: error.message || '文件上传处理失败' }
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

// 生成短信统计数据
async function generateStats() {
  if (messages.value.length === 0) {
    const infoEvent = new CustomEvent('show-info', {
      detail: { message: '没有短信数据可供分析' }
    })
    window.dispatchEvent(infoEvent)
    return
  }
  
  try {
    processingStats.value = true
    
    // 使用 Web Worker 或 requestIdleCallback 进行异步处理
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        messageStats.value = analyzeMessageStats(messages.value)
        processingStats.value = false
        showStats.value = true
      })
    } else {
      // 回退方案：使用 setTimeout 避免阻塞 UI
      setTimeout(() => {
        messageStats.value = analyzeMessageStats(messages.value)
        processingStats.value = false
        showStats.value = true
      }, 0)
    }
  } catch (error) {
    processingStats.value = false
    const errorEvent = new CustomEvent('show-error', {
      detail: { message: '生成统计数据失败: ' + error.message }
    })
    window.dispatchEvent(errorEvent)
  }
}

// 关闭统计面板
function closeStats() {
  showStats.value = false
}

// 格式化日期
function formatDate(date) {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 计算天数跨度
function calculateDaysSpan() {
  if (!messageStats.value || !messageStats.value.earliestDate || !messageStats.value.latestDate) return 0
  const earliestDate = new Date(messageStats.value.earliestDate)
  const latestDate = new Date(messageStats.value.latestDate)
  const daysSpan = Math.round((latestDate - earliestDate) / (1000 * 60 * 60 * 24))
  return daysSpan
}

// 计算每日平均短信数量
function calculateAveragePerDay() {
  if (!messageStats.value || !messageStats.value.totalCount || !messageStats.value.earliestDate || !messageStats.value.latestDate) return 0
  
  const earliestDate = new Date(messageStats.value.earliestDate)
  const latestDate = new Date(messageStats.value.latestDate)
  const daysSpan = Math.max(1, Math.round((latestDate - earliestDate) / (1000 * 60 * 60 * 24)))
  
  const averagePerDay = messageStats.value.totalCount / daysSpan
  return Math.round(averagePerDay * 100) / 100
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
      <div class="flex gap-2">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          @change="handleFileUpload"
          accept=".xml"
        >
        <button @click="$refs.fileInput.click()" class="px-3 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-700">
          <span>上传短信文件</span>
        </button>
        <button @click="generateStats" :disabled="messages.length === 0 || processingStats" class="px-3 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-700">
          <span>统计分析</span>
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
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
          <button @click="backToContacts" class="px-3 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-700">
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
    
    <!-- 统计分析对话框 -->
    <div v-if="showStats" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold">短信统计分析</h2>
          <button @click="closeStats" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <span class="text-xl">&times;</span>
          </button>
        </div>
        
        <div v-if="processingStats" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span class="ml-4">正在分析数据...</span>
        </div>
        
        <div v-else-if="messageStats" class="p-4">
          <!-- 基本统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="stats-card bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-2">基本信息</h3>
              <ul class="space-y-2">
                <li>总短信数量: <strong>{{ messageStats.totalCount || 0 }}</strong></li>
                <li>发送短信: <strong>{{ messageStats.sentCount || 0 }}</strong></li>
                <li>接收短信: <strong>{{ messageStats.receivedCount || 0 }}</strong></li>
                <li>平均长度: <strong>{{ Math.round(messageStats.averageLength || 0) }}</strong> 字符</li>
              </ul>
            </div>
            
            <div class="stats-card bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-2">时间跨度</h3>
              <ul class="space-y-2">
                <li>开始日期: <strong>{{ messageStats.earliestDate ? formatDate(messageStats.earliestDate) : '无数据' }}</strong></li>
                <li>结束日期: <strong>{{ messageStats.latestDate ? formatDate(messageStats.latestDate) : '无数据' }}</strong></li>
                <li>总天数: <strong>{{ calculateDaysSpan() }}</strong> 天</li>
                <li>每日平均: <strong>{{ calculateAveragePerDay() }}</strong> 条</li>
              </ul>
            </div>
            
            <div class="stats-card bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-2">联系人</h3>
              <ul class="space-y-2">
                <li>联系人数量: <strong>{{ messageStats.contactCount || 0 }}</strong></li>
                <li>最活跃联系人: <strong>{{ messageStats.byContact && messageStats.byContact[0] ? messageStats.byContact[0].name : '无数据' }}</strong></li>
                <li>与TA的消息数: <strong>{{ messageStats.byContact && messageStats.byContact[0] ? messageStats.byContact[0].count : 0 }}</strong></li>
              </ul>
            </div>
          </div>
          
          <!-- 频繁联系人列表 -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow mb-6">
            <div class="p-4">
              <h3 class="text-lg font-medium mb-4">最常联系的人</h3>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="text-left p-2">联系人</th>
                      <th class="text-right p-2">总消息数</th>
                      <th class="text-right p-2">发送</th>
                      <th class="text-right p-2">接收</th>
                      <th class="text-right p-2">最后联系</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="contact in messageStats.byContact ? messageStats.byContact.slice(0, 5) : []" :key="contact.name">
                      <td class="p-2">{{ contact.name }}</td>
                      <td class="text-right p-2">{{ contact.count }}</td>
                      <td class="text-right p-2">{{ contact.sent }}</td>
                      <td class="text-right p-2">{{ contact.received }}</td>
                      <td class="text-right p-2">{{ contact.lastDate ? formatDate(contact.lastDate) : '无数据' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 flex justify-end">
          <button @click="closeStats" class="px-3 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-700">
            <span>关闭</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  transition: transform 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-2px);
}

/* 移动设备优化 */
@media (max-width: 640px) {
  .stats-card {
    margin-bottom: 1rem;
  }
  
  table {
    font-size: 0.85rem;
  }
}
</style>