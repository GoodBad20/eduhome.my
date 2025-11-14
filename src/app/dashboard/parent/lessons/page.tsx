'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, Star, Video, MapPin } from 'lucide-react'

export default function ParentLessonsPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      loadLessons()
    }
  }, [user])

  const loadLessons = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockLessons = [
        {
          id: '1',
          subject: 'Mathematics',
          tutor_name: 'Ms. Chen',
          student_name: 'Sarah Johnson',
          scheduled_time: '2024-11-13T15:00:00Z',
          duration: 60,
          status: 'scheduled',
          type: 'online',
          price: 45,
          rating: 4.8
        },
        {
          id: '2',
          subject: 'Science',
          tutor_name: 'Dr. Smith',
          student_name: 'Tom Johnson',
          scheduled_time: '2024-11-14T16:30:00Z',
          duration: 45,
          status: 'scheduled',
          type: 'in-person',
          price: 50,
          rating: 4.9
        },
        {
          id: '3',
          subject: 'English',
          tutor_name: 'Ms. Davis',
          student_name: 'Sarah Johnson',
          scheduled_time: '2024-11-12T14:00:00Z',
          duration: 60,
          status: 'completed',
          type: 'online',
          price: 40,
          rating: 4.7
        }
      ]
      setLessons(mockLessons)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="h-4 w-4" />
      case 'completed':
        return <Star className="h-4 w-4" />
      case 'cancelled':
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <DashboardLayout userRole="parent">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="parent">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Schedule</h1>
          <p className="text-gray-600">Manage and track your children's upcoming and completed lessons</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Star className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">$135</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lesson.subject}</CardTitle>
                      <p className="text-sm text-gray-600">{lesson.student_name}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(lesson.status)}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(lesson.status)}
                      <span className="capitalize">{lesson.status}</span>
                    </span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{lesson.tutor_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{lesson.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.type === 'online' ? (
                      <Video className="h-4 w-4 text-gray-400" />
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700 capitalize">{lesson.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{lesson.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(lesson.scheduled_time)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${lesson.price}</p>
                    <Button size="sm" className="mt-1">
                      {lesson.status === 'scheduled' ? 'Join Lesson' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule New Lesson Button */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule New Lesson
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}