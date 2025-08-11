import { Spinner, Card, CardBody, Skeleton } from '@heroui/react'

/**
 * 页面加载组件
 */
export const PageLoading = ({ message = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Spinner
        size="lg"
        color="primary"
        className="mb-4"
      />
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {message}
      </p>
    </div>
  )
}

/**
 * 内联加载组件
 */
export const InlineLoading = ({ size = 'md', color = 'primary' }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <Spinner size={size} color={color} />
    </div>
  )
}

/**
 * 新闻卡片骨架屏
 */
export const NewsCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardBody className="p-4">
        <div className="flex gap-4">
          {/* 图片骨架 */}
          <Skeleton className="rounded-lg">
            <div className="h-20 w-20 rounded-lg bg-default-300"></div>
          </Skeleton>
          
          {/* 内容骨架 */}
          <div className="flex-1 space-y-3">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-4 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-4 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <div className="flex gap-2">
              <Skeleton className="w-16 rounded-lg">
                <div className="h-3 w-16 rounded-lg bg-default-300"></div>
              </Skeleton>
              <Skeleton className="w-20 rounded-lg">
                <div className="h-3 w-20 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

/**
 * 新闻列表骨架屏
 */
export const NewsListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * 搜索结果骨架屏
 */
export const SearchSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* 搜索统计骨架 */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-32 rounded-lg">
          <div className="h-4 w-32 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
      
      {/* 搜索结果骨架 */}
      <NewsListSkeleton count={3} />
    </div>
  )
}

/**
 * 分类标签骨架屏
 */
export const CategorySkeleton = () => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="rounded-full">
          <div className="h-8 w-16 rounded-full bg-default-300"></div>
        </Skeleton>
      ))}
    </div>
  )
}

/**
 * 带动画的加载点
 */
export const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  )
}

/**
 * 脉冲加载效果
 */
export const PulseLoading = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
    </div>
  )
}

/**
 * 波浪加载效果
 */
export const WaveLoading = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="w-1 h-8 bg-primary rounded-full animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1s',
          }}
        ></div>
      ))}
    </div>
  )
}

/**
 * 全屏加载遮罩
 */
export const FullScreenLoading = ({ message = '加载中...', show = true }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="glass-effect">
        <CardBody className="flex flex-col items-center p-8">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-foreground text-sm">{message}</p>
        </CardBody>
      </Card>
    </div>
  )
}

export default {
  PageLoading,
  InlineLoading,
  NewsCardSkeleton,
  NewsListSkeleton,
  SearchSkeleton,
  CategorySkeleton,
  LoadingDots,
  PulseLoading,
  WaveLoading,
  FullScreenLoading,
}
