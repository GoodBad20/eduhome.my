'use client'

import { useState } from 'react'
import { parentService } from '@/lib/services/parentService'

interface ScheduleLessonModalProps {
  isOpen: boolean
  onClose: () => void
  childId: string
  childName: string
  onLessonScheduled: () => void
}

export default function ScheduleLessonModal({ isOpen, onClose, childId, childName, onLessonScheduled }: ScheduleLessonModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    tutor_id: '',
    scheduled_time: '',
    duration_minutes: 60
  })

  // Mock tutors - replace with actual data
  const tutors = [
    { id: '1', name: 'Ms. Chen', subjects: ['Mathematics', 'Physics'] },
    { id: '2', name: 'Dr. Smith', subjects: ['Science', 'Chemistry'] },
    { id: '3', name: 'Mr. Davis', subjects: ['English', 'History'] },
    { id: '4', name: 'Ms. Johnson', subjects: ['Mathematics', 'Statistics'] }
  ]

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Art', 'Music']

  const filteredTutors = tutors.filter(tutor =>
    tutor.subjects.includes(formData.subject)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await parentService.scheduleLesson({
        student_id: childId,
        subject: formData.subject,
        tutor_id: formData.tutor_id,
        scheduled_time: formData.scheduled_time,
        duration_minutes: formData.duration_minutes
      })

      onLessonScheduled()
      onClose()
      setFormData({
        subject: '',
        tutor_id: '',
        scheduled_time: '',
        duration_minutes: 60
      })
    } catch (error) {
      console.error('Error scheduling lesson:', error)
      alert('Failed to schedule lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📅 Schedule Lesson for {childName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject 📚
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {formData.subject && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Tutors 👨‍🏫
              </label>
              <select
                name="tutor_id"
                value={formData.tutor_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a tutor</option>
                {filteredTutors.map(tutor => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.name} (specializes in {tutor.subjects.join(', ')})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time 🕐
            </label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration ⏱️
            </label>
            <select
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : 'Schedule Lesson 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}