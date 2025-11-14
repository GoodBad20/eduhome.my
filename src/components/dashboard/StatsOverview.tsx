'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarDays, TrendingUp, BookOpen, Star, Clock, DollarSign } from 'lucide-react'

interface StatsOverviewProps {
  parentId: string
}

interface StatsData {
  activeLessons: number
  childrenEnrolled: number
  totalSpent: number
  upcomingSessions: number
  averageProgress: number
  weeklyHours: number
  topSubject: string
  improvementRate: number
}

export default function StatsOverview({ parentId }: StatsOverviewProps) {
  const [stats, setStats] = useState<StatsData>({
    activeLessons: 0,
    childrenEnrolled: 0,
    totalSpent: 0,
    upcomingSessions: 0,
    averageProgress: 0,
    weeklyHours: 0,
    topSubject: '',
    improvementRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [parentId])

  const loadStats = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // For now, using enhanced mock data
      const mockStats: StatsData = {
        activeLessons: 12,
        childrenEnrolled: 2,
        totalSpent: 1240,
        upcomingSessions: 5,
        averageProgress: 78,
        weeklyHours: 6,
        topSubject: 'Mathematics',
        improvementRate: 15
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Active Lessons',
      value: stats.activeLessons,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 this week'
    },
    {
      title: 'Children Enrolled',
      value: stats.childrenEnrolled,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'All active'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+$240 this month'
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: CalendarDays,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: 'This week'
    }
  ]

  const performanceStats = [
    {
      label: 'Average Progress',
      value: `${stats.averageProgress}%`,
      progress: stats.averageProgress,
      color: 'bg-green-500'
    },
    {
      label: 'Weekly Learning Hours',
      value: `${stats.weeklyHours}h`,
      progress: (stats.weeklyHours / 10) * 100, // Assuming 10h as goal
      color: 'bg-blue-500'
    },
    {
      label: 'Improvement Rate',
      value: `+${stats.improvementRate}%`,
      progress: stats.improvementRate,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {performanceStats.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
                <Progress
                  value={Math.min(item.progress, 100)}
                  className="h-2"
                  // @ts-ignore
                  indicatorClassName={item.color}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Top Subject</p>
                <p className="text-sm text-gray-600">{stats.topSubject}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Learning Trend</p>
                <p className="text-sm text-gray-600">Improving</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Study Time</p>
                <p className="text-sm text-gray-600">{stats.weeklyHours}h/week</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => window.location.href = '/dashboard/parent/progress'}
          >
            View Detailed Report
          </Button>
        </Card>
      </div>
    </div>
  )
}