import { useState } from 'react'
import {
  Card,
  CardBody,
  Button,
  Chip,
  Badge,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../hooks/useNews'
import { useResponsive } from '../../hooks/useResponsive'
import { useToast } from '../common/Toast'
import LazyImage from '../common/LazyImage'
import { formatTime, truncateText, copyToClipboard } from '../../utils/helpers'
import { ReadHistoryManager } from '../../utils/storage'
import { SUCCESS_MESSAGES } from '../../utils/constants'

// 图标组件
const HeartIcon = ({ filled = false }) => (
  <svg
    className="w-4 h-4"
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
    className="w-4 h-4"
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
    className="w-4 h-4"
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

const NewsCard = ({ article, index = 0, variant = 'default' }) => {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { isMobile } = useResponsive()
  const { toast } = useToast()
  const [imageError] = useState(false)

  const isArticleFavorite = isFavorite(article.uniquekey)
  const isRead = ReadHistoryManager.isRead(article.uniquekey)

  // 处理点击文章
  const handleArticleClick = () => {
    ReadHistoryManager.markAsRead(article.uniquekey)
    navigate(`/news/${article.uniquekey}`, { state: { article } })
  }

  // 处理收藏
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    const message = toggleFavorite(article)

    if (message === SUCCESS_MESSAGES.FAVORITE_ADDED) {
      toast.success(message, { title: '收藏成功' })
    } else if (message === SUCCESS_MESSAGES.FAVORITE_REMOVED) {
      toast.info(message, { title: '已取消收藏' })
    }
  }

  // 处理分享
  const handleShare = async (type) => {
    const shareUrl = `${window.location.origin}/news/${article.uniquekey}`
    const shareText = `${article.title} - NewsHub`

    try {
      switch (type) {
        case 'copy':
          await copyToClipboard(shareUrl)
          toast.success(SUCCESS_MESSAGES.COPY_SUCCESS, { title: '复制成功' })
          break
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: article.title,
              text: shareText,
              url: shareUrl,
            })
            toast.success(SUCCESS_MESSAGES.SHARE_SUCCESS, { title: '分享成功' })
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
      toast.error('分享失败，请重试', { title: '操作失败' })
    }
  }

  // 获取主图片
  const getMainImage = () => {
    if (imageError) return null
    return article.images?.[0] || article.thumbnail_pic_s
  }

  // 动画变体
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.3), // 限制最大延迟，避免长时间不显示
      },
    },
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full"
    >
      <Card
        className={`
          news-card-hover cursor-pointer w-full
          ${isRead ? 'opacity-75' : ''}
          ${variant === 'featured' ? 'border-2 border-primary/20' : ''}
        `}
        onClick={handleArticleClick}
      >
        <CardBody className="p-4 w-full">
          <div className={`flex gap-4 w-full ${isMobile ? 'flex-col' : ''}`}>
            {/* 图片部分 */}
            {getMainImage() && (
              <div
                className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-24 h-24'}`}
              >
                <LazyImage
                  src={getMainImage()}
                  alt={article.title}
                  className={`rounded-lg ${
                    isMobile ? 'w-full h-48' : 'w-24 h-24'
                  }`}
                />

                {/* 多图标识 */}
                {article.hasMultipleImages && (
                  <Badge
                    content={article.images?.length || 0}
                    color="primary"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📷</span>
                    </div>
                  </Badge>
                )}
              </div>
            )}

            {/* 内容部分 */}
            <div className="flex-1 min-w-0">
              {/* 标题 */}
              <h3
                className={`font-semibold text-foreground mb-2 leading-tight ${
                  isMobile ? 'text-base' : 'text-sm'
                }`}
              >
                {truncateText(article.title, isMobile ? 80 : 60)}
              </h3>

              {/* 元信息 */}
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                <Chip size="sm" variant="flat" color="default">
                  {article.category || '未分类'}
                </Chip>

                {article.author_name && <span>• {article.author_name}</span>}

                <span>• {formatTime(article.date)}</span>

                {isRead && (
                  <Chip size="sm" variant="flat" color="success">
                    已读
                  </Chip>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* 收藏按钮 */}
                  <Tooltip
                    content={isArticleFavorite ? '取消收藏' : '添加收藏'}
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color={isArticleFavorite ? 'danger' : 'default'}
                      onClick={handleFavoriteClick}
                      className="min-w-8 w-8 h-8"
                    >
                      <HeartIcon filled={isArticleFavorite} />
                    </Button>
                  </Tooltip>

                  {/* 分享按钮 */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={(e) => e.stopPropagation()}
                        className="min-w-8 w-8 h-8"
                      >
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
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}

export default NewsCard
