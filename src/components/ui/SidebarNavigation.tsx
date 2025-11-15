'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDown, ChevronRight, Home, User, BookOpen, Calendar, DollarSign, MessageSquare, Settings, Users, BarChart3, TrendingUp, FileText, Search, GraduationCap } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: string
  badge?: string | number | null
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface SidebarNavigationProps {
  userRole: 'parent' | 'tutor' | 'admin'
  user: any
  sidebarOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  '🏠': Home,
  '📊': BarChart3,
  '👤': User,
  '👨‍👩‍👧‍👦': Users,
  '📈': TrendingUp,
  '📅': Calendar,
  '📚': BookOpen,
  '📝': FileText,
  '🔍': Search,
  '💳': DollarSign,
  '💰': DollarSign,
  '💬': MessageSquare,
  '⚙️': Settings,
  '👥': Users,
  '🎓': GraduationCap,
}

export default function SidebarNavigation({ userRole, user, sidebarOpen, onClose, isMobile = false }: SidebarNavigationProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [expandedSections, setExpandedSections] = useState<string[]>(isMobile ? [] : ['Main', 'Overview'])

  const getNavigationSections = (): NavigationSection[] => {
    switch (userRole) {
      case 'parent':
        return [
          {
            title: t('dashboard.menu.main'),
            items: [
              { name: t('nav.home'), href: '/dashboard/parent', icon: '🏠', badge: null },
              { name: t('nav.dashboard'), href: '/dashboard/parent', icon: '📊', badge: null },
            ]
          },
          {
            title: t('dashboard.menu.family'),
            items: [
              { name: t('parent.myKids'), href: '/dashboard/parent/children', icon: '👨‍👩‍👧‍👦', badge: null },
              { name: t('parent.progress'), href: '/dashboard/parent/progress', icon: '📈', badge: null },
              { name: t('parent.schedule'), href: '/dashboard/parent/schedule', icon: '📅', badge: null },
            ]
          },
          {
            title: t('dashboard.menu.learning'),
            items: [
              { name: t('parent.lessons'), href: '/dashboard/parent/lessons', icon: '📚', badge: null },
              { name: t('parent.assignments'), href: '/dashboard/parent/assignments', icon: '📝', badge: null },
              { name: t('parent.findTutors'), href: '/dashboard/parent/find-tutors', icon: '🔍', badge: 'New' },
            ]
          },
          {
            title: t('dashboard.menu.account'),
            items: [
              { name: t('parent.payments'), href: '/dashboard/parent/payments', icon: '💳', badge: null },
              { name: t('nav.messages'), href: '/dashboard/parent/messages', icon: '💬', badge: '3' },
              { name: t('nav.settings'), href: '/dashboard/parent/settings', icon: '⚙️', badge: null },
            ]
          }
        ]
      case 'tutor':
        return [
          {
            title: t('dashboard.menu.overview'),
            items: [
              { name: t('nav.dashboard'), href: '/dashboard/tutor', icon: '📊', badge: null },
              { name: t('nav.profile'), href: '/dashboard/tutor/profile', icon: '👤', badge: null },
            ]
          },
          {
            title: t('dashboard.menu.teaching'),
            items: [
              { name: t('tutor.students'), href: '/dashboard/tutor/students', icon: '👥', badge: '12' },
              { name: t('tutor.schedule'), href: '/dashboard/tutor/schedule', icon: '📅', badge: null },
              { name: t('tutor.lessons'), href: '/dashboard/tutor/lessons', icon: '📚', badge: '5' },
              { name: t('tutor.assignments'), href: '/dashboard/tutor/assignments', icon: '📝', badge: '2' },
            ]
          },
          {
            title: t('dashboard.menu.business'),
            items: [
              { name: t('tutor.earnings'), href: '/dashboard/tutor/earnings', icon: '💰', badge: null },
              { name: t('tutor.analytics'), href: '/dashboard/tutor/analytics', icon: '📈', badge: null },
              { name: t('nav.messages'), href: '/dashboard/tutor/messages', icon: '💬', badge: '8' },
            ]
          }
        ]
      case 'admin':
        return [
          {
            title: t('dashboard.menu.overview'),
            items: [
              { name: t('admin.dashboard'), href: '/dashboard/admin', icon: '📊', badge: null },
              { name: t('admin.analytics'), href: '/dashboard/admin/analytics', icon: '📈', badge: null },
            ]
          },
          {
            title: 'Management',
            items: [
              { name: t('admin.users'), href: '/dashboard/admin/users', icon: '👥', badge: '47' },
              { name: t('admin.totalTutors'), href: '/dashboard/admin/tutors', icon: '👨‍🏫', badge: '12' },
              { name: t('admin.totalBookings'), href: '/dashboard/admin/bookings', icon: '📅', badge: '5' },
              { name: t('admin.payments'), href: '/dashboard/admin/payments', icon: '💳', badge: null },
            ]
          },
          {
            title: 'Content',
            items: [
              { name: 'Subjects', href: '/dashboard/admin/subjects', icon: '📚', badge: null },
              { name: 'Categories', href: '/dashboard/admin/categories', icon: '🏷️', badge: null },
              { name: 'Reviews', href: '/dashboard/admin/reviews', icon: '⭐', badge: '8' },
            ]
          },
          {
            title: 'System',
            items: [
              { name: t('admin.settings'), href: '/dashboard/admin/settings', icon: '⚙️', badge: null },
              { name: 'Logs', href: '/dashboard/admin/logs', icon: '📋', badge: null },
              { name: 'Reports', href: '/dashboard/admin/reports', icon: '📄', badge: '3' },
            ]
          }
        ]
      default:
        return []
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

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
      'from-blue-400 to-indigo-600',
      'from-purple-400 to-pink-600',
      'from-green-400 to-emerald-600',
      'from-orange-400 to-red-600',
      'from-teal-400 to-cyan-600'
    ]

    const name = user?.user_metadata?.full_name || user?.email || 'User'
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[colorIndex]
  }

  const navigationSections = getNavigationSections()

  const renderNavigationItem = (item: NavigationItem, index: number, isSubItem = false) => {
    const isActive = router.pathname === item.href
    const IconComponent = iconMap[item.icon]

    return (
      <Link
        key={`${item.name}-${index}`}
        href={item.href}
        onClick={isMobile ? onClose : undefined}
        className={`
          group relative flex items-center justify-between
          px-${isSubItem ? '4' : '3'} py-3 rounded-xl
          text-sm font-medium transition-all duration-200
          ${isSubItem ? 'ml-6' : ''}
          ${isActive
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
          }
          ${isMobile ? 'touch-manipulation min-h-[44px]' : ''}
        `}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className={`
            ${isActive ? 'text-white' : 'text-blue-200'}
            group-hover:text-white transition-colors flex-shrink-0
          `}>
            {IconComponent && <IconComponent className="h-5 w-5" />}
            {!IconComponent && <span className="text-lg">{item.icon}</span>}
          </div>
          <span className="font-medium truncate">{item.name}</span>
        </div>
        {item.badge && (
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0
            ${isActive
              ? 'bg-white/20 text-white'
              : 'mint-gradient text-white'
            }
          `}>
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className={isMobile ? "h-full" : "h-full"}>
      {!isMobile && (
        /* Desktop Header */
        <div className="flex items-center flex-shrink-0 px-6 mb-8 pt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 w-full">
            <h1 className="text-xl font-bold text-white text-center">EduHome.my</h1>
            <p className="text-xs text-blue-100 text-center mt-1 capitalize">{userRole} Dashboard</p>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className={`px-${isMobile ? 4 : 6} mb-8`}>
        <div className="bg-gradient-to-r from-white/10 to-blue-10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || undefined}
                  alt={user?.user_metadata?.full_name || 'User'}
                />
                <AvatarFallback className={`bg-gradient-to-br ${getFallbackGradient()} text-white font-bold text-lg`}>
                  {getAvatarInitials(user?.user_metadata?.full_name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-blue-100 truncate">
                {user?.email}
              </p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-100 border border-blue-300/30">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 space-y-2 pb-6 overflow-y-auto">
        {navigationSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title)

          return (
            <div key={section.title} className="space-y-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>{section.title}</span>
                <div className="transform transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-1">
                  {section.items.map((item, index) =>
                    renderNavigationItem(item, index, false)
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className={`px-${isMobile ? 3 : 3} mb-6`}>
        <button
          onClick={async () => {
            const { supabase } = await import('@/lib/supabase')
            await supabase.auth.signOut()
            router.push('/')
          }}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition-all backdrop-blur-sm"
        >
          <span className="mr-2">🚪</span>
          {t('nav.logout')}
        </button>
      </div>
    </div>
  )
}