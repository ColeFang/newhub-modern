import { useState } from 'react'
import { Button, Tooltip } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'

const FloatingActionButton = ({
  icon,
  label,
  onClick,
  color = 'primary',
  size = 'lg',
  position = 'bottom-right',
  className = '',
  children,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 位置样式映射
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
    'top-center': 'top-6 left-1/2 transform -translate-x-1/2',
  }

  // 动画变体
  const fabVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: {
        duration: 0.2,
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.2,
      }
    },
    tap: { scale: 0.95 }
  }

  const menuVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
      }
    }
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
      transition: {
        duration: 0.1,
      }
    }
  }

  const handleClick = () => {
    if (children) {
      setIsExpanded(!isExpanded)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div className={`fixed z-50 ${positionStyles[position]}`}>
      {/* 子菜单 */}
      <AnimatePresence>
        {isExpanded && children && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {Array.isArray(children) ? children.map((child, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                {child}
              </motion.div>
            )) : (
              <motion.div variants={itemVariants}>
                {children}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主按钮 */}
      <motion.div
        variants={fabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
      >
        <Tooltip content={label} placement="left" isDisabled={!label}>
          <Button
            isIconOnly
            color={color}
            size={size}
            variant="shadow"
            onClick={handleClick}
            className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
            {...props}
          >
            <motion.div
              animate={{
                rotate: isExpanded ? 45 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          </Button>
        </Tooltip>
      </motion.div>

      {/* 背景遮罩 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// 预设的FAB组件
export const ScrollToTopFAB = ({ show = true, ...props }) => {
  const ArrowUpIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!show) return null

  return (
    <FloatingActionButton
      icon={<ArrowUpIcon />}
      label="回到顶部"
      onClick={handleScrollToTop}
      {...props}
    />
  )
}

export const RefreshFAB = ({ onRefresh, loading = false, ...props }) => {
  const RefreshIcon = () => (
    <motion.svg 
      className="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      animate={{ rotate: loading ? 360 : 0 }}
      transition={{ 
        duration: loading ? 1 : 0,
        repeat: loading ? Infinity : 0,
        ease: "linear"
      }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </motion.svg>
  )

  return (
    <FloatingActionButton
      icon={<RefreshIcon />}
      label="刷新"
      onClick={onRefresh}
      disabled={loading}
      {...props}
    />
  )
}

export const ShareFAB = ({ onShare, ...props }) => {
  const ShareIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
  )

  return (
    <FloatingActionButton
      icon={<ShareIcon />}
      label="分享"
      onClick={onShare}
      {...props}
    />
  )
}

export default FloatingActionButton
