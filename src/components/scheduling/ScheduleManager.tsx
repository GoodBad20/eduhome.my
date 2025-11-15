'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Plus, Filter, ChevronLeft, ChevronRight, View, Check, X, Bell, Repeat, MapPin, User, Edit, Trash2 } from 'lucide-react'
import { ChildData, ScheduleActivity, ActivityType } from '@/lib/services/parentService'
import { parentService } from '@/lib/services/parentService'
import CreateActivityModal from './CreateActivityModal'
import EditActivityModal from './EditActivityModal'

type ViewMode = 'day' | 'week' | 'month'
type FilterOption = 'all' | 'academic' | 'extracurricular' | 'personal' | 'health' | 'social'

interface ScheduleManagerProps {
  children: ChildData[]
  selectedChildId?: string
}

export default function ScheduleManager({ children, selectedChildId }: ScheduleManagerProps) {
  const [activities, setActivities] = useState<ScheduleActivity[]>([])
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [filterCategory, setFilterCategory] = useState<FilterOption>('all')
  const [selectedChild, setSelectedChild] = useState<string>(selectedChildId || '')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadScheduleData()
  }, [currentDate, viewMode, selectedChild, filterCategory])

  const loadScheduleData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [activityTypesData, scheduleData] = await Promise.all([
        parentService.getActivityTypes(),
        loadSchedule()
      ])

      setActivityTypes(activityTypesData)
      setActivities(scheduleData)
    } catch (error) {
      setError('Failed to load schedule data')
      console.error('Error loading schedule data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSchedule = async (): Promise<ScheduleActivity[]> => {
    const startDate = getStartDate()
    const endDate = getEndDate()

    if (selectedChild) {
      return await parentService.getChildSchedule(selectedChild, startDate, endDate)
    } else {
      // For family view, we need the parent ID - for now return empty
      return []
    }
  }

  const getStartDate = (): string => {
    const date = new Date(currentDate)

    switch (viewMode) {
      case 'day':
        return date.toISOString().split('T')[0]
      case 'week':
        const dayOfWeek = date.getDay()
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Start from Monday
        date.setDate(diff)
        return date.toISOString().split('T')[0]
      case 'month':
        date.setDate(1)
        return date.toISOString().split('T')[0]
      default:
        return date.toISOString().split('T')[0]
    }
  }

  const getEndDate = (): string => {
    const date = new Date(currentDate)

    switch (viewMode) {
      case 'day':
        return date.toISOString().split('T')[0]
      case 'week':
        const dayOfWeek = date.getDay()
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 7) // End on Sunday
        date.setDate(diff)
        return date.toISOString().split('T')[0]
      case 'month':
        date.setMonth(date.getMonth() + 1, 0) // Last day of current month
        return date.toISOString().split('T')[0]
      default:
        return date.toISOString().split('T')[0]
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filterCategory === 'all') return true
    return activity.activity_type?.category === filterCategory
  })

  const handleCreateActivity = () => {
    setCreateModalOpen(true)
  }

  const handleEditActivity = (activity: ScheduleActivity) => {
    setSelectedActivity(activity)
    setEditModalOpen(true)
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    try {
      await parentService.deleteScheduleActivity(activityId)
      loadScheduleData()
    } catch (error) {
      setError('Failed to delete activity')
    }
  }

  const handleActivityCreated = () => {
    setCreateModalOpen(false)
    loadScheduleData()
  }

  const handleActivityUpdated = () => {
    setEditModalOpen(false)
    setSelectedActivity(null)
    loadScheduleData()
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)

    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
    }

    setCurrentDate(newDate)
  }

  const formatCurrentDate = (): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', options)
      case 'week':
        const startDate = getStartDate()
        const endDate = getEndDate()
        return `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      default:
        return currentDate.toLocaleDateString('en-US', options)
    }
  }

  const getTimeSlots = (): string[] => {
    const slots = []
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const renderHeader = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        {/* Title and Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{formatCurrentDate()}</h2>
            <p className="text-sm text-gray-600">
              {filteredActivities.length} activity{filteredActivities.length !== 1 ? 'ies' : ''}
            </p>
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Child Selector */}
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Children</option>
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="extracurricular">Extracurricular</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="social">Social</option>
          </select>

          {/* Create Button */}
          <button
            onClick={handleCreateActivity}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </button>
        </div>
      </div>
    </div>
  )

  const renderDayView = () => {
    const timeSlots = getTimeSlots()
    const todayActivities = filteredActivities.filter(activity =>
      activity.date === currentDate.toISOString().split('T')[0]
    )

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map(timeSlot => {
            const slotActivities = todayActivities.filter(activity =>
              activity.start_time <= timeSlot && activity.end_time > timeSlot
            )

            return (
              <div key={timeSlot} className="flex border-b border-gray-100">
                <div className="w-20 py-3 px-4 text-sm text-gray-500 font-medium border-r border-gray-100">
                  {timeSlot}
                </div>
                <div className="flex-1 py-2 px-4 min-h-[60px]">
                  {slotActivities.length === 0 ? (
                    <div className="h-full flex items-center">
                      <button
                        onClick={() => {
                          // Pre-fill time when creating activity
                          setCreateModalOpen(true)
                        }}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        + Add activity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {slotActivities.map(activity => (
                        <div
                          key={activity.id}
                          className="p-3 rounded-lg border-l-4 relative group"
                          style={{
                            backgroundColor: `${activity.activity_type?.color}20`,
                            borderColor: activity.activity_type?.color,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{activity.activity_type?.icon}</span>
                                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                {activity.is_recurring && <Repeat className="h-3 w-3 text-gray-500" />}
                                {activity.priority === 'high' && <Bell className="h-3 w-3 text-red-500" />}
                              </div>
                              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.start_time} - {activity.end_time}
                                </span>
                                {activity.location && (
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {activity.location}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {activity.child_name}
                                </span>
                              </div>
                              {activity.description && (
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditActivity(activity)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="p-1 hover:bg-red-100 rounded text-red-500"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = []
    const startDate = new Date(getStartDate())

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      weekDays.push(date)
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 text-center text-sm font-medium text-gray-700">Time</div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-3 text-center border-l border-gray-100">
              <div className="text-sm font-medium text-gray-900">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-xs ${day.toDateString() === new Date().toDateString() ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {getTimeSlots().map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 text-xs text-gray-500 font-medium border-r border-gray-100">
                {timeSlot}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayActivities = filteredActivities.filter(activity =>
                  activity.date === day.toISOString().split('T')[0] &&
                  activity.start_time <= timeSlot && activity.end_time > timeSlot
                )

                return (
                  <div key={dayIndex} className="p-1 border-l border-gray-50 min-h-[60px]">
                    {dayActivities.map(activity => (
                      <div
                        key={activity.id}
                        className="p-1 mb-1 rounded text-xs cursor-pointer hover:opacity-80"
                        style={{
                          backgroundColor: activity.activity_type?.color,
                          color: 'white',
                        }}
                        onClick={() => handleEditActivity(activity)}
                      >
                        <div className="font-medium truncate">{activity.title}</div>
                        <div className="opacity-90">{activity.start_time}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1) // Start from Monday

    const calendarDays = []
    for (let i = 0; i < 42; i++) { // 6 weeks × 7 days
      calendarDays.push(new Date(startDate))
      startDate.setDate(startDate.getDate() + 1)
    }

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayActivities = filteredActivities.filter(activity =>
              activity.date === day.toISOString().split('T')[0]
            )

            const isCurrentMonth = day.getMonth() === month
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                className={`border border-gray-100 min-h-[100px] p-2 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !isCurrentMonth ? 'text-gray-400' :
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayActivities.slice(0, 3).map(activity => (
                    <div
                      key={activity.id}
                      className="p-1 rounded text-xs cursor-pointer hover:opacity-80 truncate"
                      style={{
                        backgroundColor: activity.activity_type?.color,
                        color: 'white',
                      }}
                      onClick={() => handleEditActivity(activity)}
                    >
                      {activity.title}
                    </div>
                  ))}
                  {dayActivities.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayActivities.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {renderHeader()}

      <div className="mb-4">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </div>

      {/* Modals */}
      <CreateActivityModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        children={children}
        activityTypes={activityTypes}
        selectedChild={selectedChild}
        currentDate={currentDate.toISOString().split('T')[0]}
        onActivityCreated={handleActivityCreated}
      />

      <EditActivityModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        activity={selectedActivity}
        activityTypes={activityTypes}
        children={children}
        onActivityUpdated={handleActivityUpdated}
      />
    </div>
  )
}