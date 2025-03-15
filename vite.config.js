import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // 将所有以 mdui- 开头的标签视为自定义元素
        isCustomElement: tag => tag.startsWith('mdui-')
      }
    }
  })],
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      // 使用包含编译器的Vue版本
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  server: {
    hmr: {
      overlay: false // 禁用错误覆盖层
    }
  }
})
