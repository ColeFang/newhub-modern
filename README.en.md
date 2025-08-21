# 📰 NewsHub Modern

[简体中文](README.md)

NewsHub Modern is a news aggregation platform built with React 18, Vite, and HeroUI. It features a responsive and minimalist design, aiming to provide a consistent user experience across all devices.

## ✨ Features

- **Modern Design**: Built with HeroUI component library, supporting light/dark theme switching with smooth animations.
- **Responsive Layout**: Perfectly adapted for desktop, tablet, and mobile devices.
- **Mobile Optimized**: Supports pull-to-refresh, bottom navigation, and PWA.
- **Rich Functionality**: Offers news category browsing, smart search, favorites, and sharing features.
- **Performance Optimized**: Implemented with lazy image loading, code splitting, and API caching for optimal loading speed.

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router
- **Build Tool**: Vite
- **UI**: HeroUI, Tailwind CSS, Framer Motion
- **State Management**: React Context, Custom Hooks
- **Data Fetching**: Axios

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation

```bash
npm install --legacy-peer-deps
```

### Running in Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## 🔧 Configuration

Create a `.env` file in the project root and configure the following environment variables as needed:

```env
# Juhe API (Optional)
VITE_JUHE_API_KEY=your_api_key_here
VITE_JUHE_BASE_URL=http://v.juhe.cn/toutiao

# Application Info
VITE_APP_TITLE=NewsHub Modern
VITE_APP_DESCRIPTION=A modern news platform built with React and HeroUI.
```

> **Note**: By default, the project uses JSONPlaceholder as a mock data source, which does not require an API Key.

## Deployment

This project is optimized for deployment on Vercel. Simply import the repository into Vercel and configure the environment variables for automated deployment. The build output consists of static files, which can be deployed on any static hosting platform.

## 🤝 Contributing

Contributions are welcome via Issues and Pull Requests.

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
