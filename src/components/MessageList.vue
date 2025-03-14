<script setup>
import { computed } from 'vue'
import { formatMessageType, formatDateTime } from '../utils/xmlParser'
import { useTheme } from '../composables/useTheme'

const { currentThemeConfig } = useTheme()

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
  <div class="space-y-6">
    <!-- 按日期分组显示消息 -->
    <div v-for="[date, messages] in groupedMessages" :key="date" class="space-y-3">
      <!-- 日期分隔线 -->
      <mdui-divider>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ date }}</span>
      </mdui-divider>

      <!-- 当天的消息列表 -->
      <div class="space-y-3">
        <div v-for="message in messages" :key="message.date.getTime()" 
             class="flex flex-col space-y-1">
          <!-- 消息气泡 -->
          <mdui-card 
            :class="[
              'max-w-[85%] sm:max-w-[75%] p-0 overflow-hidden',
              message.type === 2 ? 'ml-auto' : ''
            ]"
            :style="{
              backgroundColor: message.type === 2 ? 'var(--mdui-color-primary)' : 'var(--mdui-color-surface-variant)',
              borderRadius: '16px'
            }"
            variant="outlined"
          >
            <mdui-card-content class="p-4">
              <!-- 发送者信息 -->
              <div class="flex items-center justify-between text-sm mb-1">
                <mdui-text-field-helper-text :style="{
                  color: message.type === 2 ? 'var(--mdui-color-on-primary)' : 'var(--mdui-color-on-surface-variant)'
                }">
                  {{ message.contactName === '(Unknown)' ? message.address : message.contactName }}
                </mdui-text-field-helper-text>
                <mdui-text-field-helper-text :style="{
                  color: message.type === 2 ? 'var(--mdui-color-on-primary)' : 'var(--mdui-color-on-surface-variant)'
                }">
                  {{ formatDateTime(message.date).split(' ')[1] }}
                </mdui-text-field-helper-text>
              </div>
              <!-- 消息内容 -->
              <p class="whitespace-pre-wrap break-words text-sm sm:text-base" :style="{
                color: message.type === 2 ? 'var(--mdui-color-on-primary)' : 'var(--mdui-color-on-surface-variant)'
              }">{{ message.body }}</p>
            </mdui-card-content>
          </mdui-card>

          <!-- 消息状态 -->
          <mdui-text-field-helper-text :class="[
            message.type === 2 ? 'text-right' : 'text-left'
          ]">
            {{ formatMessageType(message.type) }}
            {{ message.read ? '已读' : '未读' }}
          </mdui-text-field-helper-text>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 消息气泡的样式 */
.max-w-\[85\%\] {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;
}

.max-w-\[85\%\]:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.mdui-card-content {
  padding: 12px 16px;
}

/* 优化文本排版 */
.whitespace-pre-wrap {
  line-height: 1.5;
  letter-spacing: 0.2px;
}
</style>