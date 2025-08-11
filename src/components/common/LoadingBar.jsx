import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@heroui/react'

/**
 * 顶部加载进度条
 */
const LoadingBar = ({ 
  loading = false, 
  color = 'primary',
  height = 3,
  className = '' 
}) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let interval
    
    if (loading) {
      setIsVisible(true)
      setProgress(0)
      
      // 模拟加载进度
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            return prev + Math.random() * 2
          }
          return prev + Math.random() * 15
        })
      }, 200)
    } else {
      // 完成加载
      setProgress(100)
      setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 300)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [loading])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-0 left-0 right-0 z-50 ${className}`}
          style={{ height: `${height}px` }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 shadow-lg`}
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ 
              duration: 0.3,
              ease: 'easeOut'
            }}
          />
          
          {/* 发光效果 */}
          <motion.div
            className={`absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-${color}-300 to-transparent opacity-60`}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 圆形加载进度条
 */
export const CircularLoadingBar = ({ 
  loading = false,
  progress = 0,
  size = 'md',
  color = 'primary',
  showValue = false,
  className = ''
}) => {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          const target = progress || (prev >= 90 ? prev + 1 : prev + Math.random() * 10)
          return Math.min(target, 100)
        })
      }, 100)

      return () => clearInterval(interval)
    } else {
      setDisplayProgress(0)
    }
  }, [loading, progress])

  if (!loading) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-center justify-center ${className}`}
    >
      <Progress
        size={size}
        value={displayProgress}
        color={color}
        showValueLabel={showValue}
        className="max-w-md"
        classNames={{
          track: "drop-shadow-md border border-default",
          indicator: "bg-gradient-to-r from-primary-500 to-primary-600",
          label: "tracking-wider font-medium text-default-600",
          value: "text-foreground/60",
        }}
      />
    </motion.div>
  )
}

/**
 * 脉冲加载指示器
 */
export const PulseLoader = ({ 
  loading = false,
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  if (!loading) return null

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center space-x-2 ${className}`}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} bg-${color} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

/**
 * 波浪加载指示器
 */
export const WaveLoader = ({ 
  loading = false,
  color = 'primary',
  className = ''
}) => {
  if (!loading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center space-x-1 ${className}`}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-1 h-8 bg-${color} rounded-full`}
          animate={{
            scaleY: [1, 2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </motion.div>
  )
}

/**
 * 旋转加载指示器
 */
export const SpinLoader = ({ 
  loading = false,
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  if (!loading) return null

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center ${className}`}
    >
      <motion.div
        className={`${sizeClasses[size]} border-2 border-${color} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  )
}

export default LoadingBar
