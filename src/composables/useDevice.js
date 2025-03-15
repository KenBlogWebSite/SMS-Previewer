import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 设备类型检测和响应式布局控制
 * 提供设备类型检测和布局模式切换功能
 */
export function useDevice() {
  // 设备类型状态
  const isMobile = ref(false);
  
  // 检测设备类型的函数
  const checkDevice = () => {
    // 使用媒体查询检测移动设备
    // 一般认为屏幕宽度小于768px的为移动设备
    isMobile.value = window.innerWidth < 768;
  };
  
  // 组件挂载时进行设备检测
  onMounted(() => {
    // 初始检测
    checkDevice();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkDevice);
  });
  
  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice);
  });
  
  return {
    isMobile
  };
}