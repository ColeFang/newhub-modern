import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Card,
  CardBody,
  Button,
  Chip,
  Image,
  Divider,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { motion } from 'framer-motion'
import { useFavorites } from '../hooks/useNews'
import { formatTime, copyToClipboard } from '../utils/helpers'
import { ReadHistoryManager } from '../utils/storage'
import { SUCCESS_MESSAGES } from '../utils/constants'
import PageLoading from '../components/common/PageLoading'

// 图标组件
const BackIcon = () => (
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
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
)

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

const ShareIcon = () => (
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
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
)

const ExternalLinkIcon = () => (
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
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
)

const NewsDetailPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareMessage, setShareMessage] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 从路由状态或本地存储获取文章数据
  useEffect(() => {
    const getArticleData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 首先尝试从路由状态获取
        if (location.state?.article) {
          setArticle(location.state.article)
          setLoading(false)
          return
        }

        // 如果没有路由状态，尝试从本地存储或其他方式获取
        // 模拟API调用延迟
        await new Promise((resolve) => setTimeout(resolve, 800))

        // 如果没有找到文章数据，设置错误状态
        if (!location.state?.article) {
          setError('未找到新闻详情数据，请从新闻列表重新进入')
          setLoading(false)
          return
        }
      } catch (err) {
        setError('加载新闻详情时发生错误，请稍后重试')
        setLoading(false)
      }
    }

    getArticleData()
  }, [id, location.state])

  // 设置页面标题
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - NewsHub`
      // 标记为已读
      ReadHistoryManager.markAsRead(article.uniquekey)
    }
  }, [article])

  // 处理返回
  const handleBack = () => {
    navigate(-1)
  }

  // 处理收藏
  const handleFavorite = () => {
    if (article) {
      const message = toggleFavorite(article)
      console.log(message)
    }
  }

  // 处理分享
  const handleShare = async (type) => {
    if (!article) return

    const shareUrl = `${window.location.origin}/news/${article.uniquekey}`
    const shareText = `${article.title} - NewsHub`

    try {
      switch (type) {
        case 'copy':
          await copyToClipboard(shareUrl)
          setShareMessage(SUCCESS_MESSAGES.COPY_SUCCESS)
          break
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: article.title,
              text: shareText,
              url: shareUrl,
            })
            setShareMessage(SUCCESS_MESSAGES.SHARE_SUCCESS)
          }
          break
        case 'external':
          window.open(article.url, '_blank', 'noopener,noreferrer')
          break
        default:
          break
      }
    } catch (error) {
      console.error('分享失败:', error)
    }

    setTimeout(() => setShareMessage(''), 2000)
  }

  // 处理图片切换
  const handleImageChange = (index) => {
    setCurrentImageIndex(index)
  }

  if (loading) {
    return <PageLoading message="正在加载新闻详情..." />
  }

  if (error || !article) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Card className="max-w-md mx-auto nordic-card">
          <CardBody className="p-8">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-lg font-semibold text-nordic-900 dark:text-nordic-100 mb-2">
              无法加载新闻详情
            </h3>
            <p className="text-nordic-600 dark:text-nordic-400 text-sm mb-6">
              {error || '未找到您要查看的新闻内容，请从新闻列表重新进入'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                color="primary"
                variant="bordered"
                onClick={handleBack}
                startContent={<BackIcon />}
                className="nordic-button"
              >
                返回上页
              </Button>
              <Button
                color="primary"
                onClick={() => navigate('/')}
                className="nordic-button"
              >
                回到首页
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    )
  }

  const isArticleFavorite = isFavorite(article.uniquekey)
  const images = article.images || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* 顶部操作栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <Button
          variant="light"
          startContent={<BackIcon />}
          onClick={handleBack}
        >
          返回
        </Button>

        <div className="flex items-center gap-2">
          {/* 收藏按钮 */}
          <Tooltip content={isArticleFavorite ? '取消收藏' : '添加收藏'}>
            <Button
              isIconOnly
              variant="light"
              color={isArticleFavorite ? 'danger' : 'default'}
              onClick={handleFavorite}
            >
              <HeartIcon filled={isArticleFavorite} />
            </Button>
          </Tooltip>

          {/* 分享按钮 */}
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <ShareIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="分享选项">
              <DropdownItem
                key="copy"
                startContent={<ShareIcon />}
                onClick={() => handleShare('copy')}
              >
                复制链接
              </DropdownItem>
              {navigator.share && (
                <DropdownItem
                  key="native"
                  startContent={<ShareIcon />}
                  onClick={() => handleShare('native')}
                >
                  系统分享
                </DropdownItem>
              )}
              <DropdownItem
                key="external"
                startContent={<ExternalLinkIcon />}
                onClick={() => handleShare('external')}
              >
                查看原文
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </motion.div>

      {/* 文章内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardBody className="p-6">
            {/* 文章标题 */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>

            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <Chip size="sm" variant="flat" color="primary">
                {article.category || '未分类'}
              </Chip>

              {article.author_name && <span>作者：{article.author_name}</span>}

              <span>发布时间：{formatTime(article.date)}</span>
            </div>

            <Divider className="mb-6" />

            {/* 文章图片 */}
            {images.length > 0 && (
              <div className="mb-6">
                <Image
                  src={images[currentImageIndex]}
                  alt={article.title}
                  className="w-full max-h-96 object-cover rounded-lg"
                />

                {/* 多图切换 */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`图片 ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer transition-opacity ${
                          index === currentImageIndex
                            ? 'opacity-100 ring-2 ring-primary'
                            : 'opacity-60'
                        }`}
                        onClick={() => handleImageChange(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 文章摘要或内容 */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed">
                由于API限制，这里显示的是新闻标题和基本信息。
                点击&ldquo;查看原文&rdquo;按钮可以访问完整的新闻内容。
              </p>
            </div>

            <Divider className="my-6" />

            {/* 底部操作 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  color="primary"
                  variant="solid"
                  startContent={<ExternalLinkIcon />}
                  onClick={() => handleShare('external')}
                >
                  查看原文
                </Button>

                <Button
                  color={isArticleFavorite ? 'danger' : 'default'}
                  variant="bordered"
                  startContent={<HeartIcon filled={isArticleFavorite} />}
                  onClick={handleFavorite}
                >
                  {isArticleFavorite ? '取消收藏' : '收藏'}
                </Button>
              </div>

              {shareMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-sm text-success"
                >
                  {shareMessage}
                </motion.div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default NewsDetailPage
