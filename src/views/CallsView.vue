<script setup>
import { ref, watchEffect } from 'vue'
import CallList from '../components/CallList.vue'
import SearchBar from '../components/SearchBar.vue'
import { parseCallXMLFile } from '../utils/callParser'

// 状态管理
const calls = ref([])
const isLoading = ref(false)
const filteredCalls = ref([])

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
        <label class="flex items-center px-4 py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 transition-colors duration-200">
          <svg class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <span class="text-sm text-gray-500 dark:text-gray-400">上传通话记录文件</span>
          <input type="file" class="hidden" multiple @change="handleFileUpload" accept=".xml">
        </label>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- 通话记录列表 -->
    <CallList :calls="filteredCalls" v-else />
  </div>
</template>