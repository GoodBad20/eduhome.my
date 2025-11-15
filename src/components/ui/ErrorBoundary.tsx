'use client'

import React from 'react'
import { reportError } from '@/lib/errorTracking'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    reportError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
            ⚠️
          </div>
          <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          {error && (
            <details className="mt-4 text-left text-xs text-slate-500 bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-blue-700">Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap text-slate-700">{error.message}</pre>
            </details>
          )}
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={reset}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="group relative w-full flex justify-center py-2 px-4 border-2 border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary