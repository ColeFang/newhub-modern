import { useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Input,
  Badge,
} from '@heroui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { useFavorites, useSearch } from '../../hooks/useNews'
import { useResponsive } from '../../hooks/useResponsive'

import ScrollToTop from '../common/ScrollToTop'
import ThemeToggle from '../common/ThemeToggle'
import LoadingBar from '../common/LoadingBar'
import MobileLayout from './MobileLayout'
import NewsHubIcon from '../icons/NewsHubIcon'

// 图标组件
const SearchIcon = () => (
  <svg
    className="w-4 h-4"
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

const HeartIcon = ({ filled = false }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? 'currentColor' : 'none'}
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

const HomeIcon = () => (
  <svg
    className="w-5 h-5"
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

const AppLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useApp()
  const { favoritesCount } = useFavorites()
  const { searchNews } = useSearch()
  const { isMobile } = useResponsive()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // 导航菜单项
  const menuItems = [
    { key: 'home', label: '首页', path: '/', icon: <HomeIcon /> },
    { key: 'search', label: '搜索', path: '/search', icon: <SearchIcon /> },
    {
      key: 'favorites',
      label: '收藏',
      path: '/favorites',
      icon: <HeartIcon />,
    },
  ]

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate('/search')
      searchNews(searchValue.trim())
      setSearchValue('')
      setIsMenuOpen(false)
    }
  }

  // 处理导航
  const handleNavigation = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  // 如果是移动端，使用移动端布局
  if (isMobile) {
    return (
      <MobileLayout>
        {children}
        <ScrollToTop />
      </MobileLayout>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部加载进度条 */}
      <LoadingBar loading={state.loading} />

      {/* 导航栏 */}
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="glass-effect border-b border-divider"
        maxWidth="full"
        position="sticky"
      >
        {/* 左侧品牌 */}
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            className="sm:hidden"
          />
          <NavbarBrand>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavigation('/')}
            >
              <NewsHubIcon
                size={32}
                animated={true}
                color="currentColor"
                className="text-frost-500 dark:text-frost-400"
              />
              <span className="font-bold text-xl text-nordic-900 dark:text-nordic-100 group-hover:text-frost-500 dark:group-hover:text-frost-400 transition-colors duration-200">
                NewsHub
              </span>
            </div>
          </NavbarBrand>
        </NavbarContent>

        {/* 中间搜索框 - 桌面端 */}
        {!isMobile && (
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <Input
                classNames={{
                  base: 'max-w-full h-10',
                  mainWrapper: 'h-full',
                  input: 'text-small',
                  inputWrapper:
                    'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
                }}
                placeholder="搜索新闻..."
                size="sm"
                startContent={<SearchIcon />}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          </NavbarContent>
        )}

        {/* 右侧操作 */}
        <NavbarContent justify="end">
          {/* 桌面端导航 */}
          <div className="hidden sm:flex gap-2">
            <NavbarItem>
              <Button
                isIconOnly
                variant="light"
                onClick={() => handleNavigation('/')}
                className={location.pathname === '/' ? 'text-primary' : ''}
              >
                <HomeIcon />
              </Button>
            </NavbarItem>

            <NavbarItem>
              <Button
                isIconOnly
                variant="light"
                onClick={() => handleNavigation('/search')}
                className={
                  location.pathname === '/search' ? 'text-primary' : ''
                }
              >
                <SearchIcon />
              </Button>
            </NavbarItem>

            <NavbarItem>
              <Badge
                content={favoritesCount}
                color="danger"
                isInvisible={favoritesCount === 0}
              >
                <Button
                  isIconOnly
                  variant="light"
                  onClick={() => handleNavigation('/favorites')}
                  className={
                    location.pathname === '/favorites' ? 'text-primary' : ''
                  }
                >
                  <HeartIcon filled={location.pathname === '/favorites'} />
                </Button>
              </Badge>
            </NavbarItem>
          </div>

          {/* 主题切换 */}
          <NavbarItem>
            <ThemeToggle />
          </NavbarItem>
        </NavbarContent>

        {/* 移动端菜单 */}
        <NavbarMenu className="pt-6">
          {/* 移动端搜索 */}
          <NavbarMenuItem>
            <form onSubmit={handleSearch} className="w-full mb-4">
              <Input
                placeholder="搜索新闻..."
                size="lg"
                startContent={<SearchIcon />}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full"
              />
            </form>
          </NavbarMenuItem>

          {/* 菜单项 */}
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.key}>
              <Button
                className="w-full justify-start"
                variant={location.pathname === item.path ? 'flat' : 'light'}
                color={location.pathname === item.path ? 'primary' : 'default'}
                startContent={item.icon}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.key === 'favorites' && favoritesCount > 0 && (
                    <Badge content={favoritesCount} color="danger" size="sm" />
                  )}
                </span>
              </Button>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      {/* 主要内容区域 */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </main>

      {/* 回到顶部按钮 */}
      <ScrollToTop />
    </div>
  )
}

export default AppLayout
