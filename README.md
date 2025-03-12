# 📱 SMS Previewer

> 一个简洁优雅的短信备份预览工具，基于 SMS Backup & Restore 应用导出的备份文件
>
> A clean and elegant SMS backup viewer for SMS Backup & Restore exported files

## ⚠️ 开发状态 | Development Status

本项目目前处于积极开发阶段，版本更新频繁。如果您在使用过程中遇到问题，可以尝试切换到之前的稳定版本。项目文档和教程仍在完善中，感谢您的耐心等待。

This project is currently under active development with frequent version updates. If you encounter any issues, you can try switching to a previous stable version. Project documentation and tutorials are still being improved. Thank you for your patience.

## 📖 基础教程 | Basic Tutorial

### 导出短信备份 | Export SMS Backup

1. 在 Google Play Store 下载并安装 [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore)
2. 打开应用，点击「备份」按钮
3. 在备份选项中，确保「短信」已选中
4. 选择备份位置（建议选择本地存储）
5. 点击「备份」开始导出
6. 备份完成后，将生成的XML文件传输到电脑
7. 使用本工具打开XML文件即可浏览短信记录

## 💝 特别感谢 | Special Thanks

本项目的诞生离不开 [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore) 的支持。这款优秀的安卓应用启发了我创建这个项目，为用户提供更好的短信备份浏览体验。

This project wouldn't be possible without [SMS Backup & Restore](https://play.google.com/store/apps/details?id=com.riteshsahu.SMSBackupRestore). This excellent Android app inspired the creation of this project, aiming to provide users with a better SMS backup browsing experience.

## ✨ 功能特性 | Features

- 📤 支持解析SMS Backup & Restore导出的XML备份文件
- 👥 联系人列表显示，包含最新消息预览
- 💬 清晰的对话界面展示
- 🔔 未读消息计数提醒
- 🌓 深色模式支持

## 🛠️ 技术栈 | Tech Stack

- Vue 3 - 渐进式 JavaScript 框架 | Progressive JavaScript Framework
- Vite - 下一代前端构建工具 | Next Generation Frontend Build Tool
- Tailwind CSS - 实用优先的 CSS 框架 | Utility-First CSS Framework

## 📦 安装与部署 | Installation & Deployment

### 本地开发 | Local Development

```bash
# 安装依赖 | Install dependencies
pnpm install

# 启动开发服务器 | Start dev server
pnpm dev
```

### 生产部署 | Production Deployment

```bash
# 构建生产版本 | Build for production
pnpm build
```

构建完成后，你可以选择以下方式部署：

1. 静态托管：将 `dist` 目录部署到任何静态网站托管服务
2. Docker部署：使用 Nginx 或其他 Web 服务器托管构建产物
3. 本地部署：使用 `pnpm preview` 在本地预览生产构建

## 🤝 参与贡献 | Contributing

我们欢迎任何形式的贡献！如果你发现了bug或有新功能建议，请：

1. 在 [Issues](https://github.com/yourusername/SMS-Previewer/issues) 页面创建新的issue
2. 描述你遇到的问题或建议
3. 如果可能，提供相关的截图或代码示例

## 📝 开源协议 | License

本项目采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议（CC BY-NC-SA 4.0）](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 进行许可。

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).
