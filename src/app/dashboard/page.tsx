'use client'

import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Get user role from user metadata or database
      const userRole = user.user_metadata?.role || 'parent'

      // Redirect to role-specific dashboard
      switch (userRole) {
        case 'parent':
          router.push('/dashboard/parent')
          break
        case 'tutor':
          router.push('/dashboard/tutor')
          break
        case 'student':
          router.push('/dashboard/student')
          break
        default:
          router.push('/dashboard/parent')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}