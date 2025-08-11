import httpClient, { withRetry, cacheManager } from './httpClient'
import {
  API_CONFIG,
  PAGINATION_CONFIG,
  ERROR_MESSAGES,
} from '../utils/constants'

/**
 * 新闻API服务类
 */
class NewsApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.apiKey = API_CONFIG.API_KEY
  }

  /**
   * 获取新闻列表
   * @param {Object} params - 请求参数
   * @param {string} params.type - 新闻类型
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {boolean} params.useCache - 是否使用缓存
   * @returns {Promise<Object>} 新闻数据
   */
  async getNewsList(params = {}) {
    const {
      type = 'top',
      page = PAGINATION_CONFIG.INITIAL_PAGE,
      pageSize = PAGINATION_CONFIG.PAGE_SIZE,
      useCache = true,
    } = params

    // JSONPlaceholder 使用posts端点
    const requestParams = {
      _page: page,
      _limit: pageSize,
    }

    // 检查缓存
    const cacheKey = cacheManager.generateKey(
      `${this.baseUrl}/posts`,
      requestParams
    )
    if (useCache) {
      const cachedData = cacheManager.get(cacheKey)
      if (cachedData) {
        return cachedData
      }
    }

    try {
      const requestFn = () =>
        httpClient.get(`${this.baseUrl}/posts`, {
          params: requestParams,
        })

      const response = await withRetry(requestFn, 2, 1000)

      // 数据处理和验证
      const processedData = this.processJSONPlaceholderData(response, type)

      // 缓存结果
      if (useCache && processedData.success) {
        cacheManager.set(cacheKey, processedData)
      }

      return processedData
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.API_ERROR)
    }
  }

  /**
   * 搜索新闻
   * @param {Object} params - 搜索参数
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.type - 新闻类型
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>} 搜索结果
   */
  async searchNews(params = {}) {
    const {
      keyword,
      type = 'top',
      page = PAGINATION_CONFIG.INITIAL_PAGE,
      pageSize = PAGINATION_CONFIG.PAGE_SIZE,
    } = params

    if (!keyword || !keyword.trim()) {
      throw new Error('搜索关键词不能为空')
    }

    try {
      // 先获取新闻列表，然后在客户端进行过滤
      // 注意：聚合数据的新闻API不直接支持搜索，这里实现客户端搜索
      const newsData = await this.getNewsList({
        type,
        page: 1,
        pageSize: 100,
        useCache: false,
      })

      if (!newsData.success || !newsData.data) {
        return {
          success: false,
          message: ERROR_MESSAGES.SEARCH_ERROR,
          data: [],
          total: 0,
        }
      }

      // 客户端搜索过滤
      const filteredNews = newsData.data.filter(
        (article) =>
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          (article.author_name &&
            article.author_name.toLowerCase().includes(keyword.toLowerCase()))
      )

      // 分页处理
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedNews = filteredNews.slice(startIndex, endIndex)

      return {
        success: true,
        data: paginatedNews,
        total: filteredNews.length,
        page,
        pageSize,
        hasMore: endIndex < filteredNews.length,
        keyword,
      }
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.SEARCH_ERROR)
    }
  }

  /**
   * 获取新闻详情
   * @param {string} uniquekey - 新闻唯一标识
   * @returns {Promise<Object>} 新闻详情
   */
  async getNewsDetail(uniquekey) {
    if (!uniquekey) {
      throw new Error('新闻ID不能为空')
    }

    const requestParams = {
      key: this.apiKey,
      uniquekey,
    }

    // 检查缓存
    const cacheKey = cacheManager.generateKey(
      `${this.baseUrl}/content`,
      requestParams
    )
    const cachedData = cacheManager.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    try {
      const requestFn = () =>
        httpClient.get(`${this.baseUrl}/content`, {
          params: requestParams,
        })

      const response = await withRetry(requestFn, 2, 1000)

      const processedData = {
        success: true,
        data: response.result || null,
      }

      // 缓存结果
      if (processedData.success) {
        cacheManager.set(cacheKey, processedData)
      }

      return processedData
    } catch (error) {
      throw new Error(error.message || '获取新闻详情失败')
    }
  }

  /**
   * 处理JSONPlaceholder数据
   * @param {Array} response - JSONPlaceholder响应数据
   * @param {string} type - 新闻类型
   * @returns {Object} 处理后的数据
   */
  processJSONPlaceholderData(response, type = 'top') {
    try {
      if (!response || !Array.isArray(response)) {
        return {
          success: false,
          message: ERROR_MESSAGES.NO_DATA,
          data: [],
          total: 0,
        }
      }

      // 模拟新闻图片
      const mockImages = [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
        'https://picsum.photos/400/300?random=4',
        'https://picsum.photos/400/300?random=5',
      ]

      // 模拟作者名称
      const mockAuthors = [
        '张三',
        '李四',
        '王五',
        '赵六',
        '钱七',
        '孙八',
        '周九',
        '吴十',
      ]

      // 数据转换和增强
      const processedNews = response.map((post) => {
        const randomImageIndex = Math.floor(Math.random() * mockImages.length)
        const randomAuthorIndex = Math.floor(Math.random() * mockAuthors.length)
        const hasMultiple = Math.random() > 0.7 // 30%概率有多张图片

        const images = hasMultiple
          ? [
              mockImages[randomImageIndex],
              mockImages[(randomImageIndex + 1) % mockImages.length],
            ]
          : [mockImages[randomImageIndex]]

        return {
          uniquekey: `news_${post.id}_${Date.now()}`,
          title: post.title,
          date: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 随机过去7天内的时间
          category: this.getCategoryByType(type),
          author_name: mockAuthors[randomAuthorIndex],
          url: `https://jsonplaceholder.typicode.com/posts/${post.id}`,
          thumbnail_pic_s: images[0],
          thumbnail_pic_s02: images[1] || null,
          thumbnail_pic_s03: images[2] || null,
          images,
          hasMultipleImages: images.length > 1,
          body: post.body,
          userId: post.userId,
          processedAt: new Date().toISOString(),
        }
      })

      return {
        success: true,
        data: processedNews,
        total: processedNews.length,
        stat: '1',
      }
    } catch (error) {
      return {
        success: false,
        message: '数据处理失败',
        data: [],
        total: 0,
      }
    }
  }

  /**
   * 根据类型获取分类名称
   * @param {string} type - 新闻类型
   * @returns {string} 分类名称
   */
  getCategoryByType(type) {
    const categoryMap = {
      top: '头条',
      guonei: '国内',
      guoji: '国际',
      yule: '娱乐',
      tiyu: '体育',
      junshi: '军事',
      keji: '科技',
      caijing: '财经',
      shishang: '时尚',
    }
    return categoryMap[type] || '头条'
  }

  /**
   * 处理新闻数据
   * @param {Object} response - API响应数据
   * @returns {Object} 处理后的数据
   */
  processNewsData(response) {
    try {
      if (!response || !response.result) {
        return {
          success: false,
          message: ERROR_MESSAGES.NO_DATA,
          data: [],
          total: 0,
        }
      }

      const { result } = response
      const newsData = result.data || []

      // 数据清洗和增强
      const processedNews = newsData.map((article) => ({
        ...article,
        // 确保必要字段存在
        uniquekey: article.uniquekey || `news_${Date.now()}_${Math.random()}`,
        title: article.title || '无标题',
        date: article.date || new Date().toISOString(),
        category: article.category || '未分类',
        author_name: article.author_name || '未知作者',
        url: article.url || '#',
        // 处理图片URL
        thumbnail_pic_s: this.processImageUrl(article.thumbnail_pic_s),
        thumbnail_pic_s02: this.processImageUrl(article.thumbnail_pic_s02),
        thumbnail_pic_s03: this.processImageUrl(article.thumbnail_pic_s03),
        // 添加额外字段
        images: this.extractImages(article),
        hasMultipleImages: this.hasMultipleImages(article),
        processedAt: new Date().toISOString(),
      }))

      return {
        success: true,
        data: processedNews,
        total: processedNews.length,
        stat: result.stat,
      }
    } catch (error) {
      return {
        success: false,
        message: '数据处理失败',
        data: [],
        total: 0,
      }
    }
  }

  /**
   * 处理图片URL
   * @param {string} imageUrl - 原始图片URL
   * @returns {string} 处理后的图片URL
   */
  processImageUrl(imageUrl) {
    if (!imageUrl) return null

    // 确保使用HTTPS
    if (imageUrl.startsWith('http://')) {
      return imageUrl.replace('http://', 'https://')
    }

    return imageUrl
  }

  /**
   * 提取文章图片
   * @param {Object} article - 文章对象
   * @returns {Array} 图片URL数组
   */
  extractImages(article) {
    const images = []

    if (article.thumbnail_pic_s)
      images.push(this.processImageUrl(article.thumbnail_pic_s))
    if (article.thumbnail_pic_s02)
      images.push(this.processImageUrl(article.thumbnail_pic_s02))
    if (article.thumbnail_pic_s03)
      images.push(this.processImageUrl(article.thumbnail_pic_s03))

    return images.filter(Boolean)
  }

  /**
   * 检查是否有多张图片
   * @param {Object} article - 文章对象
   * @returns {boolean} 是否有多张图片
   */
  hasMultipleImages(article) {
    return this.extractImages(article).length > 1
  }

  /**
   * 清除缓存
   * @param {string} type - 新闻类型（可选）
   */
  clearCache(type) {
    if (type) {
      // 清除特定类型的缓存
      const pattern = `${this.baseUrl}/index?.*"type":"${type}"`
      cacheManager.clear(pattern)
    } else {
      // 清除所有缓存
      cacheManager.clear()
    }
  }

  /**
   * 获取缓存统计
   * @returns {Object} 缓存统计信息
   */
  getCacheStats() {
    return {
      size: cacheManager.cache.size,
      keys: Array.from(cacheManager.cache.keys()),
    }
  }
}

// 创建并导出服务实例
const newsApiService = new NewsApiService()
export default newsApiService
