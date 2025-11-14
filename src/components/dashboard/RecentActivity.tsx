'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  Award,
  MessageSquare,
  DollarSign
} from 'lucide-react'
import { format } from 'date-fns'

interface RecentActivityProps {
  parentId: string
}

interface ActivityData {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  category: 'lesson' | 'progress' | 'payment' | 'message' | 'achievement'
  title: string
  description: string
  student_name: string
  student_avatar?: string
  timestamp: string
  metadata?: {
    subject?: string
    score?: number
    amount?: number
    tutor_name?: string
  }
}

export default function RecentActivity({ parentId }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadRecentActivities()
  }, [parentId])

  const loadRecentActivities = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // Enhanced mock data with more variety
      const mockActivities: ActivityData[] = [
        {
          id: '1',
          type: 'success',
          category: 'lesson',
          title: 'Math Lesson Completed',
          description: 'Successfully completed algebra equations lesson',
          student_name: 'Sarah Johnson',
          student_avatar: '/avatars/sarah.jpg',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: {
            subject: 'Mathematics',
            tutor_name: 'Ms. Chen'
          }
        },
        {
          id: '2',
          type: 'info',
          category: 'lesson',
          title: 'Science Lesson Scheduled',
          description: 'Chemistry lesson scheduled for tomorrow',
          student_name: 'Tom Johnson',
          student_avatar: '/avatars/tom.jpg',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          metadata: {
            subject: 'Chemistry',
            tutor_name: 'Dr. Smith'
          }
        },
        {
          id: '3',
          type: 'success',
          category: 'progress',
          title: 'Great Progress!',
          description: 'Improved math score by 15%',
          student_name: 'Sarah Johnson',
          student_avatar: '/avatars/sarah.jpg',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          metadata: {
            subject: 'Mathematics',
            score: 85
          }
        },
        {
          id: '4',
          type: 'warning',
          category: 'payment',
          title: 'Payment Due Soon',
          description: 'Math lesson payment due in 3 days',
          student_name: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          metadata: {
            amount: 120,
            subject: 'Mathematics'
          }
        },
        {
          id: '5',
          type: 'success',
          category: 'achievement',
          title: 'New Achievement Unlocked!',
          description: 'Math Master badge earned',
          student_name: 'Tom Johnson',
          student_avatar: '/avatars/tom.jpg',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '6',
          type: 'info',
          category: 'message',
          title: 'New Message from Tutor',
          description: 'Ms. Chen sent homework feedback',
          student_name: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          metadata: {
            tutor_name: 'Ms. Chen'
          }
        },
        {
          id: '7',
          type: 'success',
          category: 'progress',
          title: 'Assignment Completed',
          description: 'English essay submitted for review',
          student_name: 'Tom Johnson',
          student_avatar: '/avatars/tom.jpg',
          timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
          metadata: {
            subject: 'English Literature'
          }
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActivities(mockActivities)
    } catch (error) {
      console.error('Error loading activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (activity: ActivityData) => {
    switch (activity.category) {
      case 'lesson':
        return <BookOpen className="h-5 w-5" />
      case 'progress':
        return <TrendingUp className="h-5 w-5" />
      case 'payment':
        return <DollarSign className="h-5 w-5" />
      case 'message':
        return <MessageSquare className="h-5 w-5" />
      case 'achievement':
        return <Award className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else {
      return format(date, 'MMM dd, yyyy')
    }
  }

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => activity.category === filter)

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Recent Activities
        </h3>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border rounded-md px-3 py-1"
          >
            <option value="all">All Activities</option>
            <option value="lesson">Lessons</option>
            <option value="progress">Progress</option>
            <option value="payment">Payments</option>
            <option value="achievement">Achievements</option>
          </select>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-500">No recent activities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(
                activity.type
              )}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                    {activity.metadata && (
                      <div className="flex items-center space-x-2 mt-2">
                        {activity.metadata.subject && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.metadata.subject}
                          </Badge>
                        )}
                        {activity.metadata.score && (
                          <Badge variant="outline" className="text-xs">
                            Score: {activity.metadata.score}%
                          </Badge>
                        )}
                        {activity.metadata.amount && (
                          <Badge variant="outline" className="text-xs">
                            ${activity.metadata.amount}
                          </Badge>
                        )}
                        {activity.metadata.tutor_name && (
                          <Badge variant="outline" className="text-xs">
                            {activity.metadata.tutor_name}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end ml-4">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                    {activity.student_avatar && (
                      <Avatar className="h-6 w-6 mt-2">
                        <AvatarImage src={activity.student_avatar} alt={activity.student_name} />
                        <AvatarFallback className="text-xs">
                          {activity.student_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = '/dashboard/parent/activities'}
        >
          View All Activities
        </Button>
      </div>
    </Card>
  )
}