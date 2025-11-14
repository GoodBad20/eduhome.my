'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function TutorEarningsPage() {
  const { user } = useSupabase()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  const earnings = {
    total_earnings: 12800,
    current_period: 3200,
    previous_period: 2750,
    pending_payments: 800,
    completed_lessons: 152,
    average_hourly_rate: 80
  }

  const recentTransactions = [
    {
      id: 1,
      student: 'Alice Wong',
      parent: 'Mrs. Wong',
      amount: 240,
      date: '2024-01-15',
      status: 'completed',
      lessons: 3,
      subject: 'Mathematics'
    },
    {
      id: 2,
      student: 'Bob Kim',
      parent: 'Mr. Kim',
      amount: 160,
      date: '2024-01-14',
      status: 'completed',
      lessons: 2,
      subject: 'Physics'
    },
    {
      id: 3,
      student: 'Carol Lee',
      parent: 'Mrs. Lee',
      amount: 320,
      date: '2024-01-13',
      status: 'pending',
      lessons: 4,
      subject: 'English'
    },
    {
      id: 4,
      student: 'David Tan',
      parent: 'Mr. Tan',
      amount: 120,
      date: '2024-01-12',
      status: 'completed',
      lessons: 2,
      subject: 'History'
    },
    {
      id: 5,
      student: 'Alice Wong',
      parent: 'Mrs. Wong',
      amount: 200,
      date: '2024-01-10',
      status: 'completed',
      lessons: 2.5,
      subject: 'Mathematics'
    }
  ]

  const monthlyEarnings = [
    { month: 'Jan', earnings: 3200 },
    { month: 'Feb', earnings: 2800 },
    { month: 'Mar', earnings: 3500 },
    { month: 'Apr', earnings: 2900 },
    { month: 'May', earnings: 3100 },
    { month: 'Jun', earnings: 3400 }
  ]

  const studentEarnings = [
    {
      student: 'Alice Wong',
      total_earned: 2400,
      lessons_completed: 30,
      average_rate: 80,
      subject: 'Mathematics'
    },
    {
      student: 'Bob Kim',
      total_earned: 1800,
      lessons_completed: 24,
      average_rate: 75,
      subject: 'Physics, Chemistry'
    },
    {
      student: 'Carol Lee',
      total_earned: 2200,
      lessons_completed: 28,
      average_rate: 78.57,
      subject: 'English'
    },
    {
      student: 'David Tan',
      total_earned: 1200,
      lessons_completed: 16,
      average_rate: 75,
      subject: 'History, Geography'
    }
  ]

  const changePercent = ((earnings.current_period - earnings.previous_period) / earnings.previous_period * 100).toFixed(1)

  return (
    <DashboardLayout userRole="tutor">
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600">Track your income and manage payments</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Export Report
            </button>
          </div>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">RM{earnings.total_earnings.toLocaleString()}</p>
            <p className={`mt-2 text-sm ${
              Number(changePercent) > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Number(changePercent) > 0 ? '↑' : '↓'} {Math.abs(Number(changePercent))}% from last {selectedPeriod}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">This {selectedPeriod}</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">RM{earnings.current_period.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">
              {earnings.completed_lessons} lessons completed
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Pending Payments</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600">RM{earnings.pending_payments.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">
              Awaiting confirmation
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-600">Average Hourly Rate</p>
            <p className="mt-2 text-3xl font-bold text-green-600">RM{earnings.average_hourly_rate}</p>
            <p className="mt-2 text-sm text-gray-500">
              Per hour
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lessons
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.student}</p>
                            <p className="text-xs text-gray-500">{transaction.parent}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.lessons}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          RM{transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Students by Earnings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Students</h2>
            <div className="space-y-4">
              {studentEarnings.map((student, index) => (
                <div key={student.student} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.student}</p>
                      <p className="text-xs text-gray-500">{student.lessons_completed} lessons</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">RM{student.total_earned}</p>
                    <p className="text-xs text-gray-500">RM{student.average_rate}/hr</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Earnings Chart */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings Trend</h2>
          <div className="h-64 flex items-end space-x-4">
            {monthlyEarnings.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors"
                  style={{ height: `${(month.earnings / 3500) * 100}%` }}
                />
                <p className="mt-2 text-sm text-gray-600">{month.month}</p>
                <p className="text-xs text-gray-500">RM{month.earnings}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-sm font-medium text-gray-900">Request Payment</p>
            </button>
            <button className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium text-gray-900">Generate Invoice</p>
            </button>
            <button className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">📤</div>
              <p className="text-sm font-medium text-gray-900">Send Reminder</p>
            </button>
            <button className="p-4 text-center bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}