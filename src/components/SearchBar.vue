<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const searchDate = ref('')

const emit = defineEmits(['search'])

function handleSearch() {
  emit('search', {
    query: searchQuery.value,
    date: searchDate.value
  })
}
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索消息内容..."
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
      <button
        @click="handleSearch"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        搜索
      </button>
    </div>
  </div>
</template>