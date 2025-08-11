import axios from 'axios'
import { API_CONFIG, ERROR_MESSAGES } from '../utils/constants'

/**
 * HTTP客户端配置
 */
const httpClient = axios.create({
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 */
httpClient.interceptors.request.use(
  (config) => {
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    console.log('API Request:', config.url, config.params)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
httpClient.interceptors.response.use(
  (response) => {
    // JSONPlaceholder 直接返回数据，不需要特殊处理
    // 检查是否是聚合数据API的响应格式（向后兼容）
    if (response.data && response.data.error_code !== undefined) {
      if (response.data.error_code === 0) {
        return response.data
      } else {
        // API返回错误
        const error = new Error(
          response.data.reason || ERROR_MESSAGES.API_ERROR
        )
        error.code = response.data.error_code
        throw error
      }
    }

    // JSONPlaceholder 或其他标准REST API
    return response.data
  },
  (error) => {
    let errorMessage = ERROR_MESSAGES.NETWORK_ERROR

    if (error.response) {
      // 服务器响应错误
      const status = error.response.status
      switch (status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = 'API密钥无效'
          break
        case 403:
          errorMessage = '访问被拒绝'
          break
        case 404:
          errorMessage = '接口不存在'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后重试'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = `服务器错误 (${status})`
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR
    } else if (error.code === 'ECONNABORTED') {
      // 超时错误
      errorMessage = '请求超时，请检查网络连接'
    }

    const customError = new Error(errorMessage)
    customError.originalError = error
    customError.code = error.response?.status || 'NETWORK_ERROR'

    return Promise.reject(customError)
  }
)

/**
 * 重试机制
 * @param {Function} requestFn - 请求函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delay - 重试延迟
 * @returns {Promise} 请求结果
 */
export const withRetry = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error

      // 如果是最后一次重试或者是不可重试的错误，直接抛出
      if (i === maxRetries || error.code === 401 || error.code === 403) {
        throw error
      }

      // 等待后重试
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      )
    }
  }

  throw lastError
}

/**
 * 缓存管理器
 */
class CacheManager {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5分钟缓存
  }

  /**
   * 生成缓存键
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @returns {string} 缓存键
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {})

    return `${url}?${JSON.stringify(sortedParams)}`
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any} 缓存数据
   */
  get(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('Cache hit:', key)
      return cached.data
    }

    // 清除过期缓存
    if (cached) {
      this.cache.delete(key)
    }

    return null
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} data - 缓存数据
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })

    console.log('Cache set:', key)
  }

  /**
   * 清除缓存
   * @param {string} key - 缓存键（可选）
   */
  clear(key) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  /**
   * 清除过期缓存
   */
  clearExpired() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.cacheTimeout) {
        this.cache.delete(key)
      }
    }
  }
}

// 创建缓存管理器实例
export const cacheManager = new CacheManager()

// 定期清理过期缓存
setInterval(() => {
  cacheManager.clearExpired()
}, 60000) // 每分钟清理一次

export default httpClient
