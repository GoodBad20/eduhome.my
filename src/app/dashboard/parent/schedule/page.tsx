'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, BookOpen, Coffee, GamepadIcon, Moon, Sun, Calendar, Edit, Trash2 } from 'lucide-react'

interface ScheduleItem {
  id: string
  child_id: string
  title: string
  type: 'lesson' | 'study' | 'rest' | 'play' | 'meal' | 'sleep' | 'other'
  start_time: string
  end_time: string
  day_of_week: number // 0-6 (Sunday to Saturday)
  description?: string
  recurring: boolean
  color?: string
}

interface ChildSchedule {
  childId: string
  childName: string
  schedule: ScheduleItem[]
}

export default function ParentSchedulePage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildSchedule[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const scheduleTypes = [
    { value: 'lesson', label: 'Lesson', icon: BookOpen, color: 'bg-blue-500' },
    { value: 'study', label: 'Study', icon: BookOpen, color: 'bg-purple-500' },
    { value: 'rest', label: 'Rest', icon: Coffee, color: 'bg-green-500' },
    { value: 'play', label: 'Play', icon: GamepadIcon, color: 'bg-yellow-500' },
    { value: 'meal', label: 'Meal', icon: Coffee, color: 'bg-orange-500' },
    { value: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-indigo-500' },
    { value: 'other', label: 'Other', icon: Clock, color: 'bg-gray-500' }
  ]

  useEffect(() => {
    if (user) {
      loadChildren()
    }
  }, [user])

  const loadChildren = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockChildrenSchedules: ChildSchedule[] = [
        {
          childId: '1',
          childName: 'Sarah Johnson',
          schedule: [
            {
              id: '1',
              child_id: '1',
              title: 'Wake Up & Breakfast',
              type: 'meal',
              start_time: '07:00',
              end_time: '08:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-orange-100 border-orange-300'
            },
            {
              id: '2',
              child_id: '1',
              title: 'Mathematics Lesson',
              type: 'lesson',
              start_time: '09:00',
              end_time: '10:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-blue-100 border-blue-300'
            },
            {
              id: '3',
              child_id: '1',
              title: 'Playtime',
              type: 'play',
              start_time: '10:00',
              end_time: '11:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-yellow-100 border-yellow-300'
            },
            {
              id: '4',
              child_id: '1',
              title: 'Science Study',
              type: 'study',
              start_time: '11:00',
              end_time: '12:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-purple-100 border-purple-300'
            },
            {
              id: '5',
              child_id: '1',
              title: 'Lunch',
              type: 'meal',
              start_time: '12:00',
              end_time: '13:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-orange-100 border-orange-300'
            },
            {
              id: '6',
              child_id: '1',
              title: 'Nap Time',
              type: 'rest',
              start_time: '13:30',
              end_time: '14:30',
              day_of_week: 1,
              recurring: true,
              color: 'bg-green-100 border-green-300'
            },
            {
              id: '7',
              child_id: '1',
              title: 'English Lesson',
              type: 'lesson',
              start_time: '15:00',
              end_time: '16:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-blue-100 border-blue-300'
            },
            {
              id: '8',
              child_id: '1',
              title: 'Outdoor Play',
              type: 'play',
              start_time: '16:00',
              end_time: '17:30',
              day_of_week: 1,
              recurring: true,
              color: 'bg-yellow-100 border-yellow-300'
            },
            {
              id: '9',
              child_id: '1',
              title: 'Dinner',
              type: 'meal',
              start_time: '18:00',
              end_time: '19:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-orange-100 border-orange-300'
            },
            {
              id: '10',
              child_id: '1',
              title: 'Bedtime',
              type: 'sleep',
              start_time: '20:00',
              end_time: '21:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-indigo-100 border-indigo-300'
            }
          ]
        },
        {
          childId: '2',
          childName: 'Tom Johnson',
          schedule: [
            {
              id: '11',
              child_id: '2',
              title: 'Wake Up & Breakfast',
              type: 'meal',
              start_time: '07:30',
              end_time: '08:30',
              day_of_week: 1,
              recurring: true,
              color: 'bg-orange-100 border-orange-300'
            },
            {
              id: '12',
              child_id: '2',
              title: 'Science Lesson',
              type: 'lesson',
              start_time: '10:00',
              end_time: '11:00',
              day_of_week: 1,
              recurring: true,
              color: 'bg-blue-100 border-blue-300'
            }
          ]
        }
      ]
      setChildren(mockChildrenSchedules)
      if (mockChildrenSchedules.length > 0) {
        setSelectedChild(mockChildrenSchedules[0].childId)
      }
    } catch (error) {
      console.error('Error loading schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentChildSchedule = () => {
    const child = children.find(c => c.childId === selectedChild)
    return child?.schedule.filter(item => item.day_of_week === selectedDay) || []
  }

  const getTypeIcon = (type: string) => {
    const scheduleType = scheduleTypes.find(t => t.value === type)
    return scheduleType?.icon || Clock
  }

  const getTypeColor = (type: string) => {
    const scheduleType = scheduleTypes.find(t => t.value === type)
    return scheduleType?.color || 'bg-gray-500'
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = startTime.split(':').map(Number)
    const end = endTime.split(':').map(Number)
    const startMinutes = start[0] * 60 + start[1]
    const endMinutes = end[0] * 60 + end[1]
    const duration = endMinutes - startMinutes
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const handleAddSchedule = () => {
    setEditingItem(null)
    setShowAddModal(true)
  }

  const handleEditSchedule = (item: ScheduleItem) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  const handleDeleteSchedule = (itemId: string) => {
    // Mock delete - replace with actual API call
    setChildren(prev => prev.map(child => ({
      ...child,
      schedule: child.schedule.filter(item => item.id !== itemId)
    })))
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

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

  const currentSchedule = getCurrentChildSchedule()

  return (
    <DashboardLayout userRole="parent">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Schedule</h1>
          <p className="text-gray-600">Create and manage daily timetables for your children's lessons, rest, and playtime</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Child Selector */}
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Child</label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {children.map(child => (
                  <option key={child.childId} value={child.childId}>
                    {child.childName}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Day Selector */}
          <Card>
            <CardContent className="p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {weekDays.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{currentSchedule.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Add Schedule Button */}
          <Card>
            <CardContent className="p-4">
              <Button
                onClick={handleAddSchedule}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {children.find(c => c.childId === selectedChild)?.childName}'s Schedule - {weekDays[selectedDay]}
              </span>
              <Button variant="outline" size="sm">
                Copy to All Days
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSchedule.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities scheduled</h3>
                <p className="text-gray-600 mb-4">Start planning your child's day by adding activities</p>
                <Button onClick={handleAddSchedule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSchedule
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((item) => {
                    const Icon = getTypeIcon(item.type)
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 ${item.color} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(item.type)} bg-opacity-20`}>
                              <Icon className={`h-4 w-4 ${getTypeColor(item.type).replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600">
                                {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                ({calculateDuration(item.start_time, item.end_time)})
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.recurring && (
                              <Badge variant="secondary" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSchedule(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSchedule(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Templates */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Study Focus</h3>
                    <p className="text-sm text-gray-600">Academic priority schedule</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Apply Template</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <GamepadIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Balanced Day</h3>
                    <p className="text-sm text-gray-600">Equal study and play time</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Apply Template</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Sun className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Active Child</h3>
                    <p className="text-sm text-gray-600">Lots of outdoor activities</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Apply Template</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Schedule Modal */}
      {showAddModal && (
        <ScheduleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          childId={selectedChild}
          dayOfWeek={selectedDay}
          editingItem={editingItem}
          onSave={(item) => {
            // Handle save logic
            setShowAddModal(false)
            loadChildren()
          }}
        />
      )}
    </DashboardLayout>
  )
}

// Schedule Modal Component
function ScheduleModal({ isOpen, onClose, childId, dayOfWeek, editingItem, onSave }: any) {
  const [formData, setFormData] = useState({
    title: editingItem?.title || '',
    type: editingItem?.type || 'lesson',
    start_time: editingItem?.start_time || '09:00',
    end_time: editingItem?.end_time || '10:00',
    description: editingItem?.description || '',
    recurring: editingItem?.recurring || true
  })

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const scheduleTypes = [
    { value: 'lesson', label: 'Lesson', icon: '📚' },
    { value: 'study', label: 'Study', icon: '📖' },
    { value: 'rest', label: 'Rest', icon: '☕' },
    { value: 'play', label: 'Play', icon: '🎮' },
    { value: 'meal', label: 'Meal', icon: '🍽️' },
    { value: 'sleep', label: 'Sleep', icon: '😴' },
    { value: 'other', label: 'Other', icon: '⏰' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      child_id: childId,
      day_of_week: dayOfWeek,
      id: editingItem?.id || Date.now().toString()
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {editingItem ? 'Edit Activity' : 'Add Activity'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mathematics Lesson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {scheduleTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any notes about this activity"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
              Repeat every {weekDays[dayOfWeek]}
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? 'Update' : 'Add'} Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}