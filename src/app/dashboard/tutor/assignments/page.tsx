'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TutorAssignmentsPage() {
  const { user } = useSupabase()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'pending' | 'completed' | 'all'>('pending')

  const assignments = [
    {
      id: 1,
      title: 'Mathematics Practice Set 5',
      description: 'Complete exercises 1-20 on quadratic equations',
      subject: 'Mathematics',
      student: 'Alice Wong',
      assigned_date: '2024-01-10',
      due_date: '2024-01-20',
      status: 'submitted',
      submitted_date: '2024-01-18',
      score: 88,
      feedback: 'Excellent work on solving quadratic equations. Minor errors in factoring.',
      materials: ['Practice_Set_5.pdf', 'Answer_Key.pdf']
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      description: 'Write a report on the forces and motion experiment',
      subject: 'Physics',
      student: 'Bob Kim',
      assigned_date: '2024-01-12',
      due_date: '2024-01-22',
      status: 'pending',
      submitted_date: null,
      score: null,
      feedback: '',
      materials: ['Lab_Template.docx', 'Experiment_Guidelines.pdf']
    },
    {
      id: 3,
      title: 'Algebra Quiz Preparation',
      description: 'Study chapters 3-5 for upcoming quiz',
      subject: 'Mathematics',
      student: 'Alice Wong',
      assigned_date: '2024-01-15',
      due_date: '2024-01-18',
      status: 'in_progress',
      submitted_date: null,
      score: null,
      feedback: '',
      materials: ['Study_Guide.pdf', 'Practice_Quiz.pdf']
    },
    {
      id: 4,
      title: 'English Essay',
      description: 'Write a 500-word essay on environmental conservation',
      subject: 'English',
      student: 'Carol Lee',
      assigned_date: '2024-01-08',
      due_date: '2024-01-16',
      status: 'completed',
      submitted_date: '2024-01-15',
      score: 92,
      feedback: 'Well-structured essay with strong arguments. Excellent vocabulary usage.',
      materials: ['Essay_Rubric.pdf', 'Sample_Essay.pdf']
    }
  ]

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'in_progress')
  const completedAssignments = assignments.filter(a => a.status === 'completed')
  const submittedAssignments = assignments.filter(a => a.status === 'submitted')

  const filteredAssignments = selectedTab === 'pending' ? pendingAssignments :
                            selectedTab === 'completed' ? completedAssignments :
                            assignments

  return (
    <DashboardLayout userRole="tutor">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Create and manage student assignments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Assignment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Total Assignments</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{assignments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{submittedAssignments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{pendingAssignments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{completedAssignments.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({pendingAssignments.length})
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({completedAssignments.length})
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({assignments.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                    assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {assignment.status === 'completed' ? 'Completed' :
                     assignment.status === 'submitted' ? 'Submitted' :
                     assignment.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                  {assignment.score && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      Score: {assignment.score}%
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Student</p>
                  <p className="font-medium text-gray-900">{assignment.student}</p>
                </div>
                <div>
                  <p className="text-gray-600">Subject</p>
                  <p className="font-medium text-gray-900">{assignment.subject}</p>
                </div>
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-medium text-gray-900">{assignment.due_date}</p>
                </div>
              </div>

              {assignment.materials.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Materials:</p>
                  <div className="flex flex-wrap gap-2">
                    {assignment.materials.map((material, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        📄 {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {assignment.feedback && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Feedback:</p>
                  <p className="text-sm text-blue-800">{assignment.feedback}</p>
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                {assignment.status === 'submitted' && (
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Grade Assignment
                  </button>
                )}
                {assignment.status === 'pending' && (
                  <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                    Send Reminder
                  </button>
                )}
                <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm font-medium text-gray-900">Create Assignment</p>
            </button>
            <button className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">📁</div>
              <p className="text-sm font-medium text-gray-900">Upload Materials</p>
            </button>
            <button className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium text-gray-900">Grade Bulk</p>
            </button>
            <button className="p-4 text-center bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm font-medium text-gray-900">Send Reminders</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}