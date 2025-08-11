import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Spinner } from '@heroui/react'

const RefreshIcon = ({ rotation = 0 }) => (
  <motion.svg
    className="w-6 h-6 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    style={{ rotate: rotation }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </motion.svg>
)

const PullToRefresh = ({
  children,
  onRefresh,
  refreshing = false,
  threshold = 80,
  disabled = false,
}) => {
  const [isPulling, setIsPulling] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const containerRef = useRef(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, threshold], [0, 1])
  const scale = useTransform(y, [0, threshold], [0.8, 1])
  const rotationValue = useTransform(y, [0, threshold * 2], [0, 360])
  const translateY = useTransform(y, (value) => value - threshold)

  // 检查是否可以下拉刷新
  const canPull = () => {
    if (disabled || refreshing) return false

    const container = containerRef.current
    if (!container) return false

    return container.scrollTop === 0
  }

  // 处理触摸开始
  const handleTouchStart = (e) => {
    if (!canPull()) return

    startY.current = e.touches[0].clientY
    setIsPulling(true)
  }

  // 处理触摸移动
  const handleTouchMove = (e) => {
    if (!isPulling || !canPull()) return

    currentY.current = e.touches[0].clientY
    const deltaY = currentY.current - startY.current

    if (deltaY > 0) {
      // 阻止默认滚动行为
      e.preventDefault()

      // 应用阻尼效果
      const dampedY = Math.min(deltaY * 0.5, threshold * 1.5)
      y.set(dampedY)

      // 检查是否达到刷新阈值
      setCanRefresh(dampedY >= threshold)
    }
  }

  // 处理触摸结束
  const handleTouchEnd = () => {
    if (!isPulling) return

    setIsPulling(false)

    if (canRefresh && !refreshing) {
      // 触发刷新
      onRefresh?.()
    }

    // 重置状态
    y.set(0)
    setCanRefresh(false)
  }

  // 处理鼠标事件（用于桌面端测试）
  const handleMouseDown = (e) => {
    if (!canPull()) return

    startY.current = e.clientY
    setIsPulling(true)

    const handleMouseMove = (e) => {
      if (!isPulling || !canPull()) return

      currentY.current = e.clientY
      const deltaY = currentY.current - startY.current

      if (deltaY > 0) {
        const dampedY = Math.min(deltaY * 0.5, threshold * 1.5)
        y.set(dampedY)
        setCanRefresh(dampedY >= threshold)
      }
    }

    const handleMouseUp = () => {
      setIsPulling(false)

      if (canRefresh && !refreshing) {
        onRefresh?.()
      }

      y.set(0)
      setCanRefresh(false)

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 当刷新完成时重置状态
  useEffect(() => {
    if (!refreshing) {
      y.set(0)
      setCanRefresh(false)
      setIsPulling(false)
    }
  }, [refreshing, y])

  return (
    <div className="relative overflow-hidden">
      {/* 刷新指示器 */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10"
        style={{
          y: translateY,
          opacity,
          scale,
        }}
      >
        <div className="flex flex-col items-center py-4">
          {refreshing ? (
            <Spinner size="md" color="primary" />
          ) : (
            <RefreshIcon rotation={rotationValue} />
          )}
          <span className="text-sm text-primary mt-2">
            {refreshing ? '刷新中...' : canRefresh ? '松开刷新' : '下拉刷新'}
          </span>
        </div>
      </motion.div>

      {/* 内容容器 */}
      <motion.div
        ref={containerRef}
        className="relative"
        style={{ y }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default PullToRefresh
