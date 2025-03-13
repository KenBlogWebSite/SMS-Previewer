<script setup>
import { computed } from 'vue'
import { formatCallType, formatDuration } from '../utils/callParser'
import { formatDateTime } from '../utils/xmlParser'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  calls: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 获取主题配置
const { currentThemeConfig } = useTheme()

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
  <div class="space-y-6">
    <!-- 按日期分组显示通话记录 -->
    <div v-for="[date, calls] in groupedCalls" :key="date" class="space-y-3">
      <!-- 日期分隔线 -->
      <md-divider>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ date }}</span>
      </md-divider>

      <!-- 当天的通话记录列表 -->
      <div class="space-y-3">
        <div 
          v-for="call in calls" 
          :key="call.date.getTime()" 
          class="w-full p-4 rounded-lg"
          :style="{
            backgroundColor: 'var(--mdui-color-surface)',
            boxShadow: 'var(--mdui-elevation-level1)'
          }"
        >
          <div class="flex items-center justify-between">
            <!-- 联系人信息 -->
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                   :style="{
                     backgroundColor: call.type === 1 ? 'var(--mdui-color-error-container)' :
                                    call.type === 2 ? 'var(--mdui-color-primary-container)' :
                                    'var(--mdui-color-tertiary-container)'
                   }">
                <span class="text-lg font-medium"
                      :style="{
                        color: call.type === 1 ? 'var(--mdui-color-on-error-container)' :
                               call.type === 2 ? 'var(--mdui-color-on-primary-container)' :
                               'var(--mdui-color-on-tertiary-container)'
                      }">
                  {{ call.contactName === '(Unknown)' ? call.number[0].toUpperCase() : call.contactName[0].toUpperCase() }}
                </span>
              </div>
              <div>
                <h3 class="text-lg font-medium md-title">
                  {{ call.contactName === '(Unknown)' ? call.number : call.contactName }}
                </h3>
                <p class="text-sm md-body-small" style="color: var(--mdui-color-on-surface-variant)">
                  {{ formatDateTime(call.date) }}
                </p>
              </div>
            </div>

            <!-- 通话信息 -->
            <div class="text-right">
              <div class="flex items-center space-x-2">
                <span :style="{
                  color: call.type === 1 ? 'var(--mdui-color-error)' :
                         call.type === 2 ? 'var(--mdui-color-primary)' :
                         call.type === 3 ? 'var(--mdui-color-tertiary)' :
                         'var(--mdui-color-on-surface-variant)'
                }" class="text-sm font-medium">
                  {{ formatCallType(call.type) }}
                </span>
                <span class="text-sm" style="color: var(--mdui-color-on-surface-variant)">
                  {{ formatDuration(call.duration) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据提示 -->
    <div v-if="props.calls.length === 0" class="flex flex-col items-center justify-center py-12">
      <md-icon style="font-size: 48px; color: var(--mdui-color-outline);">phone_missed</md-icon>
      <p class="mt-4 text-center" style="color: var(--mdui-color-on-surface-variant);">
        暂无通话记录，请上传通话记录文件
      </p>
    </div>
  </div>
</template>