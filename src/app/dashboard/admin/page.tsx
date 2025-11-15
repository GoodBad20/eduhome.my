'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useRouter } from 'next/navigation'

interface AdminStats {
  totalUsers: number
  totalParents: number
  totalTutors: number
  totalStudents: number
  totalBookings: number
  totalRevenue: number
  activeBookings: number
  pendingApprovals: number
}

interface RecentActivity {
  id: string
  type: 'user' | 'booking' | 'payment' | 'tutor'
  description: string
  timestamp: string
  status: 'success' | 'pending' | 'warning' | 'error'
}

export default function AdminDashboard() {
  const { user } = useSupabase()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalParents: 0,
    totalTutors: 0,
    totalStudents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingApprovals: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    if (user && user.email !== 'badrul.ameen20@gmail.com') {
      router.push('/dashboard/parent')
      return
    }

    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchAdminData()
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      // This would typically fetch from your admin API endpoints
      // For now, we'll use mock data that represents real admin metrics
      setStats({
        totalUsers: 1247,
        totalParents: 823,
        totalTutors: 424,
        totalStudents: 2156,
        totalBookings: 3421,
        totalRevenue: 284750,
        activeBookings: 156,
        pendingApprovals: 12
      })

      setRecentActivity([
        {
          id: '1',
          type: 'user',
          description: 'New tutor registration: Sarah Chen (Mathematics)',
          timestamp: '2 minutes ago',
          status: 'pending'
        },
        {
          id: '2',
          type: 'booking',
          description: 'Booking completed: John Doe - Physics Session',
          timestamp: '15 minutes ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'payment',
          description: 'Payment received: RM150.00 for Chemistry lessons',
          timestamp: '1 hour ago',
          status: 'success'
        },
        {
          id: '4',
          type: 'tutor',
          description: 'Tutor profile updated: Michael Kumar',
          timestamp: '2 hours ago',
          status: 'success'
        },
        {
          id: '5',
          type: 'user',
          description: 'New parent registration: Ahmad Iskandar',
          timestamp: '3 hours ago',
          status: 'success'
        }
      ])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount)
  }

  const StatCard = ({ title, value, change, icon, color }: {
    title: string
    value: string | number
    change?: number
    icon: string
    color: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <DashboardLayout userRole="tutor" user={user}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin" user={user}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={12.5}
            icon="👥"
            color="bg-blue-100"
          />
          <StatCard
            title="Total Tutors"
            value={stats.totalTutors.toLocaleString()}
            change={8.2}
            icon="👨‍🏫"
            color="bg-green-100"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            change={15.3}
            icon="📅"
            color="bg-purple-100"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={22.1}
            icon="💰"
            color="bg-yellow-100"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings.toLocaleString()}
            icon="🔄"
            color="bg-indigo-100"
          />
          <StatCard
            title="Parents"
            value={stats.totalParents.toLocaleString()}
            icon="👨‍👩‍👧‍👦"
            color="bg-pink-100"
          />
          <StatCard
            title="Students"
            value={stats.totalStudents.toLocaleString()}
            icon="🎓"
            color="bg-orange-100"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals.toLocaleString()}
            icon="⏳"
            color="bg-red-100"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600 mt-1">Latest platform activities and updates</p>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' :
                      activity.status === 'warning' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-gray-900 font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'success' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'warning' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
              <div className="text-blue-600 mb-2">👥</div>
              <div className="font-medium text-gray-900">User Management</div>
              <div className="text-sm text-gray-600 mt-1">Manage users and roles</div>
            </button>
            <button className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
              <div className="text-blue-600 mb-2">📊</div>
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-600 mt-1">View detailed analytics</div>
            </button>
            <button className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
              <div className="text-blue-600 mb-2">⚙️</div>
              <div className="font-medium text-gray-900">Settings</div>
              <div className="text-sm text-gray-600 mt-1">Platform configuration</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}