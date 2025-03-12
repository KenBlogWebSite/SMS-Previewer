<script setup>
import { ref } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'export'])

const exportFormat = ref('txt')
const selectedMessages = ref([])

function handleExport() {
  const content = formatMessages(selectedMessages.value)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sms-export-${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  emit('close')
}

function formatMessages(messages) {
  return messages.map(msg => {
    const date = new Date(msg.date).toLocaleString()
    const type = msg.type === 1 ? '收到' : '发送'
    return `[${date}] ${type}: ${msg.body}`
  }).join('\n')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">导出消息</h3>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">导出格式</label>
        <select
          v-model="exportFormat"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="txt">文本文件 (.txt)</option>
          <option value="json">JSON文件 (.json)</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择消息</label>
        <div class="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
          <div
            v-for="msg in messages"
            :key="msg.date"
            class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <input
              type="checkbox"
              v-model="selectedMessages"
              :value="msg"
              class="mr-2"
            />
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ new Date(msg.date).toLocaleString() }}: {{ msg.body }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          取消
        </button>
        <button
          @click="handleExport"
          :disabled="selectedMessages.length === 0"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          导出
        </button>
      </div>
    </div>
  </div>
</template>