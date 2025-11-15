// Basic error tracking and monitoring utilities

interface ErrorInfo {
  error: Error
  context?: Record<string, any>
  userId?: string
  timestamp: Date
  userAgent: string
  url: string
}

class ErrorTracker {
  private errors: ErrorInfo[] = []
  private maxErrors = 50 // Keep only the last 50 errors

  capture(error: Error, context?: Record<string, any>) {
    const errorInfo: ErrorInfo = {
      error,
      context,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server-side',
      url: typeof window !== 'undefined' ? window.location.href : 'Server-side',
    }

    // Add user ID if available
    if (typeof window !== 'undefined' && (window as any).__EDUHOME_USER_ID) {
      errorInfo.userId = (window as any).__EDUHOME_USER_ID
    }

    this.errors.push(errorInfo)

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Captured')
      console.error(error)
      console.log('Context:', context)
      console.log('Error Info:', errorInfo)
      console.groupEnd()
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      const errorMessage = `${error.name}: ${error.message}`
      const errorContext = context ? JSON.stringify(context) : 'No context'

      window.gtag('event', 'exception', {
        description: errorMessage,
        fatal: false,
        custom_map: { 'error_context': errorContext }
      })
    }

    // In production, you could send to an error monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorInfo)
    }
  }

  private async sendToMonitoringService(errorInfo: ErrorInfo) {
    // This is where you would integrate with Sentry, LogRocket, etc.
    // For now, we'll just store in localStorage for debugging
    try {
      if (typeof window !== 'undefined' && localStorage) {
        const existingErrors = JSON.parse(localStorage.getItem('eduhome_errors') || '[]')
        existingErrors.push({
          ...errorInfo,
          timestamp: errorInfo.timestamp.toISOString(),
        })

        // Keep only last 10 errors in localStorage
        const recentErrors = existingErrors.slice(-10)
        localStorage.setItem('eduhome_errors', JSON.stringify(recentErrors))
      }
    } catch (e) {
      // Fails silently to avoid infinite loops
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('eduhome_errors')
    }
  }

  getErrorStats() {
    const errors = this.getErrors()
    const last24Hours = errors.filter(e =>
      new Date().getTime() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    )

    return {
      total: errors.length,
      last24Hours: last24Hours.length,
      mostCommonError: this.getMostCommonError(errors),
      recentErrors: last24Hours.slice(-5)
    }
  }

  private getMostCommonError(errors: ErrorInfo[]) {
    const errorCounts = errors.reduce((acc, error) => {
      const key = error.error.name
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostCommon = Object.entries(errorCounts).sort(([,a], [,b]) => b - a)[0]
    return mostCommon ? mostCommon[0] : 'None'
  }
}

export const errorTracker = new ErrorTracker()

// Helper functions
export const captureError = (error: Error, context?: Record<string, any>) => {
  errorTracker.capture(error, context)
}

export const setUserContext = (userId: string) => {
  if (typeof window !== 'undefined') {
    (window as any).__EDUHOME_USER_ID = userId
  }
}

// React error boundary integration
export const reportError = (error: Error, errorInfo?: React.ErrorInfo) => {
  captureError(error, {
    componentStack: errorInfo?.componentStack,
    reactBoundary: true
  })
}

// Async error wrapper
export const safeAsync = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureError(error as Error, {
        function: fn.name,
        arguments: args,
        context
      })
      throw error
    }
  }) as T
}

// Development helper for viewing errors
export const getErrorStats = () => {
  return errorTracker.getErrorStats()
}