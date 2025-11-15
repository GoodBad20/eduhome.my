'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SidebarNavigation from '@/components/ui/SidebarNavigation'
import LanguageToggle from '@/components/ui/LanguageToggle'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'parent' | 'tutor' | 'admin'
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useSupabase()
  const router = useRouter()

  // Check if user should have admin access
  const isAdmin = user?.email === 'badrul.ameen20@gmail.com'
  const displayRole = isAdmin ? 'admin' : userRole

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          </div>
          <div className="fixed left-0 top-0 z-50 w-64 h-full flex flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 transform translate-x-0 shadow-2xl">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <h1 className="text-base sm:text-lg font-bold text-white">EduHome.my</h1>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-all active:scale-95 z-50"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <SidebarNavigation
            userRole={displayRole}
            user={user}
            sidebarOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={true}
          />
        </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 pt-5 pb-4 overflow-y-auto shadow-2xl">
          <SidebarNavigation
            userRole={displayRole}
            user={user}
            sidebarOpen={true}
            onClose={() => {}}
            isMobile={false}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72 min-h-screen overflow-x-hidden">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
            <button
              type="button"
              className="md:hidden text-gray-600 hover:text-gray-900 p-4 rounded-xl hover:bg-gray-100 transition-all active:scale-95 touch-manipulation"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 md:hidden">
              <div className="text-center px-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">Dashboard</h2>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <LanguageToggle />
              <div className="text-sm text-gray-600 hidden lg:block">
                Good to see you, <span className="font-semibold text-gray-900">{user?.user_metadata?.full_name || 'there'}</span>! 👋
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}