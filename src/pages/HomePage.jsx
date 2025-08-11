import { useEffect } from 'react'
import { motion } from 'framer-motion'
import CategoryTabs from '../components/news/CategoryTabs'
import NewsList from '../components/news/NewsList'
import PullToRefresh from '../components/common/PullToRefresh'
import { useNews } from '../hooks/useNews'

import { useResponsive } from '../hooks/useResponsive'

const HomePage = () => {
  const { currentCategory, refreshNews, refreshing } = useNews()

  const { isMobile } = useResponsive()

  // 页面标题
  useEffect(() => {
    document.title = 'NewsHub - Modern Media Platform'
  }, [])

  // 处理下拉刷新
  const handleRefresh = () => {
    refreshNews(currentCategory)
  }

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
          NewsHub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          实时更新，精选资讯，让您快速了解世界动态
        </p>
      </motion.div>

      {/* 分类导航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CategoryTabs />
      </motion.div>

      {/* 新闻列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <NewsList category={currentCategory} />
      </motion.div>
    </motion.div>
  )

  // 移动端使用下拉刷新
  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
        {content}
      </PullToRefresh>
    )
  }

  return content
}

export default HomePage
