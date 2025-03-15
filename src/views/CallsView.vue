<script setup>
import { ref, watchEffect } from 'vue'
import CallList from '../components/CallList.vue'
import SearchBar from '../components/SearchBar.vue'
import { parseCallXMLFile, analyzeCallStats } from '../utils/callParser'
import { useTheme } from '../composables/useTheme'
import { useDevice } from '../composables/useDevice'

// 状态管理
const calls = ref([])
const isLoading = ref(false)
const filteredCalls = ref([])
const showStats = ref(false)
const callStats = ref(null)
const processingStats = ref(false)

// 获取主题配置
const { currentThemeConfig } = useTheme()

// 获取设备类型
const { isMobile } = useDevice()

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
        // 文件类型验证已经移到解析器内部，这里只检查文件扩展名
        // 这样可以兼容不同命名格式的备份文件
        if (file.name.endsWith('.xml')) {
          const result = await parseCallXMLFile(file)
          
          if (result && result.calls && result.calls.length > 0) {
            // 添加新通话记录并去重
            const newCalls = result.calls.filter(newCall => 
              !calls.value.some(existingCall => 
                existingCall.date.getTime() === newCall.date.getTime() && 
                existingCall.number === newCall.number && 
                existingCall.duration === newCall.duration
              )
            )
            
            if (newCalls.length > 0) {
              calls.value = [...calls.value, ...newCalls]
              
              // 显示成功提示
              const successEvent = new CustomEvent('show-success', {
                detail: { 
                  message: `成功导入 ${newCalls.length} 条通话记录` 
                }
              })
              window.dispatchEvent(successEvent)
              
              // 重置统计数据，等待重新计算
              callStats.value = null
            } else {
              // 如果没有新通话记录，显示提示
              const infoEvent = new CustomEvent('show-info', {
                detail: { 
                  message: '没有发现新的通话记录' 
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
    filteredCalls.value = calls.value
    return
  }

  filteredCalls.value = calls.value.filter(call => {
    const numberMatch = !query || 
      (call.number && call.number.includes(query)) || 
      (call.contactName && call.contactName.toLowerCase().includes(query.toLowerCase()))
    const dateMatch = !date || 
      new Date(call.date).toLocaleDateString() === new Date(date).toLocaleDateString()
    return numberMatch && dateMatch
  })
}

// 生成通话记录统计数据
async function generateStats() {
  if (calls.value.length === 0) {
    const infoEvent = new CustomEvent('show-info', {
      detail: { message: '没有通话记录数据可供分析' }
    })
    window.dispatchEvent(infoEvent)
    return
  }
  
  try {
    processingStats.value = true
    
    // 使用 Web Worker 或 requestIdleCallback 进行异步处理
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        callStats.value = analyzeCallStats(calls.value)
        processingStats.value = false
        showStats.value = true
      })
    } else {
      // 回退方案：使用 setTimeout 避免阻塞 UI
      setTimeout(() => {
        callStats.value = analyzeCallStats(calls.value)
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

// 格式化时长
function formatDurationStat(seconds) {
  if (!seconds) return '0秒'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  const parts = []
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}秒`)
  
  return parts.join('')
}

// 初始化filteredCalls
watchEffect(() => {
  filteredCalls.value = calls.value
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
          @change="handleFileUpload"
          accept=".xml"
        >
        <button @click="$refs.fileInput.click()" class="px-3 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-700">
          <span>上传通话记录</span>
        </button>
        <button @click="generateStats" :disabled="calls.length === 0 || processingStats" class="px-3 py-1 rounded-md bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-100 hover:bg-purple-300 dark:hover:bg-purple-700">
          <span>统计分析</span>
        </button>
      </div>
    </div>

    <!-- 加载中提示 -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>

    <!-- 通话记录列表 -->
    <CallList 
      v-else-if="filteredCalls.length > 0" 
      :calls="filteredCalls" 
      :theme="currentThemeConfig"
    />

    <!-- 无数据提示 -->
    <div v-else class="text-center py-12">
      <p class="text-lg mb-4">暂无通话记录数据</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">请上传通话记录备份文件 (.xml)</p>
    </div>
    
    <!-- 统计分析对话框 -->
    <div v-if="showStats" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold">通话记录统计分析</h2>
          <button @click="closeStats" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <span class="text-xl">&times;</span>
          </button>
        </div>
        
        <div v-if="processingStats" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span class="ml-4">正在分析数据...</span>
        </div>
        
        <div v-else-if="callStats" class="p-4">
          <!-- 基本统计信息 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="stats-card bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-2">基本信息</h3>
              <ul class="space-y-2">
                <li>总通话数量: <strong>{{ callStats.totalCount }}</strong></li>
                <li>呼出通话: <strong>{{ callStats.outgoingCount }}</strong></li>
                <li>呼入通话: <strong>{{ callStats.incomingCount }}</strong></li>
                <li>未接来电: <strong>{{ callStats.missedCount }}</strong></li>
                <li>总通话时长: <strong>{{ formatDurationStat(callStats.totalDuration) }}</strong></li>
              </ul>
            </div>
            
            <div class="stats-card bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-2">时间跨度</h3>
              <ul class="space-y-2">
                <li>开始日期: <strong>{{ formatDate(callStats.dateRange.start) }}</strong></li>
                <li>结束日期: <strong>{{ formatDate(callStats.dateRange.end) }}</strong></li>
                <li>总天数: <strong>{{ callStats.daysSpan }}</strong> 天</li>
                <li>每日平均: <strong>{{ Math.round(callStats.averagePerDay * 100) / 100 }}</strong> 通</li>
              </ul>
            </div>
            
            <div class="stats-card bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <h3 class="text-lg font-medium mb-2">联系人</h3>
              <ul class="space-y-2">
                <li>联系人数量: <strong>{{ Object.keys(callStats.contacts).length }}</strong></li>
                <li>最常通话: <strong>{{ callStats.frequentContacts[0]?.name || '无数据' }}</strong></li>
                <li>与TA的通话数: <strong>{{ callStats.frequentContacts[0]?.totalCount || 0 }}</strong></li>
              </ul>
            </div>
          </div>
          
          <!-- 频繁联系人列表 -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow mb-6">
            <div class="p-4">
              <h3 class="text-lg font-medium mb-4">最常通话的联系人</h3>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="text-left p-2">联系人</th>
                      <th class="text-right p-2">总通话数</th>
                      <th class="text-right p-2">呼出</th>
                      <th class="text-right p-2">呼入</th>
                      <th class="text-right p-2">未接</th>
                      <th class="text-right p-2">总时长</th>
                      <th class="text-right p-2">最后通话</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="contact in callStats.frequentContacts.slice(0, 5)" :key="contact.name">
                      <td class="p-2">{{ contact.name }}</td>
                      <td class="text-right p-2">{{ contact.totalCount }}</td>
                      <td class="text-right p-2">{{ contact.outgoingCount }}</td>
                      <td class="text-right p-2">{{ contact.incomingCount }}</td>
                      <td class="text-right p-2">{{ contact.missedCount }}</td>
                      <td class="text-right p-2">{{ formatDurationStat(contact.totalDuration) }}</td>
                      <td class="text-right p-2">{{ formatDate(contact.lastDate) }}</td>
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