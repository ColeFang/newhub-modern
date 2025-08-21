# 📰 NewsHub Modern

[English](README.en.md)

NewsHub Modern 是一个新闻聚合平台，采用 React 18、Vite 和 HeroUI 构建。它具备响应式和简约设计，支持在不同设备上提供一致的用户体验。

## ✨ 特性

- **现代化设计**：基于 HeroUI 组件库，支持明亮/暗黑主题切换，并带有流畅动画。
- **响应式布局**：完美适配桌面、平板和移动设备。
- **移动端优化**：支持下拉刷新、底部导航和 PWA 功能。
- **功能丰富**：提供新闻分类浏览、智能搜索、收藏和分享等功能。
- **性能优化**：实现图片懒加载、代码分割和 API 缓存，提升加载速度。

## 🛠️ 技术栈

- **前端**: React 18, React Router
- **构建工具**: Vite
- **UI**: HeroUI, Tailwind CSS, Framer Motion
- **状态管理**: React Context, Custom Hooks
- **数据获取**: Axios

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

## 🔧 配置说明

在项目根目录创建 `.env` 文件，并根据需要配置以下环境变量：

```env
# 聚合数据API (可选)
VITE_JUHE_API_KEY=your_api_key_here
VITE_JUHE_BASE_URL=http://v.juhe.cn/toutiao

# 应用信息
VITE_APP_TITLE=NewsHub Modern
VITE_APP_DESCRIPTION=一个基于 React 和 HeroUI 构建的现代化新闻平台。
```

> **注意**：项目默认使用 JSONPlaceholder 作为模拟数据源，无需配置 API 密钥。

## 部署

本项目已针对 Vercel 部署进行优化。只需将仓库导入 Vercel 并配置环境变量，即可实现自动化部署。构建产物为静态文件，可部署到任何静态托管平台。

## 🤝 贡献

欢迎通过 Issue 和 Pull Request 贡献代码。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。
