# 📰 NewsHub Modern - Next-Generation News Platform

A cutting-edge news aggregation platform built with React 18, HeroUI, and Vite. Features a modern, responsive design with Nordic-inspired aesthetics, delivering exceptional user experience across all devices.

## ✨ 特性

### 🎨 现代化设计

- **HeroUI 组件库**：使用最新的 HeroUI 组件，提供一致的设计语言
- **响应式布局**：完美适配桌面端、平板端和移动端
- **暗黑模式**：支持明亮/暗黑主题切换，带有平滑过渡动画
- **丰富动画**：使用 Framer Motion 实现流畅的页面过渡和交互动画

### 📱 移动端优化

- **下拉刷新**：移动端支持下拉刷新功能
- **底部导航**：移动端专用的底部导航栏
- **触摸优化**：针对触摸设备优化的交互体验
- **PWA 就绪**：支持添加到主屏幕

### 🔍 功能丰富

- **模拟新闻数据**：使用 JSONPlaceholder API 提供测试数据，避免 API 限制
- **分类浏览**：支持头条、国内、国际、娱乐、体育等多个分类
- **智能搜索**：支持新闻标题、作者和内容搜索，带搜索历史
- **收藏系统**：可收藏感兴趣的新闻，支持排序和管理
- **分享功能**：支持复制链接、系统分享和查看原文
- **无限滚动**：自动加载更多内容，提升浏览体验

### ⚡ 性能优化

- **图片懒加载**：智能加载图片，节省带宽
- **代码分割**：按需加载，减少初始包大小
- **缓存策略**：API 响应缓存，提升加载速度
- **虚拟滚动**：大列表性能优化

## 🛠️ 技术栈

### 前端框架

- **React 18** - 现代化的前端框架
- **Vite** - 快速的构建工具
- **React Router** - 客户端路由

### UI 框架

- **HeroUI** - 基于 Tailwind CSS 的现代组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Framer Motion** - 强大的动画库

### 状态管理

- **React Context** - 全局状态管理
- **Custom Hooks** - 业务逻辑封装

### 工具库

- **Axios** - HTTP 客户端
- **JSONPlaceholder** - 免费的测试 API 服务
- **LocalStorage API** - 本地数据存储

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

### 预览构建

```bash
npm run preview
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 聚合数据API配置
VITE_JUHE_API_KEY=your_api_key_here
VITE_JUHE_BASE_URL=http://v.juhe.cn/toutiao

# 应用配置
VITE_APP_TITLE=NewsHub - HeroUI News App
VITE_APP_DESCRIPTION=现代化NewsHub应用，基于React和HeroUI构建
```

### API 配置

本应用目前使用 JSONPlaceholder 作为测试数据源，无需配置 API 密钥。

如需切换到真实新闻 API（如聚合数据），可以：

1. 注册相应的 API 服务账号
2. 申请新闻 API 访问权限
3. 将 API Key 配置到环境变量中
4. 修改 `src/utils/constants.js` 中的 API 配置

## 🚀 部署

### Vercel 部署

1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成

### 其他平台

项目构建后生成静态文件，可部署到任何静态托管平台：

- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [HeroUI](https://heroui.com/) - 优秀的 React 组件库
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - 免费的测试 API 服务
- [Framer Motion](https://www.framer.com/motion/) - 强大的动画库
- [Picsum Photos](https://picsum.photos/) - 随机图片服务

---

## 📖 使用说明

### 🚀 快速体验

1. **克隆项目**：

   ```bash
   git clone <repository-url>
   cd Javascript-ES6-Webpack-Kankan-News
   ```

2. **安装依赖**：

   ```bash
   npm install --legacy-peer-deps
   ```

3. **启动开发服务器**：

   ```bash
   npm run dev
   ```

4. **访问应用**：
   打开浏览器访问 http://localhost:3002

### 🎯 主要功能演示

- **📱 响应式设计**：尝试在不同设备尺寸下查看应用
- **🌙 主题切换**：点击右上角的主题切换按钮
- **🔍 搜索功能**：在搜索页面输入关键词进行搜索
- **❤️ 收藏功能**：点击新闻卡片上的心形图标收藏文章
- **📤 分享功能**：点击分享按钮体验不同的分享方式
- **📱 移动端体验**：在移动设备上体验下拉刷新和底部导航

### 🔧 开发说明

- **数据源**：当前使用 JSONPlaceholder 提供模拟数据
- **图片**：使用 Picsum Photos 提供随机图片
- **端口**：默认开发端口为 3002
- **构建**：使用 Vite 进行快速构建和热更新

### 🚀 部署说明

项目已配置好 Vercel 部署，推送到 GitHub 后可直接在 Vercel 中一键部署。

### 依赖安装

```bash
npm install
```

### 开发环境启动

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

**~ 如果该项目对您有帮助的话麻烦给个 🌟 噢 ~**
