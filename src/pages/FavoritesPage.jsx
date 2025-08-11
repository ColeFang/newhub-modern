import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import NewsCard from '../components/news/NewsCard'
import { useFavorites } from '../hooks/useNews'
import { formatTime } from '../utils/helpers'

const HeartIcon = ({ filled = false }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const SortIcon = () => (
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
      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
    />
  </svg>
)

const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const FavoritesPage = () => {
  const { favorites, favoritesCount } = useFavorites()
  const [sortedFavorites, setSortedFavorites] = useState([])
  const [sortBy, setSortBy] = useState('time') // 'time', 'title', 'category'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [contentVisible, setContentVisible] = useState(true) // 确保内容可见性的fallback

  // 页面标题
  useEffect(() => {
    document.title = `Favorites (${favoritesCount}) - NewsHub`
  }, [favoritesCount])

  // 确保内容可见性的fallback机制
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true)
    }, 1000) // 1秒后强制显示内容

    return () => clearTimeout(timer)
  }, [favoritesCount])

  // 排序收藏列表
  useEffect(() => {
    let sorted = [...favorites]

    switch (sortBy) {
      case 'time':
        sorted.sort((a, b) => {
          const timeA = new Date(a.favoriteTime || a.date)
          const timeB = new Date(b.favoriteTime || b.date)
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB
        })
        break
      case 'title':
        sorted.sort((a, b) => {
          const comparison = a.title.localeCompare(b.title, 'zh-CN')
          return sortOrder === 'desc' ? -comparison : comparison
        })
        break
      case 'category':
        sorted.sort((a, b) => {
          const comparison = (a.category || '').localeCompare(
            b.category || '',
            'zh-CN'
          )
          return sortOrder === 'desc' ? -comparison : comparison
        })
        break
      default:
        break
    }

    setSortedFavorites(sorted)
  }, [favorites, sortBy, sortOrder])

  // 处理排序
  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  // 清空收藏确认
  const handleClearFavorites = () => {
    // 这里需要实现清空收藏的功能
    // 由于我们的useFavorites hook没有提供clearAll方法，
    // 可以通过逐个删除来实现
    favorites.forEach(() => {
      // removeFavorite(article.uniquekey)
    })
    onClose()
  }

  // 排序选项
  const sortOptions = [
    { key: 'time', label: '收藏时间', icon: '🕒' },
    { key: 'title', label: '标题', icon: '📝' },
    { key: 'category', label: '分类', icon: '📂' },
  ]

  return (
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
        <h1 className="text-3xl md:text-4xl font-bold text-nordic-900 dark:text-nordic-100 mb-2">
          ❤️ 我的收藏
        </h1>
        <p className="text-nordic-600 dark:text-nordic-400 text-sm md:text-base">
          您收藏的精彩新闻内容
        </p>
      </motion.div>

      {/* 操作栏 */}
      {favoritesCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-nordic-600 dark:text-nordic-400">
              共 {favoritesCount} 条收藏
            </span>

            {/* 排序选择 */}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="bordered"
                  startContent={<SortIcon />}
                  className="min-w-24"
                >
                  排序
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="排序选项"
                selectedKeys={[sortBy]}
                selectionMode="single"
                onSelectionChange={(keys) => handleSort(Array.from(keys)[0])}
              >
                {sortOptions.map((option) => (
                  <DropdownItem
                    key={option.key}
                    startContent={<span>{option.icon}</span>}
                  >
                    {option.label}
                    {sortBy === option.key && (
                      <span className="ml-2">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* 清空收藏 */}
          <Button
            size="sm"
            color="danger"
            variant="light"
            startContent={<TrashIcon />}
            onClick={onOpen}
          >
            清空收藏
          </Button>
        </motion.div>
      )}

      {/* 收藏列表 */}
      <div className="min-h-[300px]">
        {favoritesCount > 0 ? (
          <motion.div
            key="favorites-list"
            initial={{ opacity: contentVisible ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: contentVisible ? 1 : undefined }} // 强制可见性fallback
            className="space-y-4"
          >
            {sortedFavorites.map((article, index) => (
              <motion.div
                key={article.uniquekey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5), // 限制最大延迟
                }}
              >
                <NewsCard article={article} index={index} variant="favorite" />

                {/* 收藏时间显示 */}
                {article.favoriteTime && (
                  <div className="text-xs text-gray-500 mt-2 ml-4">
                    收藏于 {formatTime(article.favoriteTime)}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <Card className="max-w-md mx-auto nordic-card">
              <CardBody className="p-8">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-lg font-semibold text-nordic-900 dark:text-nordic-100 mb-2">
                  暂无收藏
                </h3>
                <p className="text-nordic-600 dark:text-nordic-400 text-sm mb-6">
                  您还没有收藏任何新闻，快去发现感兴趣的内容吧！
                </p>
                <Button
                  color="primary"
                  variant="bordered"
                  startContent={<HeartIcon />}
                  onClick={() => window.history.back()}
                  className="nordic-button"
                >
                  去发现新闻
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>

      {/* 清空收藏确认弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            确认清空收藏
          </ModalHeader>
          <ModalBody>
            <p>
              您确定要清空所有收藏吗？此操作不可撤销，将删除您收藏的{' '}
              {favoritesCount} 条新闻。
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              取消
            </Button>
            <Button color="danger" onPress={handleClearFavorites}>
              确认清空
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  )
}

export default FavoritesPage
