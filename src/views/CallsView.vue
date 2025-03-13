<script setup>
import { ref, watchEffect } from 'vue'
import CallList from '../components/CallList.vue'
import SearchBar from '../components/SearchBar.vue'
import { parseCallXMLFile } from '../utils/callParser'
import { useTheme } from '../composables/useTheme'

// 状态管理
const calls = ref([])
const isLoading = ref(false)
const filteredCalls = ref([])

// 获取主题配置
const { currentThemeConfig } = useTheme()

// 处理文件上传
async function handleFileUpload(event) {
  const files = Array.from(event.target.files)
  if (!files.length) return

  try {
    isLoading.value = true
    for (const file of files) {
      // 检查文件名是否符合通话记录文件格式
      if (!file.name.startsWith('calls-')) {
        throw new Error(`文件 ${file.name} 不是有效的通话记录文件`)
      }
      const result = await parseCallXMLFile(file)
      calls.value = [...calls.value, ...result.calls]
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
    filteredCalls.value = calls.value
    return
  }

  filteredCalls.value = calls.value.filter(call => {
    const numberMatch = !query || call.number.includes(query)
    const dateMatch = !date || 
      new Date(call.date).toLocaleDateString() === new Date(date).toLocaleDateString()
    return numberMatch && dateMatch
  })
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
      <div class="flex-shrink-0">
        <md-filled-button>
          <label class="flex items-center cursor-pointer">
            <md-icon>upload_file</md-icon>
            <span class="ml-2">上传通话记录文件</span>
            <input type="file" class="hidden" multiple @change="handleFileUpload" accept=".xml">
          </label>
        </md-filled-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <md-circular-progress indeterminate></md-circular-progress>
    </div>

    <!-- 通话记录列表 -->
    <CallList :calls="filteredCalls" v-else />
  </div>
</template>