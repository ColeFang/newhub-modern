import { useState } from 'react'
import { Card, CardBody, Button, Badge, Tooltip } from '@heroui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { useFavorites } from '../../hooks/useNews'

// 图标组件
const HomeIcon = ({ active = false }) => (
  <svg
    className={`w-6 h-6 ${active ? 'text-primary' : 'text-gray-500'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const SearchIcon = ({ active = false }) => (
  <svg
    className={`w-6 h-6 ${active ? 'text-primary' : 'text-gray-500'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const HeartIcon = ({ active = false }) => (
  <svg
    className={`w-6 h-6 ${active ? 'text-primary' : 'text-gray-500'}`}
    fill={active ? 'currentColor' : 'none'}
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

const MobileLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { favoritesCount } = useFavorites()
  const [showBottomNav] = useState(true)

  // 底部导航项
  const navItems = [
    {
      key: 'home',
      label: '首页',
      path: '/',
      icon: HomeIcon,
    },
    {
      key: 'search',
      label: '搜索',
      path: '/search',
      icon: SearchIcon,
    },
    {
      key: 'favorites',
      label: '收藏',
      path: '/favorites',
      icon: HeartIcon,
      badge: favoritesCount,
    },
  ]

  // 处理导航
  const handleNavigation = (path) => {
    navigate(path)
  }

  // 检查是否为当前路径
  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen flex flex-col bg-nordic-50 dark:bg-nordic-900">
      {/* 主要内容区域 */}
      <main className="flex-1 pb-20 overflow-x-hidden">
        <div className="container mx-auto px-4 py-6 max-w-full">{children}</div>
      </main>

      {/* 底部导航栏 */}
      <AnimatePresence>
        {showBottomNav && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <Card className="rounded-none border-t border-nordic-200 dark:border-nordic-700 glass-effect bg-white/90 dark:bg-nordic-800/90">
              <CardBody className="p-0">
                <div className="flex items-center justify-around py-2">
                  {navItems.map((item) => {
                    const isActive = isActivePath(item.path)
                    const IconComponent = item.icon

                    return (
                      <Tooltip
                        key={item.key}
                        content={item.label}
                        placement="top"
                        delay={500}
                      >
                        <Button
                          isIconOnly
                          variant="light"
                          className={`flex flex-col items-center justify-center h-14 w-16 relative ${
                            isActive ? 'text-primary' : 'text-gray-500'
                          }`}
                          onClick={() => handleNavigation(item.path)}
                        >
                          {/* 图标 */}
                          <div className="relative">
                            <IconComponent active={isActive} />

                            {/* 徽章 */}
                            {item.badge > 0 && (
                              <Badge
                                content={item.badge}
                                color="danger"
                                size="sm"
                                className="absolute -top-2 -right-2"
                              />
                            )}
                          </div>

                          {/* 标签 */}
                          <span
                            className={`text-xs mt-1 ${
                              isActive
                                ? 'text-primary font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {item.label}
                          </span>

                          {/* 活跃指示器 */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}
                        </Button>
                      </Tooltip>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 安全区域占位 */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}

export default MobileLayout
