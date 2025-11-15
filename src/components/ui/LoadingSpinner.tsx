import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'gray'
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  color = 'blue',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
  )
}

// Loading skeleton components for various UI elements
export function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-gray-100">
            <div className="grid grid-cols-4 gap-4 p-4">
              {[...Array(4)].map((_, colIndex) => (
                <div key={colIndex} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonButton() {
  return (
    <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="flex items-center space-x-3">
          <LoadingSpinner />
          <span className="text-gray-700">Processing...</span>
        </div>
      </div>
    </div>
  )
}