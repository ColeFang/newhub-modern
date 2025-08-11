/**
 * 本地存储工具类
 */
class Storage {
  /**
   * 设置存储项
   * @param {string} key - 键名
   * @param {any} value - 值
   */
  static set(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      // 静默处理存储错误
    }
  }

  /**
   * 获取存储项
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值或默认值
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      return defaultValue
    }
  }

  /**
   * 移除存储项
   * @param {string} key - 键名
   */
  static remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      // 静默处理存储错误
    }
  }

  /**
   * 清空所有存储
   */
  static clear() {
    try {
      localStorage.clear()
    } catch (error) {
      // 静默处理存储错误
    }
  }

  /**
   * 检查键是否存在
   * @param {string} key - 键名
   * @returns {boolean} 是否存在
   */
  static has(key) {
    return localStorage.getItem(key) !== null
  }

  /**
   * 获取所有键名
   * @returns {string[]} 键名数组
   */
  static keys() {
    return Object.keys(localStorage)
  }

  /**
   * 获取存储大小（字节）
   * @returns {number} 存储大小
   */
  static size() {
    let total = 0
    for (let key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }
}

/**
 * 收藏管理器
 */
export class FavoriteManager {
  static KEY = 'news_favorites'

  /**
   * 获取所有收藏
   * @returns {Array} 收藏列表
   */
  static getAll() {
    return Storage.get(this.KEY, [])
  }

  /**
   * 添加收藏
   * @param {Object} article - 文章对象
   */
  static add(article) {
    const favorites = this.getAll()
    const exists = favorites.some(
      (item) => item.uniquekey === article.uniquekey
    )

    if (!exists) {
      favorites.unshift({
        ...article,
        favoriteTime: new Date().toISOString(),
      })
      Storage.set(this.KEY, favorites)
    }
  }

  /**
   * 移除收藏
   * @param {string} uniquekey - 文章唯一标识
   */
  static remove(uniquekey) {
    const favorites = this.getAll()
    const filtered = favorites.filter((item) => item.uniquekey !== uniquekey)
    Storage.set(this.KEY, filtered)
  }

  /**
   * 检查是否已收藏
   * @param {string} uniquekey - 文章唯一标识
   * @returns {boolean} 是否已收藏
   */
  static isFavorite(uniquekey) {
    const favorites = this.getAll()
    return favorites.some((item) => item.uniquekey === uniquekey)
  }

  /**
   * 清空收藏
   */
  static clear() {
    Storage.set(this.KEY, [])
  }

  /**
   * 获取收藏数量
   * @returns {number} 收藏数量
   */
  static count() {
    return this.getAll().length
  }
}

/**
 * 搜索历史管理器
 */
export class SearchHistoryManager {
  static KEY = 'search_history'
  static MAX_HISTORY = 10

  /**
   * 获取搜索历史
   * @returns {Array} 搜索历史列表
   */
  static getAll() {
    return Storage.get(this.KEY, [])
  }

  /**
   * 添加搜索记录
   * @param {string} keyword - 搜索关键词
   */
  static add(keyword) {
    if (!keyword.trim()) return

    let history = this.getAll()

    // 移除已存在的相同关键词
    history = history.filter((item) => item !== keyword)

    // 添加到开头
    history.unshift(keyword)

    // 限制数量
    if (history.length > this.MAX_HISTORY) {
      history = history.slice(0, this.MAX_HISTORY)
    }

    Storage.set(this.KEY, history)
  }

  /**
   * 移除搜索记录
   * @param {string} keyword - 搜索关键词
   */
  static remove(keyword) {
    const history = this.getAll()
    const filtered = history.filter((item) => item !== keyword)
    Storage.set(this.KEY, filtered)
  }

  /**
   * 清空搜索历史
   */
  static clear() {
    Storage.set(this.KEY, [])
  }
}

/**
 * 阅读记录管理器
 */
export class ReadHistoryManager {
  static KEY = 'read_articles'
  static MAX_HISTORY = 100

  /**
   * 标记文章为已读
   * @param {string} uniquekey - 文章唯一标识
   */
  static markAsRead(uniquekey) {
    let readArticles = Storage.get(this.KEY, [])

    if (!readArticles.includes(uniquekey)) {
      readArticles.unshift(uniquekey)

      // 限制数量
      if (readArticles.length > this.MAX_HISTORY) {
        readArticles = readArticles.slice(0, this.MAX_HISTORY)
      }

      Storage.set(this.KEY, readArticles)
    }
  }

  /**
   * 检查文章是否已读
   * @param {string} uniquekey - 文章唯一标识
   * @returns {boolean} 是否已读
   */
  static isRead(uniquekey) {
    const readArticles = Storage.get(this.KEY, [])
    return readArticles.includes(uniquekey)
  }

  /**
   * 清空阅读记录
   */
  static clear() {
    Storage.set(this.KEY, [])
  }
}

export default Storage
