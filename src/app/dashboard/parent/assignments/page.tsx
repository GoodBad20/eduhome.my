'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { parentService, ChildData } from '@/lib/services/parentService'
import { assignmentService, Assignment } from '@/lib/services/assignmentService'
import { Calendar, Clock, User, AlertTriangle, CheckCircle, Circle, FileText, Download, Eye } from 'lucide-react'

export default function ParentAssignmentsPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    submitted: 0,
    completed: 0,
    overdue: 0,
    average_score: 0
  })
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all')

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  useEffect(() => {
    if (selectedChild) {
      loadChildAssignments(selectedChild.id)
    }
  }, [selectedChild])

  const loadData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const childrenData = await parentService.getChildren(user.id)
      setChildren(childrenData)

      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0])
      }

      // Load overall stats
      const assignmentStats = await assignmentService.getParentAssignmentStats(user.id)
      setStats(assignmentStats)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChildAssignments = async (childId: string) => {
    try {
      const childAssignments = await assignmentService.getChildAssignments(childId)
      setAssignments(childAssignments)
    } catch (error) {
      console.error('Error loading child assignments:', error)
    }
  }

  const handleChildSelect = (child: ChildData) => {
    setSelectedChild(child)
    loadChildAssignments(child.id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'submitted':
        return 'bg-purple-100 text-purple-800'
      case 'reviewed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Circle className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'submitted':
        return <FileText className="h-4 w-4" />
      case 'reviewed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'Pending'
      case 'in_progress':
        return 'In Progress'
      case 'submitted':
        return 'Submitted'
      case 'reviewed':
        return 'Graded'
      default:
        return status
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && ['assigned', 'in_progress'].includes(status)
  }

  const filteredAssignments = assignments.filter(assignment => {
    const overdue = isOverdue(assignment.due_date, assignment.status)

    switch (selectedTab) {
      case 'pending':
        return ['assigned', 'in_progress'].includes(assignment.status)
      case 'overdue':
        return overdue
      case 'completed':
        return assignment.status === 'reviewed'
      default:
        return true
    }
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

  return (
    <DashboardLayout userRole="parent">
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Assignments</h1>
          <p className="text-gray-600">Monitor and track your children's assignment progress</p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Children to Monitor</h3>
            <p className="text-gray-600 mb-6">Add children to start tracking their assignments</p>
            <button
              onClick={() => window.location.href = '/dashboard/parent/children'}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Add Children
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.in_progress}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Submitted</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.submitted}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Avg Score</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">{stats.average_score}%</p>
              </div>
            </div>

            {/* Child Selector */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all touch-manipulation ${
                      selectedChild?.id === child.id
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">👤</span>
                      {child.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedChild && (
              <>
                {/* Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
                      <button
                        onClick={() => setSelectedTab('all')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap touch-manipulation ${
                          selectedTab === 'all'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        All ({assignments.length})
                      </button>
                      <button
                        onClick={() => setSelectedTab('pending')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap touch-manipulation ${
                          selectedTab === 'pending'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Pending ({assignments.filter(a => ['assigned', 'in_progress'].includes(a.status)).length})
                      </button>
                      <button
                        onClick={() => setSelectedTab('overdue')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap touch-manipulation ${
                          selectedTab === 'overdue'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Overdue ({assignments.filter(a => isOverdue(a.due_date, a.status)).length})
                      </button>
                      <button
                        onClick={() => setSelectedTab('completed')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap touch-manipulation ${
                          selectedTab === 'completed'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Completed ({assignments.filter(a => a.status === 'reviewed').length})
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Assignments List */}
                {filteredAssignments.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {selectedTab === 'all' ? 'No Assignments Yet' :
                       selectedTab === 'overdue' ? 'No Overdue Assignments' :
                       selectedTab === 'completed' ? 'No Completed Assignments' :
                       'No Pending Assignments'}
                    </h3>
                    <p className="text-gray-600">
                      {selectedTab === 'all' ? `${selectedChild.name} hasn't received any assignments yet.` :
                       selectedTab === 'overdue' ? 'Great! No assignments are overdue.' :
                       selectedTab === 'completed' ? 'No assignments have been graded yet.' :
                       'All assignments are up to date!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssignments.map((assignment) => {
                      const overdue = isOverdue(assignment.due_date, assignment.status)
                      return (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                {getStatusIcon(assignment.status)}
                                <h3 className="text-lg font-semibold text-gray-900 truncate">{assignment.title}</h3>
                                {overdue && (
                                  <span className="flex items-center text-red-600 text-sm">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Overdue
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{assignment.description}</p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-gray-600 text-xs">Tutor</p>
                                    <p className="font-medium text-gray-900">{assignment.tutor?.full_name || 'Unknown'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-gray-600 text-xs">Subject</p>
                                    <p className="font-medium text-gray-900">{assignment.subject}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-gray-600 text-xs">Due Date</p>
                                    <p className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                                      {new Date(assignment.due_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-gray-600 text-xs">Status</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                      {getStatusText(assignment.status)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {assignment.score !== null && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                  <p className="text-sm font-medium text-green-800">
                                    Score: {assignment.score}/{assignment.max_score}
                                  </p>
                                </div>
                              )}

                              {assignment.feedback && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm font-medium text-blue-900 mb-1">Feedback:</p>
                                  <p className="text-sm text-blue-800">{assignment.feedback}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                                {getStatusText(assignment.status)}
                              </span>
                              {assignment.score !== null && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  {assignment.score}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                            {assignment.materials && assignment.materials.length > 0 && (
                              <button className="flex items-center px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors touch-manipulation">
                                <Download className="h-4 w-4 mr-1" />
                                Materials ({assignment.materials.length})
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}