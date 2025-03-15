<script setup>
import { computed } from 'vue'
import { formatMessageType, formatDateTime } from '../utils/xmlParser'
import { useTheme } from '../composables/useTheme'

const { currentThemeConfig, isDark } = useTheme()

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
  
  if (props.messages && props.messages.length > 0) {
    props.messages.forEach(message => {
      if (message && message.date) {
        const date = message.date.toLocaleDateString('zh-CN')
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(message)
      }
    })
  }
  
  return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
})
</script>

<template>
  <div class="message-container">
    <!-- 按日期分组显示消息 -->
    <div v-for="[date, messages] in groupedMessages" :key="date" class="message-group">
      <!-- 日期分隔线 -->
      <div class="date-divider">
        <span class="date-text">{{ date }}</span>
      </div>

      <!-- 当天的消息列表 -->
      <div class="message-list">
        <div v-for="message in messages" :key="message.date.getTime()" 
             class="message-wrapper">
          <!-- 消息气泡 -->
          <div 
            :class="[
              'message-bubble',
              message.type === 2 ? 'sent-message' : 'received-message'
            ]"
          >
            <div class="message-content">
              <!-- 发送者信息 -->
              <div class="message-header">
                <span class="sender-name">
                  {{ message.contactName === '(Unknown)' ? message.address : message.contactName }}
                </span>
                <span class="message-time">
                  {{ formatDateTime(message.date).split(' ')[1] }}
                </span>
              </div>
              <!-- 消息内容 -->
              <p class="message-body">{{ message.body }}</p>
            </div>
          </div>

          <!-- 消息状态 -->
          <div :class="[
            'message-status',
            message.type === 2 ? 'status-right' : 'status-left'
          ]">
            {{ formatMessageType(message.type) }}
            {{ message.read ? '已读' : '未读' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 无消息提示 -->
    <div v-if="!props.messages || props.messages.length === 0" class="empty-message">
      <div class="icon-container">
        <span class="material-icons">sms</span>
      </div>
      <p class="empty-text">
        暂无短信记录，请上传短信记录文件
      </p>
    </div>
  </div>
</template>

<style scoped>
.message-container {
  width: 100%;
  padding: 16px;
}

.message-group {
  margin-bottom: 24px;
}

.date-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  position: relative;
}

.date-divider::before,
.date-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}

.date-text {
  padding: 0 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 消息气泡的样式 */
.message-bubble {
  max-width: 85%;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.message-content {
  padding: 12px 16px;
}

.sent-message {
  align-self: flex-end;
  background-color: var(--md-sys-color-primary-container, #e8def8);
  color: var(--md-sys-color-on-primary-container, #1d192b);
}

.received-message {
  align-self: flex-start;
  background-color: var(--md-sys-color-surface-container, #f3edf7);
  color: var(--md-sys-color-on-surface, #1d1b20);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sender-name {
  font-size: 12px;
  font-weight: 500;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
}

.message-body {
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
}

.message-status {
  font-size: 12px;
  opacity: 0.7;
}

.status-right {
  text-align: right;
}

.status-left {
  text-align: left;
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  background-color: var(--md-sys-color-surface-container-low, #f7f2fa);
  border-radius: 16px;
  margin-top: 24px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.material-icons {
  font-size: 36px;
  color: rgba(0, 0, 0, 0.38);
}

.empty-text {
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .date-divider::before,
  .date-divider::after {
    background-color: rgba(255, 255, 255, 0.12);
  }
  
  .date-text {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .material-icons {
    color: rgba(255, 255, 255, 0.38);
  }
  
  .empty-text {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>