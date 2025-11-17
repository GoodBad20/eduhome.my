'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Star,
  Award,
  BookOpen,
  ChevronUp,
  ChevronDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  totalStudents: number
  totalSessions: number
  totalEarnings: number
  averageRating: number
  completionRate: number
  monthlyEarnings: number[]
  studentGrowth: number[]
  popularSubjects: { subject: string; count: number }[]
  sessionDuration: { period: string; duration: number }[]
}

export default function TutorAnalyticsPage() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setLoading(true)

      // Mock data - in a real app, this would come from your API
      const mockData: AnalyticsData = {
        totalStudents: 24,
        totalSessions: 156,
        totalEarnings: 12500,
        averageRating: 4.8,
        completionRate: 94,
        monthlyEarnings: [1800, 2200, 1900, 2500, 2800, 3200, 2900, 3100, 2700, 3300, 3500, 3800],
        studentGrowth: [18, 20, 19, 22, 24, 23, 26, 25, 28, 27, 30, 24],
        popularSubjects: [
          { subject: 'Mathematics', count: 45 },
          { subject: 'Science', count: 38 },
          { subject: 'English', count: 32 },
          { subject: 'History', count: 25 },
          { subject: 'Geography', count: 16 }
        ],
        sessionDuration: [
          { period: 'Jan', duration: 65 },
          { period: 'Feb', duration: 68 },
          { period: 'Mar', duration: 72 },
          { period: 'Apr', duration: 70 },
          { period: 'May', duration: 75 },
          { period: 'Jun', duration: 78 }
        ]
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAnalyticsData(mockData)
      setLoading(false)
    }

    loadAnalytics()
  }, [selectedPeriod])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `RM${amount.toLocaleString()}`
  }

  const MetricCard = ({ icon: Icon, title, value, change, changeType }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ChevronUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          title.includes('Earnings') ? 'bg-green-100 text-green-600' :
          title.includes('Students') ? 'bg-blue-100 text-blue-600' :
          title.includes('Sessions') ? 'bg-purple-100 text-purple-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('tutor.analytics')}</h1>
          <p className="text-gray-600 mt-1">Track your tutoring performance and earnings</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPeriod === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Students"
          value={analyticsData.totalStudents}
          change="+12% from last month"
          changeType="increase"
        />
        <MetricCard
          icon={Calendar}
          title="Total Sessions"
          value={analyticsData.totalSessions}
          change="+8% from last month"
          changeType="increase"
        />
        <MetricCard
          icon={DollarSign}
          title="Total Earnings"
          value={formatCurrency(analyticsData.totalEarnings)}
          change="+15% from last month"
          changeType="increase"
        />
        <MetricCard
          icon={Star}
          title="Average Rating"
          value={`${analyticsData.averageRating}/5.0`}
          change="+0.2 from last month"
          changeType="increase"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyEarnings.map((earning, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-blue-200 rounded-t-lg relative">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300"
                    style={{ height: `${(earning / Math.max(...analyticsData.monthlyEarnings)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.studentGrowth.map((students, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-200 rounded-t-lg relative">
                  <div
                    className="w-full bg-green-600 rounded-t-lg transition-all duration-300"
                    style={{ height: `${(students / Math.max(...analyticsData.studentGrowth)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Subjects and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Subjects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Subjects</h3>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            {analyticsData.popularSubjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-700">{subject.subject}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(subject.count / Math.max(...analyticsData.popularSubjects.map(s => s.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{subject.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Session Performance</h3>
            <Activity className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Average Session Duration</span>
              <span className="font-semibold text-gray-900">70 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Completion Rate</span>
              <span className="font-semibold text-green-600">{analyticsData.completionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">On-time Sessions</span>
              <span className="font-semibold text-gray-900">148/156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Reschedule Rate</span>
              <span className="font-semibold text-orange-600">5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Student Satisfaction</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(analyticsData.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-900 ml-2">{analyticsData.averageRating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Clock className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">New student enrolled for Mathematics</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">Completed 5-session package with Sarah Chen</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">Received 5-star review from Michael Tan</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">Updated Science lesson materials</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}