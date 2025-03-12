<script setup>
import { computed } from 'vue'
import { formatMessageType, formatDateTime } from '../utils/xmlParser'

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 按日期分组消息
const groupedMessages = computed(() => {
  const groups = {}
  props.messages.forEach(message => {
    const date = message.date.toLocaleDateString('zh-CN')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
  })
  return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
})
</script>

<template>
  <div class="space-y-8">
    <!-- 按日期分组显示消息 -->
    <div v-for="[date, messages] in groupedMessages" :key="date" class="space-y-4">
      <!-- 日期分隔线 -->
      <div class="flex items-center">
        <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span class="mx-4 text-sm text-gray-500 dark:text-gray-400">{{ date }}</span>
        <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      <!-- 当天的消息列表 -->
      <div class="space-y-4">
        <div v-for="message in messages" :key="message.date.getTime()" 
             class="flex flex-col space-y-1">
          <!-- 消息气泡 -->
          <div :class="[
            'max-w-[80%] rounded-lg p-4',
            message.type === 2 ? 
              'bg-blue-500 text-white ml-auto' : 
              'bg-gray-100 dark:bg-gray-700'
          ]">
            <!-- 发送者信息 -->
            <div class="flex items-center justify-between text-sm mb-1">
              <span :class="{
                'text-gray-600 dark:text-gray-300': message.type !== 2,
                'text-blue-100': message.type === 2
              }">
                {{ message.contactName === '(Unknown)' ? message.address : message.contactName }}
              </span>
              <span :class="{
                'text-gray-500 dark:text-gray-400': message.type !== 2,
                'text-blue-100': message.type === 2
              }" class="text-xs">
                {{ formatDateTime(message.date).split(' ')[1] }}
              </span>
            </div>
            <!-- 消息内容 -->
            <p class="whitespace-pre-wrap break-words">{{ message.body }}</p>
          </div>

          <!-- 消息状态 -->
          <div :class="[
            'text-xs',
            message.type === 2 ? 'text-right' : 'text-left'
          ]">
            <span class="text-gray-500 dark:text-gray-400">
              {{ formatMessageType(message.type) }}
              {{ message.read ? '已读' : '未读' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 消息气泡的阴影效果 */
.max-w-[80%] {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>