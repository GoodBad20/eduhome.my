'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { parentService, ChildData, AchievementData } from '@/lib/services/parentService'
import { TrendingUp, TrendingDown, Minus, Target, Award, Clock, BookOpen } from 'lucide-react'

export default function ProgressPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null)
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [childProgress, setChildProgress] = useState<any>(null)

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
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0])
        await loadChildProgress(childrenData[0].id)
        loadAchievements(user?.id || '')
      }
    } catch (error) {
      console.error('Error loading children:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChildProgress = async (childId: string) => {
    try {
      const progressData = await parentService.getChildProgress(childId)
      setChildProgress(progressData)
    } catch (error) {
      console.error('Error loading child progress:', error)
    }
  }

  const loadAchievements = async (parentId: string) => {
    try {
      const achievementsData = await parentService.getAchievements(parentId)
      setAchievements(achievementsData)
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  const handleChildSelect = async (child: ChildData) => {
    setSelectedChild(child)
    await loadChildProgress(child.id)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
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
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your children's learning progress and achievements</p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Children to Track</h3>
            <p className="text-gray-600 mb-6">Add children to start tracking their learning progress</p>
            <button
              onClick={() => window.location.href = '/dashboard/parent/children'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Add Children
            </button>
          </div>
        ) : (
          <>
            {/* Child Selector */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedChild?.id === child.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">👤</span>
                      {child.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedChild && (
              <>
                {/* Progress Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Overall Progress */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Overall Progress</h3>
                      <span className="text-3xl">📈</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{childProgress?.overall_progress || 0}%</div>
                    <p className="text-white opacity-90">{childProgress?.next_milestone || 'Keep up the great work!'}</p>
                  </div>

                  {/* Assignment Stats */}
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Assignments</h3>
                      <span className="text-3xl">📝</span>
                    </div>
                    <div className="text-xl font-bold mb-2">{childProgress?.assignment_stats?.average_score || 0}% Avg</div>
                    <p className="text-white opacity-90">
                      {childProgress?.assignment_stats?.completed || 0}/{childProgress?.assignment_stats?.total || 0} completed
                    </p>
                  </div>

                  {/* Activity Performance */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Activities</h3>
                      <span className="text-3xl">⭐</span>
                    </div>
                    <div className="text-xl font-bold mb-2">{childProgress?.activity_stats?.attendance_rate || 0}% Rate</div>
                    <p className="text-white opacity-90">
                      {childProgress?.activity_stats?.completed_activities || 0}/{childProgress?.activity_stats?.total_activities || 0} completed
                    </p>
                  </div>
                </div>

                {/* Subject Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">📚</span>
                      Subject Progress
                    </h3>
                    <div className="space-y-4">
                      {Object.keys(childProgress?.subject_progress || {}).length > 0 ? (
                        Object.entries(childProgress.subject_progress).map(([subject, progress]) => (
                          <div key={subject}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{subject}</span>
                              <span className="text-sm text-gray-500">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No subject data available yet</p>
                      )}
                    </div>
                  </div>

                  {/* Performance Trends */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">📊</span>
                      Performance Trends
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTrendIcon(childProgress?.recent_performance?.trend || 'stable')}
                          <div>
                            <p className="font-medium text-gray-900">Recent Performance</p>
                            <p className="text-sm text-gray-600">
                              {childProgress?.recent_performance?.trend === 'improving' ? 'Improving' :
                               childProgress?.recent_performance?.trend === 'declining' ? 'Declining' : 'Stable'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {childProgress?.recent_performance?.score_change > 0 ? '+' : ''}
                            {childProgress?.recent_performance?.score_change || 0}%
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <p className="font-medium text-blue-900">Most Active Subject</p>
                        </div>
                        <p className="text-blue-800">
                          {childProgress?.activity_stats?.most_active_subject || 'Mathematics'}
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Award className="h-5 w-5 text-green-600" />
                          <p className="font-medium text-green-900">Pending Assignments</p>
                        </div>
                        <p className="text-green-800">
                          {childProgress?.assignment_stats?.pending || 0} assignments to complete
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🏆</span>
                      Recent Achievements
                    </h3>
                    <div className="space-y-3">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className={`flex items-center p-3 rounded-xl ${
                          achievement.earned ? 'bg-purple-50' : 'bg-gray-50 opacity-60'
                        }`}>
                          <div className="text-2xl mr-3">{achievement.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{achievement.title}</p>
                            <p className="text-xs text-gray-600">{achievement.description}</p>
                          </div>
                          {achievement.earned && (
                            <div className="text-green-500 text-xl">✓</div>
                          )}
                        </div>
                      )) || (
                        <p className="text-gray-500">No achievements yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}