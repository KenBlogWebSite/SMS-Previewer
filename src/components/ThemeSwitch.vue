<template>
  <div class="fixed bottom-4 right-4 z-50">
    <mdui-fab @click="isOpen = !isOpen" variant="primary">
      <mdui-icon name="palette"></mdui-icon>
    </mdui-fab>

    <mdui-menu
      v-if="isOpen"
      open
      @close="isOpen = false"
      class="absolute bottom-16 right-0"
      style="min-width: 200px"
    >
      <mdui-list>
        <mdui-list-item 
          v-for="(label, theme) in themes" 
          :key="theme"
          @click="selectTheme(theme)"
          :selected="currentTheme === theme"
        >
          <mdui-list-item-icon>
            <mdui-icon name="palette"></mdui-icon>
          </mdui-list-item-icon>
          <mdui-list-item-content>
            <span class="text-sm">{{ label }}</span>
          </mdui-list-item-content>
          <mdui-list-item-icon v-if="currentTheme === theme">
            <mdui-icon name="check"></mdui-icon>
          </mdui-list-item-icon>
        </mdui-list-item>
      </mdui-list>
    </mdui-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from '../composables/useTheme';

const isOpen = ref(false);
const { themes, currentTheme, currentThemeConfig, setTheme } = useTheme();

function selectTheme(theme) {
  setTheme(theme);
  isOpen.value = false;
}
</script>

<style scoped>
/* 确保主题切换菜单中的文本正确显示 */
.text-sm {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>