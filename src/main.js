import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 导入Material Web组件
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/button/text-button.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/checkbox/checkbox.js'
import '@material/web/icon/icon.js'
import '@material/web/textfield/outlined-text-field.js'
import '@material/web/textfield/filled-text-field.js'
import '@material/web/divider/divider.js'
import '@material/web/fab/fab.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/menu/menu.js'
import '@material/web/ripple/ripple.js'
import '@material/web/tabs/tabs.js'
import '@material/web/tabs/primary-tab.js'
import '@material/web/progress/circular-progress.js'
import '@material/web/switch/switch.js'

// 导入Material Web排版样式
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js'

// 导入MDUI组件
import 'mdui'
import 'mdui/mdui.css'

// 导入MDUI主题配置
import { useMDUITheme } from './composables/useMDUITheme'

// 添加Material Web的全局样式
document.adoptedStyleSheets.push(typescaleStyles.styleSheet)

// 初始化MDUI主题
useMDUITheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
