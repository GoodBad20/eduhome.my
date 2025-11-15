'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TutorLessonsPage() {
  const { user } = useSupabase()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to Algebra',
      subject: 'Mathematics',
      student: 'Alice Wong',
      date: '2024-01-15',
      time: '2:00 PM - 3:00 PM',
      type: 'online',
      status: 'completed',
      materials: ['Algebra Basics.pdf', 'Practice Problems.pdf'],
      notes: 'Student showed excellent understanding of basic algebraic concepts',
      meetingLink: 'https://meet.google.com/xyz-abc-123',
      location: null
    },
    {
      id: 2,
      title: 'Physics - Forces and Motion',
      subject: 'Physics',
      student: 'Bob Kim',
      date: '2024-01-15',
      time: '3:30 PM - 4:15 PM',
      type: 'online',
      status: 'completed',
      materials: ['Forces Presentation.pptx', 'Experiment Video.mp4'],
      notes: 'Good progress with Newton\'s laws',
      meetingLink: 'https://meet.google.com/def-ghi-456',
      location: null
    },
    {
      id: 3,
      title: 'English Essay Writing',
      subject: 'English',
      student: 'Carol Lee',
      date: '2024-01-16',
      time: '4:30 PM - 5:30 PM',
      type: 'in_person',
      status: 'scheduled',
      materials: [],
      notes: '',
      meetingLink: null,
      location: 'Starbucks Coffee, KLCC'
    },
    {
      id: 4,
      title: 'History - World War II',
      subject: 'History',
      student: 'David Tan',
      date: '2024-01-16',
      time: '6:00 PM - 6:45 PM',
      type: 'online',
      status: 'scheduled',
      materials: [],
      notes: '',
      meetingLink: 'https://meet.google.com/jkl-mno-789',
      location: null
    }
  ])

  // Form state for creating/editing lessons
  const [lessonForm, setLessonForm] = useState({
    title: '',
    subject: '',
    student: '',
    date: '',
    time: '',
    type: 'online',
    meetingLink: '',
    location: '',
    notes: ''
  })

  // Handler functions
  const handleCreateLesson = () => {
    const newLesson = {
      id: lessons.length + 1,
      title: lessonForm.title,
      subject: lessonForm.subject,
      student: lessonForm.student,
      date: lessonForm.date,
      time: lessonForm.time,
      type: lessonForm.type,
      status: 'scheduled',
      materials: [],
      notes: lessonForm.notes,
      meetingLink: lessonForm.type === 'online' ? lessonForm.meetingLink : null,
      location: lessonForm.type === 'in_person' ? lessonForm.location : null
    }

    setLessons([...lessons, newLesson])
    setShowCreateModal(false)
    resetForm()
  }

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson)
    setLessonForm({
      title: lesson.title,
      subject: lesson.subject,
      student: lesson.student,
      date: lesson.date,
      time: lesson.time,
      type: lesson.type,
      meetingLink: lesson.meetingLink || '',
      location: lesson.location || '',
      notes: lesson.notes || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateLesson = () => {
    const updatedLessons = lessons.map(lesson =>
      lesson.id === editingLesson.id
        ? {
            ...lesson,
            title: lessonForm.title,
            subject: lessonForm.subject,
            student: lessonForm.student,
            date: lessonForm.date,
            time: lessonForm.time,
            type: lessonForm.type,
            meetingLink: lessonForm.type === 'online' ? lessonForm.meetingLink : null,
            location: lessonForm.type === 'in_person' ? lessonForm.location : null,
            notes: lessonForm.notes
          }
        : lesson
    )

    setLessons(updatedLessons)
    setShowEditModal(false)
    setEditingLesson(null)
    resetForm()
  }

  const handleCancelLesson = (lessonId: number) => {
    if (window.confirm('Are you sure you want to cancel this lesson?')) {
      const updatedLessons = lessons.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, status: 'cancelled' }
          : lesson
      )
      setLessons(updatedLessons)
    }
  }

  const handleStartLesson = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (lesson?.meetingLink) {
      window.open(lesson.meetingLink, '_blank')
    } else {
      alert('Starting lesson session...')
    }
  }

  const resetForm = () => {
    setLessonForm({
      title: '',
      subject: '',
      student: '',
      date: '',
      time: '',
      type: 'online',
      meetingLink: '',
      location: '',
      notes: ''
    })
  }

  const upcomingLessons = lessons.filter(lesson => lesson.status === 'scheduled')
  const completedLessons = lessons.filter(lesson => lesson.status === 'completed')

  return (
    <DashboardLayout userRole="tutor">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
            <p className="text-gray-600">Manage your lesson plans and track teaching progress</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create New Lesson
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Total Lessons</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{lessons.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">This Week</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{upcomingLessons.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{completedLessons.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Lessons</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lesson
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingLessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-sm text-gray-500">{lesson.subject}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lesson.student}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lesson.date}<br/>{lesson.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lesson.type === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {lesson.type === 'online' ? '💻 Online' : '🏫 In-Person'}
                          </span>
                          {lesson.type === 'online' && lesson.meetingLink && (
                            <div className="text-xs">
                              <a
                                href={lesson.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline flex items-center"
                              >
                                📹 Join Meeting
                              </a>
                            </div>
                          )}
                          {lesson.type === 'in_person' && lesson.location && (
                            <div className="text-xs text-gray-600 max-w-xs truncate" title={lesson.location}>
                              📍 {lesson.location}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Scheduled
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartLesson(lesson.id)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="text-gray-600 hover:text-gray-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCancelLesson(lesson.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Completed Lessons */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Lessons</h2>
          <div className="space-y-4">
            {completedLessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.subject} • {lesson.student}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lesson.type === 'online' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {lesson.type === 'online' ? '💻 Online' : '🏫 In-Person'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-start text-sm text-gray-600 mb-3">
                  <div>
                    <span>{lesson.date} • {lesson.time}</span>
                    {lesson.type === 'online' && lesson.meetingLink && (
                      <div className="mt-1">
                        <a
                          href={lesson.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center"
                        >
                          📹 Meeting Link
                        </a>
                      </div>
                    )}
                    {lesson.type === 'in_person' && lesson.location && (
                      <div className="mt-1 text-gray-600">
                        📍 {lesson.location}
                      </div>
                    )}
                  </div>
                </div>

                {lesson.materials.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Materials:</p>
                    <div className="flex flex-wrap gap-2">
                      {lesson.materials.map((material, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          📄 {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {lesson.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{lesson.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Create Lesson Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Lesson</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Introduction to Algebra"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={lessonForm.subject}
                      onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Mathematics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student
                    </label>
                    <select
                      value={lessonForm.student}
                      onChange={(e) => setLessonForm({ ...lessonForm, student: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a student</option>
                      <option value="Alice Wong">Alice Wong</option>
                      <option value="Bob Kim">Bob Kim</option>
                      <option value="Carol Lee">Carol Lee</option>
                      <option value="David Tan">David Tan</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={lessonForm.date}
                        onChange={(e) => setLessonForm({ ...lessonForm, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={lessonForm.time}
                        onChange={(e) => setLessonForm({ ...lessonForm, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2:00 PM - 3:00 PM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sessionType"
                          value="online"
                          checked={lessonForm.type === 'online'}
                          onChange={(e) => setLessonForm({ ...lessonForm, type: 'online' })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">💻 Online Session</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sessionType"
                          value="in_person"
                          checked={lessonForm.type === 'in_person'}
                          onChange={(e) => setLessonForm({ ...lessonForm, type: 'in_person' })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">🏫 In-Person Session</span>
                      </label>
                    </div>
                  </div>

                  {lessonForm.type === 'online' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Meet Link
                      </label>
                      <input
                        type="url"
                        value={lessonForm.meetingLink}
                        onChange={(e) => setLessonForm({ ...lessonForm, meetingLink: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://meet.google.com/xxx-xxx-xxx"
                      />
                    </div>
                  )}

                  {lessonForm.type === 'in_person' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={lessonForm.location}
                        onChange={(e) => setLessonForm({ ...lessonForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Starbucks Coffee, KLCC"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={lessonForm.notes}
                      onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lesson objectives, topics to cover, etc."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLesson}
                    disabled={!lessonForm.title || !lessonForm.subject || !lessonForm.student || !lessonForm.date || !lessonForm.time}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Create Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Lesson Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Lesson</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={lessonForm.subject}
                      onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student
                    </label>
                    <select
                      value={lessonForm.student}
                      onChange={(e) => setLessonForm({ ...lessonForm, student: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a student</option>
                      <option value="Alice Wong">Alice Wong</option>
                      <option value="Bob Kim">Bob Kim</option>
                      <option value="Carol Lee">Carol Lee</option>
                      <option value="David Tan">David Tan</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={lessonForm.date}
                        onChange={(e) => setLessonForm({ ...lessonForm, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={lessonForm.time}
                        onChange={(e) => setLessonForm({ ...lessonForm, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="editSessionType"
                          value="online"
                          checked={lessonForm.type === 'online'}
                          onChange={(e) => setLessonForm({ ...lessonForm, type: 'online' })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">💻 Online Session</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="editSessionType"
                          value="in_person"
                          checked={lessonForm.type === 'in_person'}
                          onChange={(e) => setLessonForm({ ...lessonForm, type: 'in_person' })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">🏫 In-Person Session</span>
                      </label>
                    </div>
                  </div>

                  {lessonForm.type === 'online' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Google Meet Link
                      </label>
                      <input
                        type="url"
                        value={lessonForm.meetingLink}
                        onChange={(e) => setLessonForm({ ...lessonForm, meetingLink: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {lessonForm.type === 'in_person' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={lessonForm.location}
                        onChange={(e) => setLessonForm({ ...lessonForm, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={lessonForm.notes}
                      onChange={(e) => setLessonForm({ ...lessonForm, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingLesson(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateLesson}
                    disabled={!lessonForm.title || !lessonForm.subject || !lessonForm.student || !lessonForm.date || !lessonForm.time}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Update Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}