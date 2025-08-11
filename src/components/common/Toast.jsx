import { useState, useEffect, createContext, useContext } from 'react'
import { Card, CardBody, Button } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateId } from '../../utils/helpers'

// 图标组件
const SuccessIcon = () => (
  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ErrorIcon = () => (
  <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const WarningIcon = () => (
  <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

const InfoIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// Toast类型配置
const toastConfig = {
  success: {
    icon: SuccessIcon,
    color: 'success',
    bgColor: 'bg-success-50 dark:bg-success-900/20',
    borderColor: 'border-success-200 dark:border-success-800',
  },
  error: {
    icon: ErrorIcon,
    color: 'danger',
    bgColor: 'bg-danger-50 dark:bg-danger-900/20',
    borderColor: 'border-danger-200 dark:border-danger-800',
  },
  warning: {
    icon: WarningIcon,
    color: 'warning',
    bgColor: 'bg-warning-50 dark:bg-warning-900/20',
    borderColor: 'border-warning-200 dark:border-warning-800',
  },
  info: {
    icon: InfoIcon,
    color: 'primary',
    bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    borderColor: 'border-primary-200 dark:border-primary-800',
  },
}

// Toast组件
const ToastItem = ({ toast, onClose }) => {
  const config = toastConfig[toast.type] || toastConfig.info
  const IconComponent = config.icon

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full max-w-sm"
    >
      <Card className={`${config.bgColor} ${config.borderColor} border shadow-lg`}>
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            {/* 图标 */}
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent />
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm text-foreground-600">
                {toast.message}
              </p>
            </div>

            {/* 关闭按钮 */}
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="min-w-6 w-6 h-6 text-foreground-400 hover:text-foreground-600"
              onClick={() => onClose(toast.id)}
            >
              <CloseIcon />
            </Button>
          </div>

          {/* 进度条 */}
          {toast.duration > 0 && (
            <motion.div
              className={`mt-3 h-1 bg-${config.color} rounded-full`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
            />
          )}
        </CardBody>
      </Card>
    </motion.div>
  )
}

// Toast容器组件
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast Context
const ToastContext = createContext()

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = generateId()
    const newToast = {
      id,
      type: 'info',
      duration: 4000,
      ...toast,
    }

    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearToasts = () => {
    setToasts([])
  }

  // 便捷方法
  const toast = {
    success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addToast({ ...options, type: 'info', message }),
    custom: (options) => addToast(options),
  }

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    toast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastProvider
