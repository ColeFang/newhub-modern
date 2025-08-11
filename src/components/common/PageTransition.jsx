import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// 页面过渡动画变体
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
}

// 滑动过渡变体
const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

const slideTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
}

// 淡入淡出变体
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const fadeTransition = {
  duration: 0.2,
}

// 缩放变体
const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.1,
  },
}

const scaleTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

// 动画类型映射
const animationTypes = {
  default: { variants: pageVariants, transition: pageTransition },
  slide: { variants: slideVariants, transition: slideTransition },
  fade: { variants: fadeVariants, transition: fadeTransition },
  scale: { variants: scaleVariants, transition: scaleTransition },
}

/**
 * 页面过渡动画组件
 */
const PageTransition = ({ 
  children, 
  type = 'default',
  className = '',
  custom = 0 
}) => {
  const location = useLocation()
  const animation = animationTypes[type] || animationTypes.default

  return (
    <AnimatePresence mode="wait" custom={custom}>
      <motion.div
        key={location.pathname}
        custom={custom}
        initial="initial"
        animate="in"
        exit="out"
        variants={animation.variants}
        transition={animation.transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * 路由过渡包装器
 */
export const RouteTransition = ({ children, ...props }) => {
  return (
    <PageTransition {...props}>
      {children}
    </PageTransition>
  )
}

/**
 * 内容过渡组件
 */
export const ContentTransition = ({ 
  children, 
  show = true, 
  type = 'fade',
  delay = 0,
  className = '' 
}) => {
  const animation = animationTypes[type] || animationTypes.fade

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={animation.variants}
          transition={{
            ...animation.transition,
            delay,
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 列表项过渡组件
 */
export const ListTransition = ({ 
  children, 
  stagger = 0.1,
  className = '' 
}) => {
  const containerVariants = {
    initial: {},
    in: {
      transition: {
        staggerChildren: stagger,
      },
    },
    out: {
      transition: {
        staggerChildren: stagger,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="in"
      exit="out"
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{ duration: 0.3 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * 悬浮动画组件
 */
export const HoverTransition = ({ 
  children, 
  scale = 1.05,
  y = -2,
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{
        scale,
        y,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * 点击波纹效果
 */
export const RippleEffect = ({ 
  children, 
  className = '',
  color = 'rgba(255, 255, 255, 0.3)' 
}) => {
  return (
    <motion.div
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
      className={`relative overflow-hidden ${className}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{
          scale: 1,
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  )
}

export default PageTransition
