<script setup>
import { computed } from 'vue'
import { formatCallType, formatDuration } from '../utils/callParser'
import { formatDateTime } from '../utils/xmlParser'

const props = defineProps({
  calls: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 按日期分组通话记录
const groupedCalls = computed(() => {
  const groups = {}
  props.calls.forEach(call => {
    const date = call.date.toLocaleDateString('zh-CN')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(call)
  })
  return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
})
</script>

<template>
  <div class="space-y-8">
    <!-- 按日期分组显示通话记录 -->
    <div v-for="[date, calls] in groupedCalls" :key="date" class="space-y-4">
      <!-- 日期分隔线 -->
      <div class="flex items-center">
        <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span class="mx-4 text-sm text-gray-500 dark:text-gray-400">{{ date }}</span>
        <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <!-- 当天的通话记录列表 -->
      <div class="space-y-4">
        <div v-for="call in calls" :key="call.date.getTime()" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <!-- 联系人信息 -->
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span class="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {{ call.contactName === '(Unknown)' ? call.number[0].toUpperCase() : call.contactName[0].toUpperCase() }}
                </span>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ call.contactName === '(Unknown)' ? call.number : call.contactName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(call.date) }}
                </p>
              </div>
            </div>

            <!-- 通话信息 -->
            <div class="text-right">
              <div class="flex items-center space-x-2">
                <span :class="[
                  'text-sm font-medium',
                  call.type === 1 ? 'text-red-500' :
                  call.type === 2 ? 'text-blue-500' :
                  call.type === 3 ? 'text-green-500' :
                  'text-gray-500'
                ]">
                  {{ formatCallType(call.type) }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDuration(call.duration) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>