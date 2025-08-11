import { motion } from 'framer-motion'

/**
 * NewsHub 品牌图标 - 现代简约风格
 */
const NewsHubIcon = ({ 
  size = 32, 
  className = '',
  animated = false,
  color = 'currentColor' 
}) => {
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.05, 
      rotate: [0, -2, 2, 0],
      transition: { 
        duration: 0.3,
        rotate: {
          duration: 0.6,
          ease: "easeInOut"
        }
      }
    }
  }

  const Icon = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 外圆环 - 代表全球化 */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      
      {/* 内部文档层叠效果 */}
      <rect
        x="8"
        y="10"
        width="12"
        height="14"
        rx="2"
        fill={color}
        opacity="0.1"
      />
      
      <rect
        x="9"
        y="9"
        width="12"
        height="14"
        rx="2"
        fill={color}
        opacity="0.15"
      />
      
      <rect
        x="10"
        y="8"
        width="12"
        height="14"
        rx="2"
        fill={color}
        opacity="0.2"
      />
      
      {/* 主文档 */}
      <rect
        x="11"
        y="7"
        width="12"
        height="14"
        rx="2"
        fill={color}
        opacity="0.8"
      />
      
      {/* 文档内容线条 */}
      <line
        x1="13"
        y1="10"
        x2="21"
        y2="10"
        stroke="white"
        strokeWidth="1"
        opacity="0.9"
      />
      
      <line
        x1="13"
        y1="12"
        x2="19"
        y2="12"
        stroke="white"
        strokeWidth="1"
        opacity="0.7"
      />
      
      <line
        x1="13"
        y1="14"
        x2="21"
        y2="14"
        stroke="white"
        strokeWidth="1"
        opacity="0.7"
      />
      
      <line
        x1="13"
        y1="16"
        x2="17"
        y2="16"
        stroke="white"
        strokeWidth="1"
        opacity="0.5"
      />
      
      {/* 现代化装饰点 */}
      <circle
        cx="6"
        cy="6"
        r="1.5"
        fill={color}
        opacity="0.4"
      />
      
      <circle
        cx="26"
        cy="26"
        r="1.5"
        fill={color}
        opacity="0.4"
      />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        variants={iconVariants}
        initial="initial"
        whileHover="hover"
        className="inline-flex items-center justify-center"
      >
        <Icon />
      </motion.div>
    )
  }

  return <Icon />
}

/**
 * 简化版图标 - 用于小尺寸显示
 */
export const NewsHubIconSimple = ({ 
  size = 24, 
  className = '',
  color = 'currentColor' 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="4"
      y="6"
      width="16"
      height="12"
      rx="2"
      fill={color}
      opacity="0.8"
    />
    <line x1="7" y1="9" x2="17" y2="9" stroke="white" strokeWidth="1" />
    <line x1="7" y1="11" x2="14" y2="11" stroke="white" strokeWidth="1" opacity="0.7" />
    <line x1="7" y1="13" x2="17" y2="13" stroke="white" strokeWidth="1" opacity="0.7" />
    <line x1="7" y1="15" x2="12" y2="15" stroke="white" strokeWidth="1" opacity="0.5" />
  </svg>
)

export default NewsHubIcon
