'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TutorSchedulePage() {
  const { user } = useSupabase()
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  const weekSchedule = [
    { day: 'Monday', date: '2024-01-15', lessons: [
      {
        time: '2:00 PM - 3:00 PM',
        student: 'Alice Wong',
        subject: 'Mathematics',
        type: 'online',
        meetingLink: 'https://meet.google.com/abc-123-def',
        location: null
      },
      {
        time: '4:30 PM - 5:30 PM',
        student: 'Carol Lee',
        subject: 'English',
        type: 'in_person',
        meetingLink: null,
        location: 'Public Library, Bukit Jalil'
      }
    ]},
    { day: 'Tuesday', date: '2024-01-16', lessons: [
      {
        time: '3:30 PM - 4:15 PM',
        student: 'Bob Kim',
        subject: 'Physics',
        type: 'online',
        meetingLink: 'https://meet.google.com/ghi-456-jkl',
        location: null
      },
      {
        time: '6:00 PM - 6:45 PM',
        student: 'David Tan',
        subject: 'History',
        type: 'online',
        meetingLink: 'https://meet.google.com/mno-789-pqr',
        location: null
      }
    ]},
    { day: 'Wednesday', date: '2024-01-17', lessons: [
      {
        time: '2:00 PM - 3:00 PM',
        student: 'Alice Wong',
        subject: 'Mathematics',
        type: 'online',
        meetingLink: 'https://meet.google.com/stu-012-vwx',
        location: null
      }
    ]},
    { day: 'Thursday', date: '2024-01-18', lessons: [
      {
        time: '4:00 PM - 5:00 PM',
        student: 'Bob Kim',
        subject: 'Chemistry',
        type: 'online',
        meetingLink: 'https://meet.google.com/yza-345-bcd',
        location: null
      }
    ]},
    { day: 'Friday', date: '2024-01-19', lessons: [
      {
        time: '3:00 PM - 4:00 PM',
        student: 'Carol Lee',
        subject: 'Literature',
        type: 'in_person',
        meetingLink: null,
        location: 'Sunway University Library'
      },
      {
        time: '5:00 PM - 6:00 PM',
        student: 'David Tan',
        subject: 'Geography',
        type: 'online',
        meetingLink: 'https://meet.google.com/efg-678-hij',
        location: null
      }
    ]},
    { day: 'Saturday', date: '2024-01-20', lessons: [
      {
        time: '10:00 AM - 11:30 AM',
        student: 'Alice Wong',
        subject: 'Mathematics',
        type: 'in_person',
        meetingLink: null,
        location: 'KLCC Community Centre'
      },
      {
        time: '2:00 PM - 3:30 PM',
        student: 'Bob Kim',
        subject: 'Physics',
        type: 'online',
        meetingLink: 'https://meet.google.com/klm-901-nop',
        location: null
      }
    ]},
    { day: 'Sunday', date: '2024-01-21', lessons: []}
  ]

  const availabilitySettings = {
    monday: { available: true, start_time: '2:00 PM', end_time: '6:00 PM' },
    tuesday: { available: true, start_time: '3:00 PM', end_time: '7:00 PM' },
    wednesday: { available: true, start_time: '2:00 PM', end_time: '5:00 PM' },
    thursday: { available: true, start_time: '3:00 PM', end_time: '6:00 PM' },
    friday: { available: true, start_time: '3:00 PM', end_time: '7:00 PM' },
    saturday: { available: true, start_time: '10:00 AM', end_time: '4:00 PM' },
    sunday: { available: false, start_time: '', end_time: '' }
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600">Manage your teaching schedule and availability</p>
          </div>
          <div className="flex space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month View
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Add Time Slot
            </button>
          </div>
        </div>

        {/* Schedule Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Lessons This Week</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {weekSchedule.reduce((acc, day) => acc + day.lessons.length, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Total Hours</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {weekSchedule.reduce((acc, day) => acc + day.lessons.length, 0) * 1.25}h
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Available Slots</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">75%</p>
          </div>
        </div>

        {/* Weekly Schedule */}
        {viewMode === 'week' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 divide-x divide-gray-200">
              {weekSchedule.map((day) => (
                <div key={day.day} className="p-4">
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-900">{day.day}</p>
                    <p className="text-xs text-gray-500">{day.date}</p>
                  </div>
                  <div className="space-y-2 min-h-[200px]">
                    {day.lessons.length === 0 ? (
                      <div className="text-center text-gray-400 text-xs py-8">
                        No lessons
                      </div>
                    ) : (
                      day.lessons.map((lesson, index) => (
                        <div key={index} className={`border rounded-lg p-2 ${
                          lesson.type === 'online'
                            ? 'bg-purple-50 border-purple-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}>
                          <p className={`text-xs font-medium mt-1 ${
                            lesson.type === 'online' ? 'text-purple-900' : 'text-blue-900'
                          }`}>{lesson.time}</p>
                          <p className="text-xs text-gray-700 mt-1">{lesson.student}</p>
                          <p className="text-xs text-gray-500">{lesson.subject}</p>
                          <div className="flex items-center mt-1">
                            <span className={`w-2 h-2 rounded-full mr-1 ${
                              lesson.type === 'online' ? 'bg-purple-500' : 'bg-blue-500'
                            }`} />
                            <span className="text-xs text-gray-600 font-medium">
                              {lesson.type === 'online' ? '💻 Online' : '🏫 In-Person'}
                            </span>
                          </div>
                          {lesson.type === 'online' && lesson.meetingLink && (
                            <div className="mt-1">
                              <a
                                href={lesson.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center"
                              >
                                📹 Join Meeting
                              </a>
                            </div>
                          )}
                          {lesson.type === 'in_person' && lesson.location && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-600 truncate" title={lesson.location}>
                                📍 {lesson.location}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Calendar View (Simplified) */}
        {viewMode === 'month' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg font-medium">Monthly Calendar View</p>
              <p className="text-sm mt-2">Full calendar functionality coming soon</p>
            </div>
          </div>
        )}

        {/* Availability Settings */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Availability Settings</h2>
          <div className="space-y-4">
            {Object.entries(availabilitySettings).map(([day, settings]) => (
              <div key={day} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={settings.available}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="font-medium text-gray-900 capitalize">{day}</span>
                </div>
                {settings.available && (
                  <div className="flex items-center space-x-4">
                    <input
                      type="time"
                      value={settings.start_time}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={settings.end_time}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Save Availability
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">➕</div>
              <p className="text-sm font-medium text-gray-900">Add Lesson</p>
            </button>
            <button className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-sm font-medium text-gray-900">Block Time</p>
            </button>
            <button className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-sm font-medium text-gray-900">Reschedule</p>
            </button>
            <button className="p-4 text-center bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="text-2xl mb-2">📤</div>
              <p className="text-sm font-medium text-gray-900">Send Schedule</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}