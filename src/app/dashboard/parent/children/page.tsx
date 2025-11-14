'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ChildCard from '@/components/dashboard/ChildCard'
import ScheduleLessonModal from '@/components/dashboard/ScheduleLessonModal'
import AddChildModal from '@/components/dashboard/AddChildModal'
import { parentService, ChildData } from '@/lib/services/parentService'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  Plus,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  Star,
  BookOpen,
  Baby,
  GraduationCap,
  Target,
  Zap
} from 'lucide-react'

export default function ChildrenPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [addChildModalOpen, setAddChildModalOpen] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string>('')

  useEffect(() => {
    if (user) {
      loadChildren()
    }
  }, [user])

  const loadChildren = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const childrenData = await parentService.getChildren(user.id)
      setChildren(childrenData)
    } catch (error) {
      console.error('Error loading children:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleLesson = (childId: string) => {
    setSelectedChildId(childId)
    setScheduleModalOpen(true)
  }

  const handleViewProgress = (childId: string) => {
    // Navigate to progress page
    window.location.href = `/dashboard/parent/progress?child=${childId}`
  }

  const handleManageSchedule = (childId: string) => {
    // Navigate to schedule page with child selected
    window.location.href = `/dashboard/parent/schedule?child=${childId}`
  }

  const handleLessonScheduled = () => {
    loadChildren()
  }

  const getSelectedChildName = () => {
    const child = children.find(c => c.id === selectedChildId)
    return child?.name || ''
  }

  const calculateFamilyStats = () => {
    const totalProgress = children.reduce((sum, child) => sum + (child.progress || 0), 0)
    const avgProgress = children.length > 0 ? Math.round(totalProgress / children.length) : 0
    const activeLessons = children.length * 3 // Mock calculation
    const weeklyHours = children.length * 6 // Mock calculation

    return {
      avgProgress,
      activeLessons,
      weeklyHours,
      totalChildren: children.length
    }
  }

  const stats = calculateFamilyStats()

  if (loading) {
    return (
      <DashboardLayout userRole="parent">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading your children...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="parent">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header Section - Compact */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 md:h-8 md:w-8" />
                <div>
                  <h1 className="text-xl md:text-3xl font-bold">My Children</h1>
                  <p className="text-xs md:text-sm text-white opacity-90 hidden md:block">
                    Manage your children's learning journey and celebrate their achievements
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl md:text-3xl font-bold">{stats.totalChildren}</div>
                <div className="text-xs md:text-sm text-white">Active Learners</div>
              </div>
            </div>
          </div>

          {/* Stats Dashboard - Compact */}
          {children.length > 0 && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white opacity-90">Family Avg</p>
                    <p className="text-lg font-bold">{stats.avgProgress}%</p>
                  </div>
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white opacity-90">Lessons</p>
                    <p className="text-lg font-bold">{stats.activeLessons}</p>
                  </div>
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white opacity-90">Hours</p>
                    <p className="text-lg font-bold">{stats.weeklyHours}h</p>
                  </div>
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white opacity-90">Awards</p>
                    <p className="text-lg font-bold">🏆</p>
                  </div>
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-white opacity-80" />
                </div>
              </div>
            </div>
          )}

          {/* Action Bar - Compact */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl shadow gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Learning Hub</h2>
                <p className="text-xs md:text-sm text-gray-600 hidden md:block">Monitor progress and schedule lessons</p>
              </div>
            </div>
            <Button
              onClick={() => setAddChildModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-medium shadow flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Child</span>
            </Button>
          </div>

          {/* Children Grid */}
          {children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onScheduleLesson={handleScheduleLesson}
                  onViewProgress={handleViewProgress}
                  onManageSchedule={handleManageSchedule}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
              <div className="mb-4">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full inline-block">
                  <Baby className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Start Your Learning Journey</h3>
              <p className="text-sm text-gray-600 mb-4 md:mb-6 max-w-md mx-auto">
                Add your first child to begin tracking their educational progress and celebrate achievements together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setAddChildModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-lg font-medium shadow flex items-center space-x-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Child</span>
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-2 rounded-lg text-sm border-2 border-gray-300 hover:border-gray-400"
                  onClick={() => window.location.href = '/dashboard/parent/tutors'}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Find Tutors
                </Button>
              </div>
            </div>
          )}

          {/* Quick Stats for Empty State - Compact */}
          {children.length === 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white text-center p-4 rounded-lg border border-gray-200">
                <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                <h4 className="text-sm font-semibold text-gray-800">Quick Setup</h4>
                <p className="text-xs text-gray-600">Add children in under 2 minutes</p>
              </div>
              <div className="bg-white text-center p-4 rounded-lg border border-gray-200">
                <Award className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                <h4 className="text-sm font-semibold text-gray-800">Track Progress</h4>
                <p className="text-xs text-gray-600">Monitor learning achievements</p>
              </div>
              <div className="bg-white text-center p-4 rounded-lg border border-gray-200">
                <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <h4 className="text-sm font-semibold text-gray-800">Easy Scheduling</h4>
                <p className="text-xs text-gray-600">Book lessons with top tutors</p>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Lesson Modal */}
        <ScheduleLessonModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          childId={selectedChildId}
          childName={getSelectedChildName()}
          onLessonScheduled={handleLessonScheduled}
        />

        {/* Add Child Modal */}
        <AddChildModal
          isOpen={addChildModalOpen}
          onClose={() => setAddChildModalOpen(false)}
          parentId={user?.id || ''}
          onChildAdded={() => {
            loadChildren()
            setAddChildModalOpen(false)
          }}
        />
      </div>
    </DashboardLayout>
  )
}