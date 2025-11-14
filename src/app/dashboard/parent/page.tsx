'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ChildCard from '@/components/dashboard/ChildCard'
import ScheduleLessonModal from '@/components/dashboard/ScheduleLessonModal'
import AddChildModal from '@/components/dashboard/AddChildModal'
import StatsOverview from '@/components/dashboard/StatsOverview'
import UpcomingLessons from '@/components/dashboard/UpcomingLessons'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { parentService, ChildData, ActivityData, AchievementData } from '@/lib/services/parentService'

export default function ParentDashboard() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([])
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [addChildModalOpen, setAddChildModalOpen] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string>('')

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      // Load all data in parallel
      const [childrenData, activitiesData, achievementsData] = await Promise.all([
        parentService.getChildren(user.id),
        parentService.getRecentActivities(user.id),
        parentService.getAchievements(user.id)
      ])

      setChildren(childrenData)
      setRecentActivities(activitiesData)
      setAchievements(achievementsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleLesson = (childId: string) => {
    setSelectedChildId(childId)
    setScheduleModalOpen(true)
  }

  const handleViewProgress = (childId: string) => {
    // Navigate to progress page or show progress modal
    console.log('View progress for child:', childId)
    // TODO: Implement progress view
  }

  const handleLessonScheduled = () => {
    // Refresh activities and lessons data
    loadDashboardData()
  }

  const getSelectedChildName = () => {
    const child = children.find(c => c.id === selectedChildId)
    return child?.name || ''
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
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || 'Parent'}! 👋</h1>
              <p className="text-xl opacity-90">
                {children.length > 0
                  ? `Your ${children.length} ${children.length === 1 ? 'child is' : 'children are'} doing amazing! Let's see today's learning adventures`
                  : "Let's get started with your child's learning journey!"
                }
              </p>
            </div>
            <div className="text-6xl">🌟</div>
          </div>
        </div>

        {/* Children Cards */}
        {children.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">👨‍👩‍👧‍👦</span> My Children
              </h2>
              <button
                onClick={() => setAddChildModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-colors flex items-center"
              >
                <span className="mr-2">➕</span> Add Child
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onScheduleLesson={handleScheduleLesson}
                  onViewProgress={handleViewProgress}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Children State */}
        {children.length === 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Children Added Yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by adding your first child</p>
            <button
              onClick={() => setAddChildModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Add Your First Child ➕
            </button>
          </div>
        )}

        {/* Enhanced Dashboard Components */}
        {children.length > 0 && (
          <>
            {/* Stats Overview */}
            <StatsOverview parentId={user?.id || ''} />

            {/* Two Column Layout for Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Upcoming Lessons */}
              <UpcomingLessons parentId={user?.id || ''} />

              {/* Recent Activities */}
              <RecentActivity parentId={user?.id || ''} />
            </div>

            {/* Enhanced Achievements & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enhanced Achievements */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🏆</span> Recent Achievements
                </h2>
                <div className="space-y-3">
                  {achievements.slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className={`flex items-center p-3 rounded-xl transition-all hover:shadow-md ${
                      achievement.earned ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50 opacity-60'
                    }`}>
                      <div className="text-2xl mr-3">{achievement.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <div className="text-green-500 text-lg">✓</div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.location.href = '/dashboard/parent/progress'}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-colors text-sm"
                >
                  View All Achievements 🎯
                </button>
              </div>

              {/* Enhanced Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🚀</span> Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => children[0] && handleScheduleLesson(children[0].id)}
                    className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-xs font-medium">Schedule</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/find-tutors'}
                    className="p-4 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl hover:from-green-600 hover:to-green-800 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">👨‍🏫</div>
                    <p className="text-xs font-medium">Find Tutors</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/progress'}
                    className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">📊</div>
                    <p className="text-xs font-medium">Progress</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/messages'}
                    className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">💬</div>
                    <p className="text-xs font-medium">Messages</p>
                  </button>
                </div>
              </div>

              {/* Learning Insights */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">💡</span> Learning Insights
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Most Active Subject</span>
                      <span className="text-sm font-bold text-indigo-600">Mathematics</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Weekly Goal Progress</span>
                      <span className="text-sm font-bold text-green-600">12/15 hrs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Recommendation</p>
                    <p className="text-xs text-gray-600 mt-1">Consider adding more Science sessions to balance the curriculum</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
            loadDashboardData()
            setAddChildModalOpen(false)
          }}
        />
      </div>
    </DashboardLayout>
  )
}