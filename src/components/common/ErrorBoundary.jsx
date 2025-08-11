import { Component } from 'react'
import { Button, Card, CardBody } from '@heroui/react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // 这里可以添加错误日志上报
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
          <Card className="max-w-md w-full">
            <CardBody className="text-center p-8">
              <div className="text-6xl mb-4">😵</div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                哎呀，出错了！
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                应用遇到了一个意外错误，请尝试刷新页面或返回首页。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  color="primary"
                  variant="solid"
                  onClick={this.handleReload}
                  className="min-w-24"
                >
                  刷新页面
                </Button>
                <Button
                  color="default"
                  variant="bordered"
                  onClick={this.handleGoHome}
                  className="min-w-24"
                >
                  返回首页
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    查看错误详情
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-40">
                    <div className="text-red-600 dark:text-red-400 mb-2">
                      {this.state.error.toString()}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
            </CardBody>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
