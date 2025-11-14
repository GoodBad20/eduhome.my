'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TutorStudentsPage() {
  const { user } = useSupabase()
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const students = [
    {
      id: 1,
      name: 'Alice Wong',
      email: 'alice@example.com',
      grade: 'Form 4',
      subjects: ['Mathematics', 'Physics'],
      parent_name: 'Mrs. Wong',
      parent_email: 'mrs.wong@example.com',
      progress: 85,
      next_lesson: 'Today, 2:00 PM',
      total_lessons: 24,
      upcoming_payment: 'RM 240',
      status: 'active'
    },
    {
      id: 2,
      name: 'Bob Kim',
      email: 'bob@example.com',
      grade: 'Form 3',
      subjects: ['Mathematics', 'Chemistry'],
      parent_name: 'Mr. Kim',
      parent_email: 'mr.kim@example.com',
      progress: 72,
      next_lesson: 'Tomorrow, 3:30 PM',
      total_lessons: 18,
      upcoming_payment: 'RM 160',
      status: 'active'
    },
    {
      id: 3,
      name: 'Carol Lee',
      email: 'carol@example.com',
      grade: 'Form 5',
      subjects: ['English', 'Literature'],
      parent_name: 'Mrs. Lee',
      parent_email: 'mrs.lee@example.com',
      progress: 91,
      next_lesson: 'Friday, 4:30 PM',
      total_lessons: 32,
      upcoming_payment: 'RM 320',
      status: 'active'
    },
    {
      id: 4,
      name: 'David Tan',
      email: 'david@example.com',
      grade: 'Form 2',
      subjects: ['History', 'Geography'],
      parent_name: 'Mr. Tan',
      parent_email: 'mr.tan@example.com',
      progress: 68,
      next_lesson: 'Monday, 6:00 PM',
      total_lessons: 15,
      upcoming_payment: 'RM 120',
      status: 'active'
    }
  ]

  const progressUpdates = [
    { date: '2024-01-15', subject: 'Mathematics', topic: 'Algebra Equations', score: 88, notes: 'Excellent improvement in solving linear equations' },
    { date: '2024-01-12', subject: 'Physics', topic: 'Forces and Motion', score: 75, notes: 'Good understanding of basic concepts' },
    { date: '2024-01-10', subject: 'Mathematics', topic: 'Quadratic Functions', score: 82, notes: 'Needs more practice with factoring' },
    { date: '2024-01-08', subject: 'Physics', topic: 'Energy Conservation', score: 79, notes: 'Strong grasp of theoretical concepts' },
  ]

  const upcomingAssignments = [
    { id: 1, title: 'Mathematics Practice Set 5', due_date: '2024-01-20', status: 'pending' },
    { id: 2, title: 'Physics Lab Report', due_date: '2024-01-22', status: 'pending' },
    { id: 3, title: 'Algebra Quiz Preparation', due_date: '2024-01-18', status: 'in_progress' },
  ]

  return (
    <DashboardLayout userRole="tutor">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600">Manage your students and track their progress</p>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {students.map((student) => (
            <div
              key={student.id}
              className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                selectedStudent === student.id.toString() ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
              }`}
              onClick={() => setSelectedStudent(student.id.toString())}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.grade} • {student.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subjects:</span>
                  <span className="font-medium">{student.subjects.join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{student.progress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Lesson:</span>
                  <span className="font-medium">{student.next_lesson}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Lessons:</span>
                  <span className="font-medium">{student.total_lessons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Parent:</span>
                  <span className="font-medium">{student.parent_name}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upcoming Payment:</span>
                  <span className="font-semibold text-blue-600">{student.upcoming_payment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Details (when selected) */}
        {selectedStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Updates */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Updates</h2>
              <div className="space-y-4">
                {progressUpdates.map((update, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{update.subject} - {update.topic}</p>
                        <p className="text-sm text-gray-600 mt-1">{update.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Score: {update.score}%</p>
                        <p className="text-xs text-gray-500">{update.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h2>
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">{assignment.title}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Due: {assignment.due_date}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {assignment.status === 'pending' ? 'Pending' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm font-medium text-gray-900">Create Assignment</p>
            </button>
            <button className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium text-gray-900">Update Progress</p>
            </button>
            <button className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm font-medium text-gray-900">Send Message</p>
            </button>
            <button className="p-4 text-center bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-sm font-medium text-gray-900">Schedule Lesson</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}