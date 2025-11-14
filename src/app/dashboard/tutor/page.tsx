'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  BookOpen,
  Award,
  MessageSquare,
  Target,
  Zap,
  ChevronRight,
  Video,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface TutorStats {
  activeStudents: number
  weeklyLessons: number
  monthlyEarnings: number
  completionRate: number
  averageRating: number
  totalLessons: number
  improvementRate: number
  pendingSubmissions: number
  upcomingLessons: number
}

interface TodaySchedule {
  id: string
  time: string
  student: string
  subject: string
  type: 'online' | 'in_person'
  status: 'upcoming' | 'in_progress' | 'completed'
}

interface RecentActivity {
  id: string
  type: 'submission' | 'lesson' | 'message' | 'rating'
  student: string
  description: string
  timestamp: string
  status?: string
}

export default function TutorDashboard() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TutorStats>({
    activeStudents: 0,
    weeklyLessons: 0,
    monthlyEarnings: 0,
    completionRate: 0,
    averageRating: 0,
    totalLessons: 0,
    improvementRate: 0,
    pendingSubmissions: 0,
    upcomingLessons: 0
  })
  const [todaysSchedule, setTodaysSchedule] = useState<TodaySchedule[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    if (user) {
      loadTutorData()
    }
  }, [user])

  const loadTutorData = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API calls
      const mockStats: TutorStats = {
        activeStudents: 15,
        weeklyLessons: 24,
        monthlyEarnings: 3200,
        completionRate: 94,
        averageRating: 4.8,
        totalLessons: 152,
        improvementRate: 89,
        pendingSubmissions: 3,
        upcomingLessons: 6
      }

      const mockSchedule: TodaySchedule[] = [
        {
          id: '1',
          time: '2:00 PM - 3:00 PM',
          student: 'Alice Wong',
          subject: 'Mathematics',
          type: 'online',
          status: 'upcoming'
        },
        {
          id: '2',
          time: '3:30 PM - 4:15 PM',
          student: 'Bob Kim',
          subject: 'Science',
          type: 'online',
          status: 'upcoming'
        },
        {
          id: '3',
          time: '4:30 PM - 5:30 PM',
          student: 'Carol Lee',
          subject: 'English',
          type: 'in_person',
          status: 'upcoming'
        },
        {
          id: '4',
          time: '6:00 PM - 6:45 PM',
          student: 'David Tan',
          subject: 'History',
          type: 'online',
          status: 'upcoming'
        }
      ]

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'submission',
          student: 'Alice Wong',
          description: 'Submitted Mathematics Assignment #5',
          timestamp: '2 hours ago',
          status: 'pending_review'
        },
        {
          id: '2',
          type: 'rating',
          student: 'Bob Kim',
          description: 'Rated your lesson 5 stars',
          timestamp: '4 hours ago'
        },
        {
          id: '3',
          type: 'message',
          student: 'Carol Lee',
          description: 'Sent a message about homework',
          timestamp: '5 hours ago'
        },
        {
          id: '4',
          type: 'lesson',
          student: 'David Tan',
          description: 'Completed History lesson',
          timestamp: '1 day ago'
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setStats(mockStats)
      setTodaysSchedule(mockSchedule)
      setRecentActivity(mockActivity)
    } catch (error) {
      console.error('Error loading tutor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <BookOpen className="h-4 w-4" />
      case 'rating':
        return <Star className="h-4 w-4" />
      case 'message':
        return <MessageSquare className="h-4 w-4" />
      case 'lesson':
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string, status?: string) => {
    if (type === 'submission' && status === 'pending_review') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    switch (type) {
      case 'submission':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rating':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'message':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'lesson':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return `RM${amount.toLocaleString()}`
  }

  if (loading) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading your teaching dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Award className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold">Teaching Dashboard</h1>
                  <p className="text-xs md:text-sm text-white opacity-90 hidden md:block">
                    Welcome back! Here's your teaching overview and today's activities
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.monthlyEarnings)}</div>
                <div className="text-xs md:text-sm text-white opacity-90">Monthly Earnings</div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white opacity-90">Students</p>
                  <p className="text-lg font-bold">{stats.activeStudents}</p>
                </div>
                <Users className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white opacity-90">This Week</p>
                  <p className="text-lg font-bold">{stats.weeklyLessons}</p>
                </div>
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white opacity-90">Rating</p>
                  <p className="text-lg font-bold">{stats.averageRating}</p>
                </div>
                <Star className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white opacity-90">Completion</p>
                  <p className="text-lg font-bold">{stats.completionRate}%</p>
                </div>
                <Target className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Today's Schedule - Enhanced */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Today's Schedule
                    </h2>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {todaysSchedule.length} Lessons
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {todaysSchedule.map((lesson) => (
                      <div key={lesson.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{lesson.subject}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
                                lesson.type === 'online'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {lesson.type === 'online' ? (
                                  <>
                                    <Video className="h-3 w-3" />
                                    <span>Online</span>
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="h-3 w-3" />
                                    <span>In-Person</span>
                                  </>
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{lesson.student}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              lesson.status === 'completed' ? 'bg-green-500' :
                              lesson.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                              {lesson.status === 'completed' ? 'View Notes' :
                               lesson.status === 'in_progress' ? 'Join' : 'Start'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-300 hover:bg-blue-50">
                    View Full Schedule
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Activity - Enhanced */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Recent Activity
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg border ${getActivityColor(activity.type, activity.status)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.student} • {activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-yellow-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-yellow-600">{stats.pendingSubmissions}</div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <div className="text-lg font-bold text-green-600">{stats.upcomingLessons}</div>
                        <div className="text-xs text-gray-600">Upcoming</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Enhanced */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <button onClick={() => window.location.href = '/dashboard/tutor/assignments'}
                      className="group p-3 md:p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all group-hover:scale-105 border border-blue-200">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                <p className="text-xs md:text-sm font-medium text-gray-900">Assignments</p>
              </button>
              <button onClick={() => window.location.href = '/dashboard/tutor/lessons'}
                      className="group p-3 md:p-4 text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all group-hover:scale-105 border border-green-200">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                <p className="text-xs md:text-sm font-medium text-gray-900">Lessons</p>
              </button>
              <button onClick={() => window.location.href = '/dashboard/tutor/messages'}
                      className="group p-3 md:p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all group-hover:scale-105 border border-purple-200">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</div>
                <p className="text-xs md:text-sm font-medium text-gray-900">Messages</p>
              </button>
              <button onClick={() => window.location.href = '/dashboard/tutor/earnings'}
                      className="group p-3 md:p-4 text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all group-hover:scale-105 border border-yellow-200">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                <p className="text-xs md:text-sm font-medium text-gray-900">Earnings</p>
              </button>
            </div>
          </div>

          {/* Performance Overview - Enhanced */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageRating}</div>
                <p className="text-sm font-medium text-gray-700 mb-2">Average Rating</p>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                  ))}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalLessons}</div>
                <p className="text-sm font-medium text-gray-700 mb-2">Total Lessons</p>
                <Progress value={(stats.totalLessons / 200) * 100} className="mt-2" />
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.improvementRate}%</div>
                <p className="text-sm font-medium text-gray-700 mb-2">Student Success</p>
                <div className="flex justify-center mt-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}