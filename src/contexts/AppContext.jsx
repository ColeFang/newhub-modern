import { createContext, useContext, useReducer, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import Storage from '../utils/storage'

// 初始状态
const initialState = {
  // 主题设置
  theme: 'light',
  
  // 新闻数据
  currentCategory: 'top',
  newsData: {},
  loading: false,
  error: null,
  
  // 搜索状态
  searchKeyword: '',
  searchResults: [],
  searchLoading: false,
  
  // 收藏状态
  favorites: [],
  
  // UI状态
  sidebarOpen: false,
  showScrollTop: false,
  
  // 分页状态
  pagination: {
    page: 1,
    hasMore: true,
  },
}

// Action类型
export const ActionTypes = {
  // 主题相关
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  
  // 新闻相关
  SET_CURRENT_CATEGORY: 'SET_CURRENT_CATEGORY',
  SET_NEWS_DATA: 'SET_NEWS_DATA',
  APPEND_NEWS_DATA: 'APPEND_NEWS_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // 搜索相关
  SET_SEARCH_KEYWORD: 'SET_SEARCH_KEYWORD',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // 收藏相关
  SET_FAVORITES: 'SET_FAVORITES',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  
  // UI相关
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SHOW_SCROLL_TOP: 'SET_SHOW_SCROLL_TOP',
  
  // 分页相关
  SET_PAGINATION: 'SET_PAGINATION',
  RESET_PAGINATION: 'RESET_PAGINATION',
}

// Reducer函数
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      }
    
    case ActionTypes.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      }
    
    case ActionTypes.SET_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.payload,
        error: null,
      }
    
    case ActionTypes.SET_NEWS_DATA:
      return {
        ...state,
        newsData: {
          ...state.newsData,
          [action.payload.category]: action.payload.data,
        },
        loading: false,
        error: null,
      }
    
    case ActionTypes.APPEND_NEWS_DATA:
      return {
        ...state,
        newsData: {
          ...state.newsData,
          [action.payload.category]: [
            ...(state.newsData[action.payload.category] || []),
            ...action.payload.data,
          ],
        },
        loading: false,
        error: null,
      }
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    
    case ActionTypes.SET_SEARCH_KEYWORD:
      return {
        ...state,
        searchKeyword: action.payload,
      }
    
    case ActionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
        searchLoading: false,
      }
    
    case ActionTypes.SET_SEARCH_LOADING:
      return {
        ...state,
        searchLoading: action.payload,
      }
    
    case ActionTypes.CLEAR_SEARCH:
      return {
        ...state,
        searchKeyword: '',
        searchResults: [],
        searchLoading: false,
      }
    
    case ActionTypes.SET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      }
    
    case ActionTypes.ADD_FAVORITE:
      return {
        ...state,
        favorites: [action.payload, ...state.favorites],
      }
    
    case ActionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(
          item => item.uniquekey !== action.payload
        ),
      }
    
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      }
    
    case ActionTypes.SET_SHOW_SCROLL_TOP:
      return {
        ...state,
        showScrollTop: action.payload,
      }
    
    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      }
    
    case ActionTypes.RESET_PAGINATION:
      return {
        ...state,
        pagination: {
          page: 1,
          hasMore: true,
        },
      }
    
    default:
      return state
  }
}

// 创建Context
const AppContext = createContext()

// Context Provider组件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  // 初始化应用状态
  useEffect(() => {
    // 加载保存的主题
    const savedTheme = Storage.get(STORAGE_KEYS.THEME, 'light')
    dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme })
    
    // 加载收藏列表
    const savedFavorites = Storage.get(STORAGE_KEYS.FAVORITES, [])
    dispatch({ type: ActionTypes.SET_FAVORITES, payload: savedFavorites })
    
    // 监听滚动事件
    const handleScroll = () => {
      const showScrollTop = window.pageYOffset > 300
      dispatch({ type: ActionTypes.SET_SHOW_SCROLL_TOP, payload: showScrollTop })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 保存主题到本地存储
  useEffect(() => {
    Storage.set(STORAGE_KEYS.THEME, state.theme)
    
    // 更新HTML类名以支持暗黑模式
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])
  
  // 保存收藏到本地存储
  useEffect(() => {
    Storage.set(STORAGE_KEYS.FAVORITES, state.favorites)
  }, [state.favorites])
  
  // Action创建函数
  const actions = {
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
    
    setCurrentCategory: (category) => dispatch({ type: ActionTypes.SET_CURRENT_CATEGORY, payload: category }),
    setNewsData: (category, data) => dispatch({ type: ActionTypes.SET_NEWS_DATA, payload: { category, data } }),
    appendNewsData: (category, data) => dispatch({ type: ActionTypes.APPEND_NEWS_DATA, payload: { category, data } }),
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    
    setSearchKeyword: (keyword) => dispatch({ type: ActionTypes.SET_SEARCH_KEYWORD, payload: keyword }),
    setSearchResults: (results) => dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: results }),
    setSearchLoading: (loading) => dispatch({ type: ActionTypes.SET_SEARCH_LOADING, payload: loading }),
    clearSearch: () => dispatch({ type: ActionTypes.CLEAR_SEARCH }),
    
    addFavorite: (article) => dispatch({ type: ActionTypes.ADD_FAVORITE, payload: article }),
    removeFavorite: (uniquekey) => dispatch({ type: ActionTypes.REMOVE_FAVORITE, payload: uniquekey }),
    
    toggleSidebar: () => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR }),
    
    setPagination: (pagination) => dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination }),
    resetPagination: () => dispatch({ type: ActionTypes.RESET_PAGINATION }),
  }
  
  const value = {
    state,
    actions,
  }
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// 自定义Hook
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
