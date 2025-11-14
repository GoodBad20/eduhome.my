'use client'

import { useState, useEffect } from 'react'
import { ChildData } from '@/lib/services/parentService'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  Star,
  AlertCircle,
  CalendarDays
} from 'lucide-react'

interface ChildCardProps {
  child: ChildData
  onScheduleLesson: (childId: string) => void
  onViewProgress: (childId: string) => void
  onMessageTutor?: (childId: string) => void
  onManageSchedule?: (childId: string) => void
}

interface ChildStats {
  weeklyHours: number
  completedLessons: number
  averageGrade: number
  streakDays: number
  upcomingLessons: number
  lastActive: string
}

export default function ChildCard({ child, onScheduleLesson, onViewProgress, onMessageTutor, onManageSchedule }: ChildCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [stats, setStats] = useState<ChildStats>({
    weeklyHours: 0,
    completedLessons: 0,
    averageGrade: 0,
    streakDays: 0,
    upcomingLessons: 0,
    lastActive: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadChildStats()
  }, [child.id])

  const loadChildStats = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockStats: ChildStats = {
        weeklyHours: 6,
        completedLessons: 24,
        averageGrade: 85,
        streakDays: 5,
        upcomingLessons: 3,
        lastActive: '2 hours ago'
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading child stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvatarFromName = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getAgeFromBirthDate = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const age = getAgeFromBirthDate(child.date_of_birth)

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Header Section - Compact */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={child.avatar_url || undefined} alt={child.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {getAvatarFromName(child.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 truncate">{child.name}</h3>
            <p className="text-xs text-gray-600 truncate">{age}y • {child.grade_level}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-green-600">{child.progress}%</div>
          <div className="text-xs text-gray-500">Progress</div>
        </div>
      </div>

      {/* Progress Bar - Compact */}
      <div className="mb-3">
        <Progress
          value={child.progress}
          className="h-2"
          // @ts-ignore - custom prop for color
          indicatorClassName={getProgressColor(child.progress)}
        />
      </div>

      {/* Stats Overview - Compact */}
      {!loading && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-blue-50 rounded p-2 text-center">
            <Clock className="h-3 w-3 mx-auto mb-1 text-blue-700" />
            <div className="text-sm font-semibold text-blue-700">{stats.weeklyHours}h</div>
            <div className="text-xs text-gray-700">Week</div>
          </div>
          <div className="bg-green-50 rounded p-2 text-center">
            <BookOpen className="h-3 w-3 mx-auto mb-1 text-green-700" />
            <div className="text-sm font-semibold text-green-700">{stats.completedLessons}</div>
            <div className="text-xs text-gray-700">Lessons</div>
          </div>
          <div className="bg-purple-50 rounded p-2 text-center">
            <Star className="h-3 w-3 mx-auto mb-1 text-purple-700" />
            <div className="text-sm font-semibold text-purple-700">{stats.averageGrade}%</div>
            <div className="text-xs text-gray-700">Grade</div>
          </div>
        </div>
      )}

      {/* Current Subjects - Compact */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {child.subjects?.slice(0, 2).map((subject, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs text-gray-700 bg-gray-100">
              {subject}
            </Badge>
          ))}
          {child.subjects && child.subjects.length > 2 && (
            <Badge variant="outline" className="text-xs text-gray-700 border-gray-300">
              +{child.subjects.length - 2}
            </Badge>
          )}
        </div>
      </div>

      {/* Next Lesson Alert - Compact */}
      {child.next_lesson && (
        <div className="bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded mb-3">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 text-yellow-700 mr-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{child.next_lesson}</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Streak - Compact */}
      {stats.streakDays > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-2 rounded mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-3 w-3 text-orange-700 mr-1 flex-shrink-0" />
              <span className="text-xs text-gray-800">{stats.streakDays} day streak</span>
            </div>
            <span className="text-sm">🔥</span>
          </div>
        </div>
      )}

      {/* Action Buttons - Compact */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Button
          onClick={() => onViewProgress(child.id)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs"
          size="sm"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Progress
        </Button>
        <Button
          onClick={() => onScheduleLesson(child.id)}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-xs"
          size="sm"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Schedule
        </Button>
      </div>

      {/* Quick Actions - Compact */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs text-gray-700 border-gray-300 hover:bg-gray-50"
          onClick={() => onMessageTutor?.(child.id)}
        >
          Message
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-700 px-2 hover:bg-gray-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲' : '▼'}
        </Button>
      </div>

      {/* Expanded Details - Compact */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-700">Upcoming</span>
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">{stats.upcomingLessons} lessons</Badge>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-700">Last Active</span>
            <span className="text-gray-900">{stats.lastActive}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="text-xs text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => window.location.href = `/dashboard/parent/progress?child=${child.id}`}
            >
              Progress
            </Button>
            <Button
              variant="outline"
              className="text-xs text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => onManageSchedule?.(child.id)}
            >
              <CalendarDays className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}