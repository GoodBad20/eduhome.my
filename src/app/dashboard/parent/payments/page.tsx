'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { parentService, ChildData, PaymentData } from '@/lib/services/parentService'

export default function PaymentsPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    if (user) {
      loadChildren()
      loadPayments()
    }
  }, [user])

  const loadChildren = async () => {
    if (!user?.id) return

    try {
      const childrenData = await parentService.getChildren(user.id)
      setChildren(childrenData)
    } catch (error) {
      console.error('Error loading children:', error)
    }
  }

  const loadPayments = async () => {
    try {
      const paymentsData = await parentService.getPaymentHistory(user?.id || '')
      setPayments(paymentsData)
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (selectedTab === 'all') return true
    return payment.status === selectedTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTotalByStatus = (status: string) => {
    return payments
      .filter(p => p.status === status)
      .reduce((total, p) => total + p.amount, 0)
  }

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
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment History</h1>
          <p className="text-gray-600">Track payments and manage billing for your children's lessons</p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Payments Yet</h3>
            <p className="text-gray-600 mb-6">Add children to start managing lesson payments</p>
            <button
              onClick={() => window.location.href = '/dashboard/parent/children'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Add Children
            </button>
          </div>
        ) : (
          <>
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Total Spent</h3>
                  <span className="text-3xl">💰</span>
                </div>
                <div className="text-3xl font-bold mb-2">RM{getTotalByStatus('completed')}</div>
                <p className="text-white opacity-90">Lifetime payments</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Pending</h3>
                  <span className="text-3xl">⏳</span>
                </div>
                <div className="text-3xl font-bold mb-2">RM{getTotalByStatus('pending')}</div>
                <p className="text-white opacity-90">Awaiting payment</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Completed</h3>
                  <span className="text-3xl">✅</span>
                </div>
                <div className="text-3xl font-bold mb-2">{payments.filter(p => p.status === 'completed').length}</div>
                <p className="text-white opacity-90">Successful payments</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All Payments ({payments.length})
                </button>
                <button
                  onClick={() => setSelectedTab('pending')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === 'pending'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Pending ({payments.filter(p => p.status === 'pending').length})
                </button>
                <button
                  onClick={() => setSelectedTab('completed')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedTab === 'completed'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Completed ({payments.filter(p => p.status === 'completed').length})
                </button>
              </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-2">💳</span>
                Payment History
              </h3>

              {filteredPayments.length > 0 ? (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                              💰
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800">{payment.description}</h4>
                              <p className="text-gray-600">
                                Due: {new Date(payment.due_date).toLocaleDateString()}
                                {payment.paid_at && ` • Paid: ${new Date(payment.paid_at).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-2xl font-bold text-gray-800">
                              RM{payment.amount}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {payment.status === 'pending' && (
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                              Pay Now
                            </button>
                          )}
                          <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                            <span className="text-xl">📄</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💳</div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">No {selectedTab === 'all' ? '' : selectedTab} Payments</h4>
                  <p className="text-gray-600 mb-6">
                    {selectedTab === 'pending' ? 'No pending payments at the moment' :
                     selectedTab === 'completed' ? 'No completed payments yet' :
                     'No payment history available'}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}