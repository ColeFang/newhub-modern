import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { ToastProvider } from './components/common/Toast'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import NewsDetailPage from './pages/NewsDetailPage'
import ErrorBoundary from './components/common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <div className="min-h-screen gradient-bg">
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </AppLayout>
          </div>
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
