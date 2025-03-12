<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')
const searchDate = ref('')
const realTimeSearch = ref(false)
const searchTimeout = ref(null)

const emit = defineEmits(['search'])

function handleSearch() {
  // 将搜索查询拆分为手机号和内容搜索
  const searchParams = {
    query: searchQuery.value,
    date: searchDate.value,
    phoneNumber: searchQuery.value.match(/\d+/)?.[0] || ''  // 提取查询中的数字作为手机号搜索
  }
  emit('search', searchParams)
}

function debounceSearch() {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    handleSearch()
  }, 300)
}

watch([searchQuery, searchDate], () => {
  if (realTimeSearch.value) {
    debounceSearch()
  }
})

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索消息内容或手机号..."
          @keydown="handleKeyDown"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex-1">
        <input
          v-model="searchDate"
          type="date"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex gap-4">
        <label class="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            v-model="realTimeSearch"
            class="mr-2 rounded border-gray-300 dark:border-gray-600"
          />
          实时搜索
        </label>
        <button
          @click="handleSearch"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          搜索
        </button>
      </div>
    </div>
  </div>
</template>