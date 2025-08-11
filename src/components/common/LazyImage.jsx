import { useState, useRef, useEffect } from 'react'
import { Image, Skeleton } from '@heroui/react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useResponsive'

const LazyImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = null,
  placeholder = null,
  threshold = 0.1,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef(null)

  // 使用 Intersection Observer 检测图片是否进入视口
  const { isIntersecting } = useIntersectionObserver(imageRef, {
    threshold,
    rootMargin: '50px',
  })

  // 当图片进入视口时开始加载
  useEffect(() => {
    if (isIntersecting && src && !imageSrc && !imageError) {
      setImageSrc(src)
    }
  }, [isIntersecting, src, imageSrc, imageError])

  // 处理图片加载成功
  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // 处理图片加载失败
  const handleImageError = () => {
    setImageError(true)
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
      setImageError(false)
    }
  }

  // 重试加载
  const handleRetry = () => {
    setImageError(false)
    setImageLoaded(false)
    setImageSrc(src)
  }

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      {/* 占位符或骨架屏 */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0">
          {placeholder || (
            <Skeleton className="w-full h-full">
              <div className="w-full h-full bg-default-300 rounded-lg"></div>
            </Skeleton>
          )}
        </div>
      )}

      {/* 实际图片 */}
      {imageSrc && !imageError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
          style={{
            opacity: imageLoaded ? 1 : 0,
            minHeight: '100px', // 确保有最小高度，避免布局跳动
          }}
        >
          <Image
            src={imageSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            {...props}
          />
        </motion.div>
      )}

      {/* 错误状态 */}
      {imageError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs text-center mb-2">图片加载失败</span>
          {src && (
            <button
              onClick={handleRetry}
              className="text-xs text-primary hover:text-primary-600 underline"
            >
              重试
            </button>
          )}
        </motion.div>
      )}

      {/* 加载指示器 */}
      {imageSrc && !imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default LazyImage
