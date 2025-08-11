import { useState, useEffect } from 'react'
import { Input, Button, Card, CardBody, Chip, Divider } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import NewsCard from '../components/news/NewsCard'
import { useSearch } from '../hooks/useNews'

import { SearchSkeleton } from '../components/common/Loading'
import { debounce } from '../utils/helpers'

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const HistoryIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const SearchPage = () => {
  const {
    searchKeyword,
    searchResults,
    searchLoading,
    searchNews,
    clearSearch,
    getSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
  } = useSearch()

  const [inputValue, setInputValue] = useState(searchKeyword || '')
  const [searchHistory, setSearchHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  // 防抖搜索
  const debouncedSearch = debounce((keyword) => {
    if (keyword.trim()) {
      searchNews(keyword.trim())
    }
  }, 500)

  // 加载搜索历史
  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  // 页面标题
  useEffect(() => {
    document.title = 'Search - NewsHub'
  }, [])

  // 同步搜索关键词到输入框
  useEffect(() => {
    setInputValue(searchKeyword || '')
  }, [searchKeyword])



  // 处理搜索输入
  const handleInputChange = (value) => {
    setInputValue(value)
    if (value.trim()) {
      debouncedSearch(value)
      setShowHistory(false)
    } else {
      clearSearch()
      setShowHistory(true)
    }
  }

  // 处理搜索提交
  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      searchNews(inputValue.trim())
      setShowHistory(false)
    }
  }

  // 处理历史记录点击
  const handleHistoryClick = (keyword) => {
    setInputValue(keyword)
    searchNews(keyword)
    setShowHistory(false)
  }

  // 删除历史记录项
  const handleRemoveHistory = (keyword) => {
    removeSearchHistory(keyword)
    setSearchHistory(getSearchHistory())
  }

  // 清空历史记录
  const handleClearHistory = () => {
    clearSearchHistory()
    setSearchHistory([])
  }

  // 处理输入框焦点
  const handleInputFocus = () => {
    if (!inputValue.trim() && searchHistory.length > 0) {
      setShowHistory(true)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      {/* 页面标题 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
          🔍 搜索新闻
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          输入关键词，快速找到您感兴趣的新闻内容
        </p>

      {/* 搜索框 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <form onSubmit={handleSearch}>
          <Input
            size="lg"
            placeholder="搜索新闻标题、作者..."
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            startContent={<SearchIcon />}
            endContent={
              inputValue && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => {
                    setInputValue('')
                    clearSearch()
                    setShowHistory(true)
                  }}
                >
                  <CloseIcon />
                </Button>
              )
            }
            classNames={{
              base: 'max-w-full',
              mainWrapper: 'h-full',
              input: 'text-base',
              inputWrapper:
                'h-12 font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
          />
        </form>
      </motion.div>

      {/* 搜索历史 */}
      <AnimatePresence>
        {showHistory && searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <Card className="nordic-card">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HistoryIcon />
                    <span className="text-sm font-medium">搜索历史</span>
                  </div>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={handleClearHistory}
                  >
                    清空
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((keyword, index) => (
                    <Chip
                      key={index}
                      variant="flat"
                      color="default"
                      className="cursor-pointer hover:bg-default-200"
                      onClick={() => handleHistoryClick(keyword)}
                      onClose={() => handleRemoveHistory(keyword)}
                    >
                      {keyword}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜索结果 */}
      <div className="min-h-[200px]">
        {searchLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <SearchSkeleton />
          </motion.div>
        ) : searchKeyword ? (
          <motion.div
            key="results"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 搜索统计 */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-nordic-600 dark:text-nordic-400">
                搜索 &ldquo;{searchKeyword}&rdquo; 找到 {searchResults.length}{' '}
                条结果
              </div>
              <Button
                size="sm"
                variant="light"
                onClick={clearSearch}
                startContent={<CloseIcon />}
              >
                清除搜索
              </Button>
            </div>

            <Divider className="mb-6" />

            {/* 搜索结果列表 */}
            {searchResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                {searchResults.map((article, index) => (
                  <NewsCard
                    key={article.uniquekey}
                    article={article}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center py-12"
              >
                <Card className="max-w-md mx-auto nordic-card">
                  <CardBody className="p-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-nordic-900 dark:text-nordic-100 mb-2">
                      未找到相关新闻
                    </h3>
                    <p className="text-nordic-600 dark:text-nordic-400 text-sm">
                      尝试使用其他关键词搜索
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </div>

      {/* 空状态 */}
      {!searchKeyword && !showHistory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Card className="max-w-md mx-auto">
            <CardBody className="p-8">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                开始搜索
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                输入关键词搜索您感兴趣的新闻内容
              </p>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
    </div>
  )
}

export default SearchPage
