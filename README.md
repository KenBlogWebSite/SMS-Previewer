# 📱 SMS Previewer

> 一个简洁优雅的短信备份预览工具，基于 SMS Backup & Restore 应用导出的备份文件
>
> A clean and elegant SMS backup viewer for SMS Backup & Restore exported files

## 💝 特别感谢 | Special Thanks

本项目的诞生离不开 [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore) 的支持。这款优秀的安卓应用启发了我创建这个项目，为用户提供更好的短信备份浏览体验。

This project wouldn't be possible without [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore). This excellent Android app inspired the creation of this project, aiming to provide users with a better SMS backup browsing experience.

## ✨ 功能特点 | Features

- 🔍 支持预览 SMS Backup & Restore 导出的 XML 文件
  > Preview XML files exported from SMS Backup & Restore
- 👥 智能联系人列表，显示最新消息预览
  > Smart contact list with latest message preview
- 💬 美观的对话气泡界面
  > Beautiful chat bubble interface
- 🔔 支持未读消息计数显示
  > Unread message counter support
- 📱 独立滚动的联系人和消息列表
  > Independent scrolling for contacts and messages
- 📊 短信和通话记录统计分析功能
  > SMS and call history statistics analysis
  - 📈 消息总量、收发比例统计
    > Message volume and send/receive ratio statistics
  - 👤 联系人互动频率分析
    > Contact interaction frequency analysis
  - 📅 时间跨度和日均消息量分析
    > Time span and daily message volume analysis
- 📞 通话记录分析功能
  > Call history analysis features
- 📊 通话时长统计和类型筛选
  > Call duration statistics and type filtering
- 🌙 支持深色模式，自动适应系统主题
  > Dark mode support, automatically adapts to system theme
- 📱 响应式设计，适配移动端和桌面端
  > Responsive design for mobile and desktop
- 🔄 优化的导航体验，轻松切换短信和通话记录
  > Optimized navigation experience for switching between SMS and call records
- 🌓 支持深色/浅色主题
  > Dark/Light theme support
- 🚀 快速且轻量，完全在浏览器端运行
  > Fast and lightweight, runs entirely in the browser
- 🔒 保护隐私，无需上传服务器
  > Privacy protected, no server upload required

## 技术栈 | Tech Stack

- Vue 3 - 渐进式 JavaScript 框架 | Progressive JavaScript Framework
- Vite - 下一代前端构建工具 | Next Generation Frontend Build Tool
- Tailwind CSS - 实用优先的 CSS 框架 | Utility-First CSS Framework

## 安装 | Installation

```bash
# 安装依赖 | Install dependencies
pnpm install

# 启动开发服务器 | Start dev server
pnpm dev

# 构建生产版本 | Build for production
pnpm build
```

## 使用方法 | Usage

1. 使用 SMS Backup & Restore 应用导出短信为 XML 文件
   > Export SMS as XML file using SMS Backup & Restore app
2. 打开 SMS Previewer 网页
   > Open SMS Previewer website
3. 点击上传或拖拽 XML 文件到上传区域
   > Click to upload or drag and drop XML file to the upload area
4. 即可查看短信记录
   > View your SMS records
5. 点击"统计分析"按钮查看消息统计数据
   > Click "Statistics" button to view message statistics

## To 开发者 | For Developers

### XML 文件处理机制 | XML File Processing

本项目采用纯浏览器端处理方案，所有数据操作均在客户端完成，确保用户隐私安全：

1. 文件上传：使用 File API 读取用户选择的 XML 文件
2. 解析过程：
   - 使用 `FileReader` 读取文件内容
   - 通过 `DOMParser` 解析 XML 结构
   - 提取短信数据并转换为应用内部数据结构
3. 数据存储：
   - 所有数据临时存储在内存中（Vue 的响应式状态）
   - 浏览器关闭或刷新页面后数据自动清除
   - 不使用本地存储（LocalStorage/IndexedDB），确保隐私安全
4. 性能优化：
   - 批量处理机制，避免大文件解析时阻塞 UI
   - 使用 Web Worker 进行异步解析
   - 利用 requestIdleCallback 在浏览器空闲时执行计算密集型任务
   - 实现增量加载，优先显示最新消息

### 状态管理与数据流 | State Management & Data Flow

项目采用 Vue 3 的 Composition API 和响应式系统管理状态：

1. 全局状态管理：
   - 使用 `ref` 和 `reactive` 管理消息和联系人数据
   - 通过 `provide/inject` 实现跨组件状态共享
   - 采用 `computed` 属性处理数据过滤和排序

2. 数据流转机制：
   - XML 解析结果 → 全局状态 → 组件级状态
   - 单向数据流，确保状态变更可追踪
   - 组件通过 `props` 和事件通信

### 组件通信架构 | Component Communication

采用多种组件通信方式，确保数据流转清晰：

1. Props Down：
   - 父组件向子组件传递数据和配置
   - 采用单向数据流，避免子组件直接修改 props

2. Events Up：
   - 子组件通过 `emit` 向父组件发送事件
   - 实现用户交互和状态更新的闭环

3. 跨组件通信：
   - 使用 `provide/inject` 共享全局状态
   - 复杂场景采用事件总线机制

### 路由系统设计 | Router System

基于 Vue Router 实现 SPA 路由管理：

1. 路由配置：
   - 采用配置式路由定义
   - 支持路由懒加载优化性能
   - 实现路由守卫控制访问权限

2. 视图组织：
   - 主要视图：短信预览和通话记录
   - 组件复用：共享布局和导航组件
   - 路由参数传递：支持查询参数和动态路由

### 错误处理机制 | Error Handling

采用多层次的错误处理策略：

1. XML 解析错误：
   - 文件格式校验
   - 解析过程异常捕获
   - 友好的错误提示界面

2. 运行时错误：
   - 全局错误边界捕获
   - 组件级错误处理
   - 降级展示机制

3. 用户反馈：
   - Toast 通知系统
   - 错误详情展示
   - 操作引导提示

### 代码结构说明 | Code Structure

项目采用模块化组织，职责划分明确：

- `src/utils/`：工具函数模块
  - `xmlParser.js`: XML 解析核心逻辑
    - `parseXMLFile()`: 主要解析函数
    - `formatMessageType()`: 消息类型格式化
    - `formatDateTime()`: 日期时间格式化
    - `analyzeMessageStats()`: 短信统计分析
  - `callParser.js`: 通话记录解析模块
    - `parseCallHistory()`: 通话记录解析
    - `calculateDuration()`: 通话时长计算
    - `analyzeCallStats()`: 通话记录统计分析

- `src/components/`: Vue 组件
  - `SearchBar.vue`: 搜索组件（支持实时搜索和防抖）
  - `ContactList.vue`: 联系人列表组件
  - `MessageList.vue`: 消息列表组件
  - `CallList.vue`: 通话记录组件
  - `ExportDialog.vue`: 导出对话框组件

- `src/views/`: 页面视图组件
  - `SMSView.vue`: 短信预览主视图
  - `CallsView.vue`: 通话记录视图

- `src/composables/`: 可复用的组合式函数
  - `useTheme.js`: 主题管理
  - `useDevice.js`: 设备类型检测
  - `useToast.js`: Toast 通知系统
  - 封装常用的业务逻辑
  - 提供状态管理能力
  - 实现功能模块复用

### 性能优化策略 | Performance Optimization

为确保应用在处理大型 XML 文件时保持流畅，采用以下优化策略：

1. 数据处理优化：
   - 批量处理：将大型数据集分批次处理，每批 500 条记录
   - 增量渲染：优先处理并显示最新的消息记录
   - 虚拟滚动：长列表采用虚拟滚动技术，减少 DOM 节点数量

2. 异步处理机制：
   - Web Worker：将耗时计算任务放入独立线程
   - requestIdleCallback：利用浏览器空闲时间执行非关键任务
   - 异步组件加载：按需加载非核心组件

3. 渲染性能：
   - 组件懒加载：路由级别的组件懒加载
   - 计算属性缓存：避免重复计算
   - 事件委托：减少事件监听器数量

## 开源协议 | License

本项目采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议（CC BY-NC-SA 4.0）](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 进行许可。

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).
