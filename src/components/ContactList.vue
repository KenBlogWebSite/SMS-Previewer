<script setup>
import { computed, ref } from 'vue'
import { formatDateTime } from '../utils/xmlParser'

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  }
})

const selectedContactId = ref(null)

const emit = defineEmits(['select-contact'])

// 按联系人分组消息并获取最新消息
const contactGroups = computed(() => {
  const groups = {}
  props.messages.forEach(message => {
    const contactId = message.address
    const contactName = message.contactName === '(Unknown)' ? message.address : message.contactName
    
    if (!groups[contactId]) {
      groups[contactId] = {
        id: contactId,
        name: contactName,
        messages: [],
        lastMessage: null,
        unreadCount: 0
      }
    }
    
    groups[contactId].messages.push(message)
    
    // 更新未读消息计数
    if (!message.read && message.type !== 2) {
      groups[contactId].unreadCount++
    }
  })
  
  // 为每个联系人设置最新消息
  Object.values(groups).forEach(group => {
    if (group.messages && group.messages.length > 0) {
      group.messages.sort((a, b) => b.date - a.date)
      group.lastMessage = group.messages[0]
    }
  })
  
  // 按最新消息时间排序，确保lastMessage存在
  return Object.values(groups)
    .filter(group => group.lastMessage) // 过滤掉没有最新消息的联系人
    .sort((a, b) => b.lastMessage.date - a.lastMessage.date)
})
</script>

<template>
  <div class="contact-list">
    <div
      v-for="contact in contactGroups"
      :key="contact.id"
      @click="selectedContactId = contact.id; emit('select-contact', contact.id)"
      :class="['contact-item', { 'selected': selectedContactId === contact.id }]"
    >
      <!-- 联系人头像 -->
      <div class="avatar">
        <span class="avatar-text">{{ contact.name && contact.name.length > 0 ? contact.name[0].toUpperCase() : '?' }}</span>
      </div>

      <!-- 联系人信息 -->
      <div class="contact-info">
        <div class="contact-header">
          <span class="title-medium">{{ contact.name }}</span>
          <span class="label-medium time-text">{{ contact.lastMessage ? formatDateTime(contact.lastMessage.date) : '' }}</span>
        </div>
        <div class="contact-body">
          <span class="message-text">{{ contact.lastMessage ? contact.lastMessage.body : '' }}</span>
          <span v-if="contact.unreadCount > 0" class="badge">{{ contact.unreadCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-list {
  width: 100%;
  overflow-y: auto;
  background-color: var(--md-sys-color-surface, #fff);
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.contact-item.selected {
  background-color: var(--md-sys-color-secondary-container, #e8def8);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--md-sys-color-secondary-container, #e8def8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.avatar-text {
  font-weight: 500;
  color: var(--md-sys-color-on-secondary-container, #1d192b);
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.title-medium {
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  margin-left: 8px;
}

.contact-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.badge {
  background-color: var(--md-sys-color-error, #b3261e);
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .contact-item {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }
  
  .contact-item:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
  
  .time-text, .message-text {
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>