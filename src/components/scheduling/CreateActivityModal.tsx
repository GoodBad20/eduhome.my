'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Calendar, Repeat, MapPin, User, Bell, Tag, FileText, Save } from 'lucide-react'
import { ChildData, ActivityType, ScheduleActivity, RecurrencePattern, Reminder } from '@/lib/services/parentService'
import { parentService } from '@/lib/services/parentService'

interface CreateActivityModalProps {
  isOpen: boolean
  onClose: () => void
  children: ChildData[]
  activityTypes: ActivityType[]
  selectedChild?: string
  currentDate?: string
  onActivityCreated: () => void
}

export default function CreateActivityModal({
  isOpen,
  onClose,
  children,
  activityTypes,
  selectedChild,
  currentDate = new Date().toISOString().split('T')[0],
  onActivityCreated
}: CreateActivityModalProps) {
  const [formData, setFormData] = useState({
    child_id: selectedChild || '',
    title: '',
    description: '',
    activity_type_id: '',
    date: currentDate,
    start_time: '09:00',
    end_time: '10:00',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    is_recurring: false,
    recurrence_pattern: {
      type: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
      interval: 1,
      days_of_week: [] as number[],
      end_date: '',
      end_occurrences: 0
    },
    reminders: [
      {
        id: '1',
        type: 'notification' as 'notification' | 'email' | 'sms',
        minutes_before: 15,
        is_enabled: true
      }
    ] as Reminder[],
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        child_id: selectedChild || '',
        title: '',
        description: '',
        activity_type_id: '',
        date: currentDate,
        start_time: '09:00',
        end_time: '10:00',
        location: '',
        priority: 'medium',
        is_recurring: false,
        recurrence_pattern: {
          type: 'weekly',
          interval: 1,
          days_of_week: [],
          end_date: '',
          end_occurrences: 0
        },
        reminders: [
          {
            id: '1',
            type: 'notification',
            minutes_before: 15,
            is_enabled: true
          }
        ],
        notes: ''
      })
      setError(null)
    }
  }, [isOpen, selectedChild, currentDate])

  const selectedActivityType = activityTypes.find(type => type.id === formData.activity_type_id)

  useEffect(() => {
    if (selectedActivityType) {
      const start = new Date(`2000-01-01T${formData.start_time}`)
      start.setMinutes(start.getMinutes() + selectedActivityType.default_duration)
      const endTime = start.toTimeString().slice(0, 5)

      setFormData(prev => ({
        ...prev,
        end_time: endTime
      }))
    }
  }, [selectedActivityType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.child_id || !formData.title || !formData.activity_type_id) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const activityData: Omit<ScheduleActivity, 'id' | 'created_at' | 'updated_at'> = {
        child_id: formData.child_id,
        child_name: children.find(child => child.id === formData.child_id)?.name || '',
        title: formData.title,
        description: formData.description,
        activity_type: selectedActivityType || activityTypes[0],
        start_time: formData.start_time,
        end_time: formData.end_time,
        date: formData.date,
        is_recurring: formData.is_recurring,
        recurrence_pattern: formData.is_recurring ? formData.recurrence_pattern : undefined,
        location: formData.location || undefined,
        is_completed: false,
        priority: formData.priority,
        color: selectedActivityType?.color,
        reminders: formData.reminders,
        notes: formData.notes
      }

      if (formData.is_recurring) {
        await parentService.createRecurringActivity(activityData)
      } else {
        await parentService.createScheduleActivity(activityData)
      }

      onActivityCreated()
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create activity')
    } finally {
      setLoading(false)
    }
  }

  const toggleDayOfWeek = (day: number) => {
    setFormData(prev => ({
      ...prev,
      recurrence_pattern: {
        ...prev.recurrence_pattern,
        days_of_week: prev.recurrence_pattern.days_of_week.includes(day)
          ? prev.recurrence_pattern.days_of_week.filter(d => d !== day)
          : [...prev.recurrence_pattern.days_of_week, day]
      }
    }))
  }

  const addReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        {
          id: Date.now().toString(),
          type: 'notification',
          minutes_before: 30,
          is_enabled: true
        }
      ]
    }))
  }

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    }))
  }

  const removeReminder = (id: string) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(reminder => reminder.id !== id)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-500 px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl leading-6 font-bold text-white">Create Activity</h3>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-blue-100 mt-2">Add a new activity to your schedule</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-6 sm:pb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Child *
                  </label>
                  <select
                    required
                    value={formData.child_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, child_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Child</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Activity Type *
                  </label>
                  <select
                    required
                    value={formData.activity_type_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, activity_type_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Activity</option>
                    {activityTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name} ({type.default_duration}min)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter activity title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter activity description (optional)"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Recurrence */}
              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_recurring"
                    checked={formData.is_recurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_recurring" className="ml-2 text-sm font-medium text-gray-700">
                    <Repeat className="h-4 w-4 inline mr-1" />
                    Recurring Activity
                  </label>
                </div>

                {formData.is_recurring && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Repeat
                        </label>
                        <select
                          value={formData.recurrence_pattern.type}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            recurrence_pattern: {
                              ...prev.recurrence_pattern,
                              type: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly'
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Every
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={formData.recurrence_pattern.interval}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              recurrence_pattern: {
                                ...prev.recurrence_pattern,
                                interval: parseInt(e.target.value) || 1
                              }
                            }))}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">
                            {formData.recurrence_pattern.type === 'daily' ? 'day(s)' :
                             formData.recurrence_pattern.type === 'weekly' ? 'week(s)' :
                             formData.recurrence_pattern.type === 'monthly' ? 'month(s)' : 'year(s)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {formData.recurrence_pattern.type === 'weekly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Days of Week
                        </label>
                        <div className="flex space-x-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDayOfWeek(index + 1)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                formData.recurrence_pattern.days_of_week.includes(index + 1)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reminders */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    <Bell className="h-4 w-4 inline mr-1" />
                    Reminders
                  </label>
                  <button
                    type="button"
                    onClick={addReminder}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    + Add Reminder
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={reminder.is_enabled}
                        onChange={(e) => updateReminder(reminder.id, { is_enabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <select
                        value={reminder.type}
                        onChange={(e) => updateReminder(reminder.id, { type: e.target.value as 'notification' | 'email' | 'sms' })}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="notification">Notification</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                      </select>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          value={reminder.minutes_before}
                          onChange={(e) => updateReminder(reminder.id, { minutes_before: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">min before</span>
                      </div>
                      {formData.reminders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReminder(reminder.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Activity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}