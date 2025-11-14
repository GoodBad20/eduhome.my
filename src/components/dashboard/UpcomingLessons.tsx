'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock, Video, MessageCircle, User } from 'lucide-react'
import { format } from 'date-fns'

interface UpcomingLessonsProps {
  parentId: string
}

interface LessonData {
  id: string
  student_name: string
  subject: string
  tutor_name: string
  tutor_avatar?: string
  time: string
  duration: string
  status: 'scheduled' | 'completed' | 'cancelled'
  session_link?: string
  materials?: string[]
  type: 'online' | 'in-person'
}

export default function UpcomingLessons({ parentId }: UpcomingLessonsProps) {
  const [lessons, setLessons] = useState<LessonData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUpcomingLessons()
  }, [parentId])

  const loadUpcomingLessons = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // Enhanced mock data with more details
      const mockLessons: LessonData[] = [
        {
          id: '1',
          student_name: 'Sarah Johnson',
          subject: 'Mathematics - Algebra',
          tutor_name: 'Ms. Chen',
          tutor_avatar: '/avatars/chen.jpg',
          time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          duration: '60 min',
          status: 'scheduled',
          session_link: 'https://meet.example.com/session/123',
          materials: ['Algebra Worksheet', 'Graph Paper'],
          type: 'online'
        },
        {
          id: '2',
          student_name: 'Tom Johnson',
          subject: 'Science - Chemistry',
          tutor_name: 'Dr. Smith',
          tutor_avatar: '/avatars/smith.jpg',
          time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          duration: '45 min',
          status: 'scheduled',
          session_link: 'https://meet.example.com/session/124',
          materials: ['Lab Safety Guide'],
          type: 'online'
        },
        {
          id: '3',
          student_name: 'Sarah Johnson',
          subject: 'English Literature',
          tutor_name: 'Ms. Davis',
          tutor_avatar: '/avatars/davis.jpg',
          time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          duration: '60 min',
          status: 'scheduled',
          materials: ['Essay Assignment', 'Reading Materials'],
          type: 'in-person'
        }
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLessons(mockLessons)
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinSession = (sessionLink: string) => {
    window.open(sessionLink, '_blank')
  }

  const handleMessageTutor = (tutorName: string) => {
    // TODO: Implement message functionality
    window.location.href = `/dashboard/parent/messages?tutor=${tutorName}`
  }

  const formatLessonTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `Today, ${format(date, 'h:mm a')}`
    } else if (diffInHours < 48) {
      return `Tomorrow, ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'EEEE, h:mm a')
    }
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
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
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Lessons
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/dashboard/parent/schedule'}
        >
          View Schedule
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-500">No upcoming lessons scheduled</p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/dashboard/parent/find-tutors'}
          >
            Find Tutors
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={lesson.tutor_avatar} alt={lesson.tutor_name} />
                    <AvatarFallback>
                      {lesson.tutor_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{lesson.subject}</h4>
                    <p className="text-sm text-gray-600">{lesson.student_name}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(lesson.status)}>
                  {lesson.status}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{lesson.tutor_name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatLessonTime(lesson.time)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {lesson.type === 'online' ? (
                    <Video className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-green-600" />
                  )}
                  <span>{lesson.type === 'online' ? 'Online' : 'In-person'}</span>
                </div>
              </div>

              {lesson.materials && lesson.materials.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Materials:</p>
                  <div className="flex flex-wrap gap-1">
                    {lesson.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {lesson.session_link && lesson.type === 'online' && (
                  <Button
                    size="sm"
                    onClick={() => handleJoinSession(lesson.session_link!)}
                    className="flex items-center space-x-1"
                  >
                    <Video className="h-4 w-4" />
                    <span>Join Session</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMessageTutor(lesson.tutor_name)}
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.location.href = `/dashboard/parent/progress?student=${lesson.student_name}`}
                >
                  View Progress
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}