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
  const [learningInsights, setLearningInsights] = useState({
    mostActiveSubject: 'Mathematics',
    mostActiveSubjectProgress: 0,
    weeklyGoalProgress: {
      current: 0,
      target: 15
    },
    recommendation: 'Start adding activities to see personalized insights'
  })
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
      const [childrenData, activitiesData, achievementsData, insightsData] = await Promise.all([
        parentService.getChildren(user.id),
        parentService.getRecentActivities(user.id),
        parentService.getAchievements(user.id),
        parentService.getLearningInsights(user.id)
      ])

      setChildren(childrenData)
      setRecentActivities(activitiesData)
      setAchievements(achievementsData)
      setLearningInsights(insightsData)
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
      <div className="p-4 sm:p-6">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 blue-primary rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || 'Parent'}! 👋</h1>
              <p className="text-sm sm:text-base md:text-xl opacity-90">
                {children.length > 0
                  ? `Your ${children.length} ${children.length === 1 ? 'child is' : 'children are'} doing amazing! Let's see today's learning adventures`
                  : "Let's get started with your child's learning journey!"
                }
              </p>
            </div>
            <div className="text-4xl sm:text-6xl">🌟</div>
          </div>
        </div>

        {/* Children Cards */}
        {children.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">👨‍👩‍👧‍👦</span> My Children
              </h2>
              <button
                onClick={() => setAddChildModalOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center w-full sm:w-auto justify-center"
              >
                <span className="mr-2">➕</span> Add Child
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onScheduleLesson={handleScheduleLesson}
                  onViewProgress={handleViewProgress}
                  onChildUpdated={loadDashboardData}
                  onChildDeleted={loadDashboardData}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Children State */}
        {children.length === 0 && (
          <div className="mb-6 sm:mb-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
            <div className="text-4xl sm:text-6xl mb-4">👶</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">No Children Added Yet</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Start your learning journey by adding your first child</p>
            <button
              onClick={() => setAddChildModalOpen(true)}
              className="blue-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Upcoming Lessons */}
              <UpcomingLessons parentId={user?.id || ''} />

              {/* Recent Activities */}
              <RecentActivity parentId={user?.id || ''} />
            </div>

            {/* Enhanced Achievements & Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm"
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
                    className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-xs font-medium">Schedule</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/find-tutors'}
                    className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">👨‍🏫</div>
                    <p className="text-xs font-medium">Find Tutors</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/progress'}
                    className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">📊</div>
                    <p className="text-xs font-medium">Progress</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/messages'}
                    className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">💬</div>
                    <p className="text-xs font-medium">Messages</p>
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard/parent/schedule'}
                    className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-xs font-medium">Schedule</p>
                  </button>
                </div>
              </div>

              {/* Learning Insights */}
              <div className="bg-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">💡</span> Learning Insights
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Most Active Subject</span>
                      <span className="text-sm font-bold text-indigo-600">{learningInsights.mostActiveSubject}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${learningInsights.mostActiveSubjectProgress}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Weekly Goal Progress</span>
                      <span className="text-sm font-bold text-green-600">{learningInsights.weeklyGoalProgress.current}/{learningInsights.weeklyGoalProgress.target} hrs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (learningInsights.weeklyGoalProgress.current / learningInsights.weeklyGoalProgress.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">Recommendation</p>
                    <p className="text-xs text-gray-700 mt-1">{learningInsights.recommendation}</p>
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