'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, BookOpen, BarChart3 } from 'lucide-react'

interface AnalyticsData {
  period: string
  revenue: number
  users: number
  bookings: number
  tutors: number
  lessons: number
}

interface TopTutor {
  id: string
  name: string
  subject: string
  bookings: number
  revenue: number
  rating: number
}

interface SubjectAnalytics {
  subject: string
  bookings: number
  revenue: number
  growth: number
}

export default function AdminAnalytics() {
  const { user } = useSupabase()
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [topTutors, setTopTutors] = useState<TopTutor[]>([])
  const [subjectAnalytics, setSubjectAnalytics] = useState<SubjectAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [period])

  const fetchAnalyticsData = async () => {
    try {
      // Mock analytics data - in production, this would come from your analytics API
      const mockAnalyticsData: AnalyticsData[] = [
        { period: 'Week 1', revenue: 12500, users: 45, bookings: 120, tutors: 12, lessons: 85 },
        { period: 'Week 2', revenue: 15200, users: 52, bookings: 145, tutors: 14, lessons: 102 },
        { period: 'Week 3', revenue: 18900, users: 61, bookings: 178, tutors: 16, lessons: 124 },
        { period: 'Week 4', revenue: 22150, users: 73, bookings: 201, tutors: 18, lessons: 143 },
      ]

      const mockTopTutors: TopTutor[] = [
        { id: '1', name: 'Sarah Chen', subject: 'Mathematics', bookings: 45, revenue: 3375, rating: 4.9 },
        { id: '2', name: 'Michael Kumar', subject: 'Physics', bookings: 38, revenue: 2850, rating: 4.8 },
        { id: '3', name: 'Fatima Ali', subject: 'Chemistry', bookings: 32, revenue: 2400, rating: 4.7 },
        { id: '4', name: 'David Lim', subject: 'Biology', bookings: 28, revenue: 2100, rating: 4.9 },
        { id: '5', name: 'Emma Watson', subject: 'English', bookings: 25, revenue: 1875, rating: 4.6 },
      ]

      const mockSubjectAnalytics: SubjectAnalytics[] = [
        { subject: 'Mathematics', bookings: 245, revenue: 18375, growth: 18.5 },
        { subject: 'Science', bookings: 189, revenue: 14175, growth: 15.2 },
        { subject: 'Languages', bookings: 156, revenue: 11700, growth: 22.1 },
        { subject: 'Programming', bookings: 134, revenue: 10050, growth: 31.4 },
        { subject: 'Music & Arts', bookings: 87, revenue: 6525, growth: 8.7 },
      ]

      setAnalyticsData(mockAnalyticsData)
      setTopTutors(mockTopTutors)
      setSubjectAnalytics(mockSubjectAnalytics)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
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

  const currentPeriod = analyticsData[analyticsData.length - 1]
  const previousPeriod = analyticsData[analyticsData.length - 2]

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const MetricCard = ({ title, value, change, icon, color }: {
    title: string
    value: string | number
    change?: number
    icon: React.ReactNode
    color: string
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
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
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const revenueGrowth = previousPeriod ? parseFloat(calculateGrowth(currentPeriod.revenue, previousPeriod.revenue)) : 0
  const usersGrowth = previousPeriod ? parseFloat(calculateGrowth(currentPeriod.users, previousPeriod.users)) : 0
  const bookingsGrowth = previousPeriod ? parseFloat(calculateGrowth(currentPeriod.bookings, previousPeriod.bookings)) : 0
  const tutorsGrowth = previousPeriod ? parseFloat(calculateGrowth(currentPeriod.tutors, previousPeriod.tutors)) : 0

  return (
    <DashboardLayout userRole="tutor" user={user}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Platform performance and insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(currentPeriod?.revenue || 0)}
            change={revenueGrowth}
            icon={<DollarSign className="w-6 h-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <MetricCard
            title="Active Users"
            value={(currentPeriod?.users || 0).toLocaleString()}
            change={usersGrowth}
            icon={<Users className="w-6 h-6 text-green-600" />}
            color="bg-green-100"
          />
          <MetricCard
            title="Total Bookings"
            value={(currentPeriod?.bookings || 0).toLocaleString()}
            change={bookingsGrowth}
            icon={<BookOpen className="w-6 h-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <MetricCard
            title="Active Tutors"
            value={(currentPeriod?.tutors || 0).toLocaleString()}
            change={tutorsGrowth}
            icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* Charts and Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Tutors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Top Performing Tutors</h2>
              <p className="text-sm text-gray-600 mt-1">Highest revenue generators this period</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topTutors.map((tutor, index) => (
                  <div key={tutor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tutor.name}</p>
                        <p className="text-sm text-gray-500">{tutor.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(tutor.revenue)}</p>
                      <p className="text-sm text-gray-500">{tutor.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Subject Performance</h2>
              <p className="text-sm text-gray-600 mt-1">Most popular subjects and growth</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {subjectAnalytics.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{subject.subject}</p>
                        <p className="text-sm text-gray-500">{subject.bookings} bookings</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${Math.min((subject.bookings / 250) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(subject.revenue)}</p>
                      <p className={`text-sm ${subject.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {subject.growth >= 0 ? '+' : ''}{subject.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Over Time Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-sm text-gray-600 mt-1">Revenue performance over time</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {analyticsData.map((data) => (
                <div key={data.period} className="text-center">
                  <p className="text-sm text-gray-600 mb-2">{data.period}</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(data.revenue)}</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${(data.revenue / 25000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">24.8%</div>
            <p className="text-sm text-gray-600">Visitors who become paid users</p>
            <div className="mt-4 flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+3.2% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Lesson Value</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">RM75</div>
            <p className="text-sm text-gray-600">Average revenue per lesson</p>
            <div className="mt-4 flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+5.1% from last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
            <p className="text-sm text-gray-600">Average tutor rating</p>
            <div className="mt-4 flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+0.2 from last month</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}