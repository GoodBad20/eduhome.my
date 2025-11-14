'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { parentService, ChildData, AchievementData } from '@/lib/services/parentService'

export default function ProgressPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null)
  const [achievements, setAchievements] = useState<AchievementData[]>([])

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
        loadAchievements(childrenData[0].id)
      }
    } catch (error) {
      console.error('Error loading children:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAchievements = async (childId: string) => {
    try {
      const achievementsData = await parentService.getAchievements(user?.id || '')
      setAchievements(achievementsData)
    } catch (error) {
      console.error('Error loading achievements:', error)
    }
  }

  const handleChildSelect = (child: ChildData) => {
    setSelectedChild(child)
    loadAchievements(child.id)
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
                    <div className="text-3xl font-bold mb-2">{selectedChild.progress || 75}%</div>
                    <p className="text-white opacity-90">Great improvement this month!</p>
                  </div>

                  {/* Next Lesson */}
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Next Lesson</h3>
                      <span className="text-3xl">📅</span>
                    </div>
                    <div className="text-xl font-bold mb-2">Today, 3:00 PM</div>
                    <p className="text-white opacity-90">Mathematics with Ms. Chen</p>
                  </div>

                  {/* Current Grade */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Grade Level</h3>
                      <span className="text-3xl">🎓</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{selectedChild.grade_level}</div>
                    <p className="text-orange-100">On track for promotion</p>
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
                      {selectedChild.subjects?.map((subject, index) => (
                        <div key={subject}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{subject}</span>
                            <span className="text-sm text-gray-500">{65 + index * 10}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${65 + index * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500">No subjects assigned yet</p>
                      )}
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