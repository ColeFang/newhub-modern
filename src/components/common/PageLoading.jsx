import { Spinner, Card, CardBody } from '@heroui/react'
import { motion } from 'framer-motion'
import NewsHubIcon from '../icons/NewsHubIcon'

/**
 * 页面级加载组件 - Nordic风格
 */
const PageLoading = ({ 
  message = '正在加载...', 
  showIcon = true,
  fullScreen = true 
}) => {
  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const iconVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: { 
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const content = (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center"
    >
      <Card className="nordic-card max-w-sm">
        <CardBody className="p-8 text-center">
          {/* 图标和加载动画 */}
          <div className="relative mb-6">
            {showIcon && (
              <motion.div
                variants={iconVariants}
                initial="initial"
                animate="animate"
                className="mb-4"
              >
                <NewsHubIcon 
                  size={48} 
                  color="currentColor"
                  className="text-frost-500 dark:text-frost-400"
                />
              </motion.div>
            )}
            
            {/* 脉冲效果 */}
            <motion.div
              variants={pulseVariants}
              initial="initial"
              animate="animate"
              className="flex justify-center"
            >
              <Spinner 
                size="lg" 
                color="primary"
                classNames={{
                  circle1: "border-b-frost-500",
                  circle2: "border-b-frost-300",
                }}
              />
            </motion.div>
          </div>

          {/* 加载文本 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-nordic-900 dark:text-nordic-100 mb-2">
              {message}
            </h3>
            <p className="text-sm text-nordic-600 dark:text-nordic-400">
              请稍候片刻...
            </p>
          </motion.div>

          {/* 加载进度指示器 */}
          <motion.div
            className="mt-6 flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-frost-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nordic-50 dark:bg-nordic-900 p-4">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      {content}
    </div>
  )
}

/**
 * 简化版加载组件 - 用于小区域
 */
export const InlineLoading = ({ message = '加载中...', size = 'md' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-3 py-8"
    >
      <Spinner 
        size={size} 
        color="primary"
        classNames={{
          circle1: "border-b-frost-500",
          circle2: "border-b-frost-300",
        }}
      />
      <span className="text-nordic-600 dark:text-nordic-400 text-sm">
        {message}
      </span>
    </motion.div>
  )
}

/**
 * 骨架屏加载组件
 */
export const SkeletonLoading = ({ lines = 3, showAvatar = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-nordic-200 dark:bg-nordic-700 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-nordic-200 dark:bg-nordic-700 rounded animate-pulse w-1/4" />
            <div className="h-3 bg-nordic-200 dark:bg-nordic-700 rounded animate-pulse w-1/6" />
          </div>
        </div>
      )}
      
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-nordic-200 dark:bg-nordic-700 rounded animate-pulse`}
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </motion.div>
  )
}

export default PageLoading
