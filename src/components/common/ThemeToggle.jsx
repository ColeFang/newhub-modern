import { Button, Tooltip } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../contexts/AppContext'

const SunIcon = () => (
  <motion.svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    initial={{ rotate: 0, scale: 0 }}
    animate={{ rotate: 0, scale: 1 }}
    exit={{ rotate: 90, scale: 0 }}
    transition={{ duration: 0.2 }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </motion.svg>
)

const MoonIcon = () => (
  <motion.svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    initial={{ rotate: -90, scale: 0 }}
    animate={{ rotate: 0, scale: 1 }}
    exit={{ rotate: 90, scale: 0 }}
    transition={{ duration: 0.2 }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </motion.svg>
)

const ThemeToggle = ({ size = 'md', variant = 'light', className = '' }) => {
  const { state, actions } = useApp()

  const handleThemeToggle = () => {
    actions.toggleTheme()
    
    // 添加页面过渡效果
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  return (
    <Tooltip 
      content={state.theme === 'light' ? '切换到暗黑模式' : '切换到明亮模式'}
      placement="bottom"
    >
      <Button
        isIconOnly
        size={size}
        variant={variant}
        onClick={handleThemeToggle}
        className={`relative overflow-hidden ${className}`}
        aria-label="切换主题"
      >
        <AnimatePresence mode="wait">
          {state.theme === 'light' ? (
            <MoonIcon key="moon" />
          ) : (
            <SunIcon key="sun" />
          )}
        </AnimatePresence>
        
        {/* 背景动画效果 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0"
          animate={{
            opacity: state.theme === 'light' ? 0 : 0.1,
            scale: state.theme === 'light' ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </Tooltip>
  )
}

export default ThemeToggle
