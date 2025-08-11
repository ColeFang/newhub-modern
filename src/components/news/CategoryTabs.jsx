import { Tabs, Tab, Chip } from '@heroui/react'
import { NEWS_CATEGORIES } from '../../utils/constants'
import { useNews } from '../../hooks/useNews'
import { useResponsive } from '../../hooks/useResponsive'
import { motion } from 'framer-motion'

const CategoryTabs = () => {
  const { currentCategory, switchCategory, loading } = useNews()
  const { isMobile } = useResponsive()

  const handleCategoryChange = (category) => {
    if (category !== currentCategory && !loading) {
      switchCategory(category)
    }
  }

  return (
    <div className="w-full mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs
          aria-label="新闻分类"
          selectedKey={currentCategory}
          onSelectionChange={handleCategoryChange}
          variant="underlined"
          color="primary"
          className="w-full"
          classNames={{
            tabList: "gap-2 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-3 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          {NEWS_CATEGORIES.map((category) => (
            <Tab
              key={category.key}
              title={
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className={isMobile ? 'text-sm' : 'text-base'}>
                    {category.label}
                  </span>
                </div>
              }
              className="relative"
            >
              {/* Tab内容可以为空，因为我们在父组件处理内容显示 */}
            </Tab>
          ))}
        </Tabs>
      </motion.div>

      {/* 移动端优化：显示当前分类信息 */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Chip
              color="primary"
              variant="flat"
              size="sm"
              startContent={
                <span className="text-sm">
                  {NEWS_CATEGORIES.find(cat => cat.key === currentCategory)?.icon}
                </span>
              }
            >
              {NEWS_CATEGORIES.find(cat => cat.key === currentCategory)?.label}
            </Chip>
          </div>
          
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>加载中...</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default CategoryTabs
