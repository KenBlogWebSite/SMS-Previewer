import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export function useServerMode() {
  const route = useRoute()
  const isConnected = ref(false)
  const connectionError = ref(null)

  // 判断当前是否为服务器模式
  const isServerMode = computed(() => route.path.startsWith('/server'))

  // 连接服务器
  const connect = async () => {
    try {
      // TODO: 实现服务器连接逻辑
      isConnected.value = true
      connectionError.value = null
    } catch (error) {
      isConnected.value = false
      connectionError.value = error.message
      // 触发错误提示
      window.dispatchEvent(new CustomEvent('show-error', {
        detail: {
          message: '无法连接到服务器，请检查网络连接'
        }
      }))
    }
  }

  // 断开连接
  const disconnect = () => {
    isConnected.value = false
    connectionError.value = null
  }

  return {
    isServerMode,
    isConnected,
    connectionError,
    connect,
    disconnect
  }
}