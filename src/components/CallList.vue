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
const { currentThemeConfig, isDark } = useTheme()

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

// 通话统计信息
const callStats = computed(() => {
  const stats = {
    totalDuration: 0,
    missedCalls: 0,
    outgoingCalls: 0,
    incomingCalls: 0,
    rejectedCalls: 0
  }

  props.calls.forEach(call => {
    stats.totalDuration += call.duration
    switch (call.type) {
      case 1: // 未接
        stats.missedCalls++
        break
      case 2: // 去电
        stats.outgoingCalls++
        break
      case 3: // 已接
        stats.incomingCalls++
        break
      case 5: // 拒接
        stats.rejectedCalls++
        break
    }
  })

  return stats
})
</script>

<template>
  <div class="space-y-6">
    <!-- 通话统计信息 -->
    <div v-if="props.calls.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="p-4 rounded-lg" :style="{
        backgroundColor: 'var(--mdui-color-surface-container)',
        boxShadow: 'var(--mdui-elevation-level1)'
      }">
        <h4 class="text-sm font-medium mb-2" style="color: var(--mdui-color-on-surface-variant);">总通话时长</h4>
        <p class="text-lg font-semibold" style="color: var(--mdui-color-on-surface);">{{ formatDuration(callStats.totalDuration) }}</p>
      </div>
      <div class="p-4 rounded-lg" :style="{
        backgroundColor: 'var(--mdui-color-surface-container)',
        boxShadow: 'var(--mdui-elevation-level1)'
      }">
        <h4 class="text-sm font-medium mb-2" style="color: var(--mdui-color-on-surface-variant);">已接来电</h4>
        <p class="text-lg font-semibold" style="color: var(--mdui-color-primary);">{{ callStats.incomingCalls }} 次</p>
      </div>
      <div class="p-4 rounded-lg" :style="{
        backgroundColor: 'var(--mdui-color-surface-container)',
        boxShadow: 'var(--mdui-elevation-level1)'
      }">
        <h4 class="text-sm font-medium mb-2" style="color: var(--mdui-color-on-surface-variant);">未接来电</h4>
        <p class="text-lg font-semibold" style="color: var(--mdui-color-error);">{{ callStats.missedCalls }} 次</p>
      </div>
      <div class="p-4 rounded-lg" :style="{
        backgroundColor: 'var(--mdui-color-surface-container)',
        boxShadow: 'var(--mdui-elevation-level1)'
      }">
        <h4 class="text-sm font-medium mb-2" style="color: var(--mdui-color-on-surface-variant);">已拨电话</h4>
        <p class="text-lg font-semibold" style="color: var(--mdui-color-tertiary);">{{ callStats.outgoingCalls }} 次</p>
      </div>
    </div>
    <!-- 按日期分组显示通话记录 -->
    <div v-for="[date, calls] in groupedCalls" :key="date" class="space-y-3">
      <!-- 日期分隔线 -->
      <mdui-divider>
        <span class="text-sm" style="color: var(--mdui-color-on-surface-variant);">{{ date }}</span>
      </mdui-divider>

      <!-- 当天的通话记录列表 -->
      <div class="space-y-3">
        <div 
          v-for="call in calls" 
          :key="call.date.getTime()" 
          class="w-full p-4 rounded-lg transition-shadow duration-300 call-item"
          :style="{
            backgroundColor: 'var(--mdui-color-surface-container)',
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
                <h3 class="text-lg font-medium" style="color: var(--mdui-color-on-surface);">
                  {{ call.contactName === '(Unknown)' ? call.number : call.contactName }}
                </h3>
                <p class="text-sm" style="color: var(--mdui-color-on-surface-variant);">
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
                <span class="text-sm" style="color: var(--mdui-color-on-surface-variant);">
                  {{ formatDuration(call.duration) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通话类型统计图表 -->
    <div v-if="props.calls.length > 0" class="mb-6 p-4 rounded-lg" :style="{
      backgroundColor: 'var(--mdui-color-surface-container)',
      boxShadow: 'var(--mdui-elevation-level1)'
    }">
      <mdui-chart
        type="pie"
        :data="{
          labels: ['已接来电', '未接来电', '已拨电话', '拒接来电'],
          datasets: [{
            data: [callStats.incomingCalls, callStats.missedCalls, callStats.outgoingCalls, callStats.rejectedCalls],
            backgroundColor: [
              'var(--mdui-color-tertiary)',
              'var(--mdui-color-error)',
              'var(--mdui-color-primary)',
              'var(--mdui-color-outline)'
            ]
          }]
        }"
        :options="{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: '通话类型统计'
            }
          }
        }"
      />
    </div>

    <!-- 无数据提示 -->
    <div v-if="props.calls.length === 0" class="flex flex-col items-center justify-center py-12" style="background-color: var(--mdui-color-surface-container-low); border-radius: var(--mdui-shape-corner-large);">
      <mdui-icon style="font-size: 48px; color: var(--mdui-color-outline);">phone_missed</mdui-icon>
      <p class="mt-4 text-center" style="color: var(--mdui-color-on-surface-variant);">
        暂无通话记录，请上传通话记录文件
      </p>
    </div>
  </div>
</template>

<style scoped>
.call-item {
  transition: box-shadow 0.2s ease-in-out;
}

.call-item:hover {
  box-shadow: var(--mdui-elevation-level2);
}
</style>