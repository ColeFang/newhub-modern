import { useEffect, useCallback } from 'react'
import { Button, Card, CardBody } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import NewsCard from './NewsCard'
import { useNews } from '../../hooks/useNews'
import { useInfiniteScroll } from '../../hooks/useResponsive'
import { NewsListSkeleton, InlineLoading } from '../common/Loading'

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const EmptyIcon = () => (
  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
)

const NewsList = ({ category, showRefresh = true }) => {
  const {
    newsData,
    currentCategory,
    loading,
    error,
    refreshing,
    pagination,
    fetchNews,
    loadMoreNews,
    refreshNews,
    clearError,
  } = useNews()

  const targetCategory = category || currentCategory
  const articles = newsData[targetCategory] || []

  // 无限滚动
  const [isFetchingMore] = useInfiniteScroll(
    useCallback(() => {
      if (pagination.hasMore && !loading) {
        loadMoreNews(targetCategory)
      }
    }, [loadMoreNews, targetCategory, pagination.hasMore, loading]),
    pagination.hasMore
  )

  // 初始加载
  useEffect(() => {
    if (articles.length === 0 && !loading && !error) {
      fetchNews(targetCategory)
    }
  }, [targetCategory, articles.length, loading, error, fetchNews])

  // 处理刷新
  const handleRefresh = () => {
    refreshNews(targetCategory)
  }

  // 处理重试
  const handleRetry = () => {
    clearError()
    fetchNews(targetCategory, true)
  }

  // 列表动画变体
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // 错误状态
  if (error && articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Card className="max-w-md mx-auto">
          <CardBody className="p-8">
            <div className="text-6xl mb-4">😵</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              加载失败
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              {error}
            </p>
            <Button
              color="primary"
              variant="solid"
              onClick={handleRetry}
              startContent={<RefreshIcon />}
            >
              重试
            </Button>
          </CardBody>
        </Card>
      </motion.div>
    )
  }

  // 空状态
  if (!loading && articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Card className="max-w-md mx-auto">
          <CardBody className="p-8">
            <EmptyIcon />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-4">
              暂无新闻
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              当前分类下暂时没有新闻内容
            </p>
            {showRefresh && (
              <Button
                color="primary"
                variant="bordered"
                onClick={handleRefresh}
                startContent={<RefreshIcon />}
                isLoading={refreshing}
              >
                刷新试试
              </Button>
            )}
          </CardBody>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      {/* 刷新按钮 */}
      {showRefresh && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {articles.length} 条新闻
          </div>
          <Button
            size="sm"
            variant="light"
            onClick={handleRefresh}
            startContent={<RefreshIcon />}
            isLoading={refreshing}
            className="text-primary"
          >
            刷新
          </Button>
        </motion.div>
      )}

      {/* 新闻列表 */}
      <AnimatePresence mode="wait">
        {loading && articles.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NewsListSkeleton count={5} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {articles.map((article, index) => (
              <NewsCard
                key={article.uniquekey}
                article={article}
                index={index}
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 加载更多指示器 */}
      <AnimatePresence>
        {isFetchingMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <InlineLoading />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 没有更多内容提示 */}
      {!pagination.hasMore && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            已加载全部内容
          </div>
        </motion.div>
      )}

      {/* 错误提示（有数据时的错误） */}
      {error && articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="border-danger-200 bg-danger-50 dark:bg-danger-900/20">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-danger text-sm">⚠️</span>
                  <span className="text-danger text-sm">{error}</span>
                </div>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onClick={clearError}
                >
                  关闭
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default NewsList
