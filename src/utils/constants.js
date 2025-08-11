// API配置
export const API_CONFIG = {
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  API_KEY: '', // JSONPlaceholder不需要API Key
  TIMEOUT: 10000,
}

// 新闻分类配置
export const NEWS_CATEGORIES = [
  { key: 'top', label: '头条', icon: '🔥' },
  { key: 'guonei', label: '国内', icon: '🏠' },
  { key: 'guoji', label: '国际', icon: '🌍' },
  { key: 'yule', label: '娱乐', icon: '🎭' },
  { key: 'tiyu', label: '体育', icon: '⚽' },
  { key: 'junshi', label: '军事', icon: '🛡️' },
  { key: 'keji', label: '科技', icon: '💻' },
  { key: 'caijing', label: '财经', icon: '💰' },
  { key: 'shishang', label: '时尚', icon: '👗' },
]

// 分页配置
export const PAGINATION_CONFIG = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
}

// 本地存储键名
export const STORAGE_KEYS = {
  FAVORITES: 'news_favorites',
  THEME: 'app_theme',
  SEARCH_HISTORY: 'search_history',
  READ_ARTICLES: 'read_articles',
}

// 响应式断点
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
}

// 动画配置
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_OUT: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  API_ERROR: 'API请求失败，请稍后重试',
  NO_DATA: '暂无数据',
  LOAD_MORE_ERROR: '加载更多失败',
  SEARCH_ERROR: '搜索失败，请重试',
}

// 成功消息
export const SUCCESS_MESSAGES = {
  FAVORITE_ADDED: '已添加到收藏',
  FAVORITE_REMOVED: '已从收藏中移除',
  SHARE_SUCCESS: '分享成功',
  COPY_SUCCESS: '链接已复制到剪贴板',
}
