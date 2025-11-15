'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/SupabaseProvider'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

const ADMIN_EMAIL = 'badrul.ameen20@gmail.com'

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const { user } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (user.email !== ADMIN_EMAIL) {
        router.push('/dashboard/parent')
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    if (user) {
      checkAuth()
    } else {
      // Still loading user info
      const timer = setTimeout(() => {
        if (!user) {
          router.push('/auth/login')
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this area.</p>
          <button
            onClick={() => router.push('/dashboard/parent')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}