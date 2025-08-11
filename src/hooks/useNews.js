import { useState, useCallback } from 'react'
import { useApp } from '../contexts/AppContext'
import newsApiService from '../services/newsApi'
import { SearchHistoryManager } from '../utils/storage'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants'

/**
 * 新闻数据管理Hook
 */
export const useNews = () => {
  const { state, actions } = useApp()
  const [refreshing, setRefreshing] = useState(false)

  /**
   * 获取新闻列表
   * @param {string} category - 新闻分类
   * @param {boolean} refresh - 是否刷新
   */
  const fetchNews = useCallback(
    async (category = 'top', refresh = false) => {
      try {
        // 如果不是刷新且已有数据，直接返回
        if (!refresh && state.newsData[category]?.length > 0) {
          return
        }

        actions.setLoading(true)
        actions.clearError()

        const response = await newsApiService.getNewsList({
          type: category,
          page: 1,
          pageSize: 20,
          useCache: !refresh,
        })

        if (response.success) {
          actions.setNewsData(category, response.data)
          actions.resetPagination()
        } else {
          throw new Error(response.message || ERROR_MESSAGES.API_ERROR)
        }
      } catch (error) {
        actions.setError(error.message)
      } finally {
        actions.setLoading(false)
      }
    },
    [state.newsData, actions]
  )

  /**
   * 加载更多新闻
   * @param {string} category - 新闻分类
   */
  const loadMoreNews = useCallback(
    async (category = 'top') => {
      try {
        if (state.loading || !state.pagination.hasMore) {
          return
        }

        actions.setLoading(true)
        const nextPage = state.pagination.page + 1

        const response = await newsApiService.getNewsList({
          type: category,
          page: nextPage,
          pageSize: 20,
          useCache: false,
        })

        if (response.success && response.data.length > 0) {
          actions.appendNewsData(category, response.data)
          actions.setPagination({
            page: nextPage,
            hasMore: response.data.length === 20, // 如果返回数据少于20条，说明没有更多了
          })
        } else {
          actions.setPagination({ hasMore: false })
        }
      } catch (error) {
        actions.setError(ERROR_MESSAGES.LOAD_MORE_ERROR)
      } finally {
        actions.setLoading(false)
      }
    },
    [state.loading, state.pagination, actions]
  )

  /**
   * 刷新新闻
   * @param {string} category - 新闻分类
   */
  const refreshNews = useCallback(
    async (category = 'top') => {
      setRefreshing(true)
      try {
        // 清除缓存
        newsApiService.clearCache(category)
        await fetchNews(category, true)
      } finally {
        setRefreshing(false)
      }
    },
    [fetchNews]
  )

  /**
   * 切换新闻分类
   * @param {string} category - 新闻分类
   */
  const switchCategory = useCallback(
    async (category) => {
      if (category === state.currentCategory) {
        return
      }

      actions.setCurrentCategory(category)
      actions.resetPagination()
      await fetchNews(category)
    },
    [state.currentCategory, actions, fetchNews]
  )

  return {
    // 状态
    newsData: state.newsData,
    currentCategory: state.currentCategory,
    loading: state.loading,
    error: state.error,
    refreshing,
    pagination: state.pagination,

    // 方法
    fetchNews,
    loadMoreNews,
    refreshNews,
    switchCategory,
    clearError: actions.clearError,
  }
}

/**
 * 搜索功能Hook
 */
export const useSearch = () => {
  const { state, actions } = useApp()

  /**
   * 搜索新闻
   * @param {string} keyword - 搜索关键词
   * @param {string} category - 搜索分类
   */
  const searchNews = useCallback(
    async (keyword, category = 'top') => {
      if (!keyword.trim()) {
        return
      }

      try {
        actions.setSearchLoading(true)
        actions.setSearchKeyword(keyword)

        const response = await newsApiService.searchNews({
          keyword: keyword.trim(),
          type: category,
          page: 1,
          pageSize: 50,
        })

        if (response.success) {
          actions.setSearchResults(response.data)

          // 保存搜索历史
          SearchHistoryManager.add(keyword.trim())
        } else {
          throw new Error(response.message || ERROR_MESSAGES.SEARCH_ERROR)
        }
      } catch (error) {
        actions.setError(error.message)
        actions.setSearchResults([])
      } finally {
        actions.setSearchLoading(false)
      }
    },
    [actions]
  )

  /**
   * 清除搜索结果
   */
  const clearSearch = useCallback(() => {
    actions.clearSearch()
  }, [actions])

  /**
   * 获取搜索历史
   */
  const getSearchHistory = () => {
    return SearchHistoryManager.getAll()
  }

  /**
   * 删除搜索历史项
   * @param {string} keyword - 要删除的关键词
   */
  const removeSearchHistory = (keyword) => {
    SearchHistoryManager.remove(keyword)
  }

  /**
   * 清空搜索历史
   */
  const clearSearchHistory = () => {
    SearchHistoryManager.clear()
  }

  return {
    // 状态
    searchKeyword: state.searchKeyword,
    searchResults: state.searchResults,
    searchLoading: state.searchLoading,

    // 方法
    searchNews,
    clearSearch,
    getSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  }
}

/**
 * 收藏功能Hook
 */
export const useFavorites = () => {
  const { state, actions } = useApp()

  /**
   * 添加收藏
   * @param {Object} article - 文章对象
   */
  const addFavorite = useCallback(
    (article) => {
      const isAlreadyFavorite = state.favorites.some(
        (item) => item.uniquekey === article.uniquekey
      )

      if (!isAlreadyFavorite) {
        actions.addFavorite({
          ...article,
          favoriteTime: new Date().toISOString(),
        })
        return SUCCESS_MESSAGES.FAVORITE_ADDED
      }

      return '已经在收藏列表中'
    },
    [state.favorites, actions]
  )

  /**
   * 移除收藏
   * @param {string} uniquekey - 文章唯一标识
   */
  const removeFavorite = useCallback(
    (uniquekey) => {
      actions.removeFavorite(uniquekey)
      return SUCCESS_MESSAGES.FAVORITE_REMOVED
    },
    [actions]
  )

  /**
   * 切换收藏状态
   * @param {Object} article - 文章对象
   */
  const toggleFavorite = useCallback(
    (article) => {
      const isFavorite = state.favorites.some(
        (item) => item.uniquekey === article.uniquekey
      )

      if (isFavorite) {
        return removeFavorite(article.uniquekey)
      } else {
        return addFavorite(article)
      }
    },
    [state.favorites, addFavorite, removeFavorite]
  )

  /**
   * 检查是否已收藏
   * @param {string} uniquekey - 文章唯一标识
   */
  const isFavorite = useCallback(
    (uniquekey) => {
      return state.favorites.some((item) => item.uniquekey === uniquekey)
    },
    [state.favorites]
  )

  return {
    // 状态
    favorites: state.favorites,
    favoritesCount: state.favorites.length,

    // 方法
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}
