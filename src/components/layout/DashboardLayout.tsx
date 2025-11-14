'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'parent' | 'tutor'
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useSupabase()
  const router = useRouter()

  const getAvatarInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
    }
    return email?.charAt(0).toUpperCase() || 'U'
  }

  const getFallbackGradient = () => {
    const colors = [
      'from-blue-400 to-purple-600',
      'from-green-400 to-emerald-600',
      'from-purple-400 to-pink-600',
      'from-orange-400 to-red-600',
      'from-teal-400 to-cyan-600'
    ]

    const name = user?.user_metadata?.full_name || user?.email || 'User'
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[colorIndex]
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const getNavigationItems = () => {
    switch (userRole) {
      case 'parent':
        return [
          { name: 'Home', href: '/dashboard/parent', icon: '🏠' },
          { name: 'My Kids', href: '/dashboard/parent/children', icon: '👨‍👩‍👧‍👦' },
          { name: 'Progress', href: '/dashboard/parent/progress', icon: '📈' },
          { name: 'Daily Schedule', href: '/dashboard/parent/schedule', icon: '📅' },
          { name: 'Lessons', href: '/dashboard/parent/lessons', icon: '📚' },
          { name: 'Payments', href: '/dashboard/parent/payments', icon: '💳' },
          { name: 'Messages', href: '/dashboard/parent/messages', icon: '💬' },
          { name: 'Find Tutors', href: '/dashboard/parent/find-tutors', icon: '🔍' },
          { name: 'Settings', href: '/dashboard/parent/settings', icon: '⚙️' },
        ]
      case 'tutor':
        return [
          { name: 'Dashboard', href: '/dashboard/tutor', icon: '📊' },
          { name: 'Profile', href: '/dashboard/tutor/profile', icon: '👤' },
          { name: 'Students', href: '/dashboard/tutor/students', icon: '👥' },
          { name: 'Lessons', href: '/dashboard/tutor/lessons', icon: '📚' },
          { name: 'Schedule', href: '/dashboard/tutor/schedule', icon: '📅' },
          { name: 'Assignments', href: '/dashboard/tutor/assignments', icon: '📝' },
          { name: 'Messages', href: '/dashboard/tutor/messages', icon: '💬' },
          { name: 'Earnings', href: '/dashboard/tutor/earnings', icon: '💰' },
        ]
      default:
        return []
    }
  }

  const navigation = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
             onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex w-72 flex-col bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <h1 className="text-lg font-bold text-white">EduHome.my</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile User Profile */}
          <div className="px-4 mt-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url || undefined}
                    alt={user?.user_metadata?.full_name || 'User'}
                  />
                  <AvatarFallback className={`bg-gradient-to-br ${getFallbackGradient()} text-white font-bold`}>
                    {getAvatarInitials(user?.user_metadata?.full_name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-3 space-y-2 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-white/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm transition-all duration-200 border border-transparent hover:border-white/20"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* Mobile Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white/90 hover:text-white border border-red-400/30 hover:border-red-400/50 transition-all duration-200"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 pt-5 pb-4 overflow-y-auto shadow-2xl">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <h1 className="text-xl font-bold text-white">EduHome.my</h1>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="px-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url || undefined}
                    alt={user?.user_metadata?.full_name || 'User'}
                  />
                  <AvatarFallback className={`bg-gradient-to-br ${getFallbackGradient()} text-white font-bold text-lg`}>
                    {getAvatarInitials(user?.user_metadata?.full_name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-white/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm transition-all duration-200 transform hover:scale-105 border border-transparent hover:border-white/20"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className="group-hover:font-semibold">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="px-3 mt-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white/90 hover:text-white border border-red-400/30 hover:border-red-400/50 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              type="button"
              className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1 md:hidden">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-600">
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