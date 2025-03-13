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
    group.messages.sort((a, b) => b.date - a.date)
    group.lastMessage = group.messages[0]
  })
  
  // 按最新消息时间排序
  return Object.values(groups).sort((a, b) => b.lastMessage.date - a.lastMessage.date)
})
</script>

<template>
  <md-list class="md-typescale-body-medium">
    <md-list-item
      v-for="contact in contactGroups"
      :key="contact.id"
      @click="selectedContactId = contact.id; emit('select-contact', contact.id)"
      :selected="selectedContactId === contact.id"
      class="contact-item"
    >
      <!-- 联系人头像 -->
      <div slot="start" class="avatar">
        <span class="avatar-text">{{ contact.name[0].toUpperCase() }}</span>
      </div>

      <!-- 联系人信息 -->
      <div class="contact-info">
        <div class="contact-header">
          <span class="md-typescale-title-medium">{{ contact.name }}</span>
          <span class="md-typescale-label-medium time-text">{{ formatDateTime(contact.lastMessage.date) }}</span>
        </div>
        <div class="contact-body">
          <span class="message-text">{{ contact.lastMessage.body }}</span>
          <md-badge v-if="contact.unreadCount > 0">{{ contact.unreadCount }}</md-badge>
        </div>
      </div>
    </md-list-item>
  </md-list>
</template>

<style scoped>
.contact-item {
  --md-list-item-list-item-container-color: var(--md-sys-color-surface);
  --md-list-item-list-item-container-shape: 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.contact-item[selected] {
  --md-list-item-list-item-container-color: var(--md-sys-color-secondary-container);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: var(--md-sys-color-secondary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.avatar-text {
  color: var(--md-sys-color-on-secondary-container);
  font-weight: 500;
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

.time-text {
  color: var(--md-sys-color-outline);
}

.contact-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-text {
  color: var(--md-sys-color-on-surface-variant);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}
</style>