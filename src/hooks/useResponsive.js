import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '../utils/constants'

/**
 * 响应式Hook
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })

  const [deviceType, setDeviceType] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({ width, height })
      
      // 根据宽度判断设备类型
      if (width < BREAKPOINTS.MD) {
        setDeviceType('mobile')
      } else if (width < BREAKPOINTS.LG) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // 初始化
    handleResize()

    // 添加事件监听
    window.addEventListener('resize', handleResize)
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    screenSize,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isSmallScreen: screenSize.width < BREAKPOINTS.MD,
    isMediumScreen: screenSize.width >= BREAKPOINTS.MD && screenSize.width < BREAKPOINTS.LG,
    isLargeScreen: screenSize.width >= BREAKPOINTS.LG,
  }
}

/**
 * 无限滚动Hook
 */
export const useInfiniteScroll = (callback, hasMore = true, threshold = 100) => {
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      
      if (
        scrollHeight - scrollTop <= clientHeight + threshold &&
        hasMore &&
        !isFetching
      ) {
        setIsFetching(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isFetching, threshold])

  useEffect(() => {
    if (!isFetching) return

    const fetchData = async () => {
      try {
        await callback()
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [isFetching, callback])

  return [isFetching, setIsFetching]
}

/**
 * 滚动位置Hook
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollPosition
}

/**
 * 元素可见性Hook
 */
export const useIntersectionObserver = (
  elementRef,
  { threshold = 0, root = null, rootMargin = '0%' } = {}
) => {
  const [entry, setEntry] = useState()
  const [isIntersecting, setIsIntersecting] = useState(false)

  const updateEntry = ([entry]) => {
    setEntry(entry)
    setIsIntersecting(entry.isIntersecting)
  }

  useEffect(() => {
    const node = elementRef?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin])

  return { entry, isIntersecting }
}

/**
 * 媒体查询Hook
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    
    // 现代浏览器
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // 兼容旧浏览器
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [matches, query])

  return matches
}

/**
 * 窗口焦点Hook
 */
export const useWindowFocus = () => {
  const [windowFocus, setWindowFocus] = useState(true)

  useEffect(() => {
    const handleFocus = () => setWindowFocus(true)
    const handleBlur = () => setWindowFocus(false)

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return windowFocus
}

/**
 * 在线状态Hook
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
