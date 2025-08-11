import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3002,
    open: true,
    proxy: {
      '/api/juhe': {
        target: 'http://v.juhe.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/juhe/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // 添加必要的请求头
            proxyReq.setHeader(
              'User-Agent',
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            )
            proxyReq.setHeader('Referer', 'http://v.juhe.cn')
          })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          heroui: ['@heroui/react', '@heroui/theme'],
          utils: ['axios', 'framer-motion'],
        },
      },
    },
  },
})
