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
  <div class="divide-y divide-gray-200 dark:divide-gray-700">
    <div v-for="contact in contactGroups" 
         :key="contact.id"
         @click="selectedContactId = contact.id; emit('select-contact', contact.id)"
         :class="[
           'flex items-center space-x-4 p-4 cursor-pointer transition-all duration-200 border-l-4',
           selectedContactId === contact.id
             ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
             : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
         ]">
      <!-- 联系人头像 -->
      <div class="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
        <span class="text-lg font-medium text-gray-600 dark:text-gray-300">
          {{ contact.name[0].toUpperCase() }}
        </span>
      </div>
      
      <!-- 联系人信息 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ contact.name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDateTime(contact.lastMessage.date) }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ contact.lastMessage.body }}
          </p>
          <!-- 未读消息计数 -->
          <div v-if="contact.unreadCount > 0" 
               class="flex-shrink-0 ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
            {{ contact.unreadCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>