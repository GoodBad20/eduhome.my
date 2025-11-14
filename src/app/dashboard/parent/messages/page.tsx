'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { parentService, ChildData } from '@/lib/services/parentService'

interface Message {
  id: string
  sender_name: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  type: 'tutor' | 'system' | 'parent'
}

export default function MessagesPage() {
  const { user } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [children, setChildren] = useState<ChildData[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'tutor'>('all')

  useEffect(() => {
    if (user) {
      loadChildren()
      loadMessages()
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

  const loadMessages = async () => {
    try {
      // Mock messages for now - replace with actual data
      const mockMessages: Message[] = [
        {
          id: '1',
          sender_name: 'Ms. Chen',
          subject: 'Sarah\'s Math Progress Update',
          content: 'Hi! I wanted to update you on Sarah\'s progress in mathematics. She has shown significant improvement in algebra and is now confidently solving complex equations. Her homework completion rate has increased to 95% this month.',
          timestamp: '2024-11-12T10:30:00Z',
          read: false,
          type: 'tutor'
        },
        {
          id: '2',
          sender_name: 'Dr. Smith',
          subject: 'Science Lesson Cancellation',
          content: 'Due to unforeseen circumstances, I need to cancel tomorrow\'s science lesson for Tom. I apologize for the inconvenience and will reschedule as soon as possible. Please let me know your availability for next week.',
          timestamp: '2024-11-11T15:45:00Z',
          read: true,
          type: 'tutor'
        },
        {
          id: '3',
          sender_name: 'EduHome System',
          subject: 'Payment Reminder',
          content: 'This is a friendly reminder that your payment for Sarah\'s math lessons is due on November 15th. The total amount is RM240 for 4 sessions. Please ensure payment is made on time to avoid any interruption in lessons.',
          timestamp: '2024-11-10T09:00:00Z',
          read: true,
          type: 'system'
        },
        {
          id: '4',
          sender_name: 'Ms. Johnson',
          subject: 'English Assignment Feedback',
          content: 'Tom has completed his English assignment with excellent results! His reading comprehension has improved remarkably, and he\'s now able to analyze complex texts independently. Keep up the great work!',
          timestamp: '2024-11-09T14:20:00Z',
          read: false,
          type: 'tutor'
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMessages = messages.filter(message => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'unread') return !message.read
    if (selectedTab === 'tutor') return message.type === 'tutor'
    return true
  })

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    // Mark as read
    setMessages(prev => prev.map(m =>
      m.id === message.id ? { ...m, read: true } : m
    ))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutor':
        return '👩‍🏫'
      case 'system':
        return '🔔'
      case 'parent':
        return '👨‍👩‍👧‍👦'
      default:
        return '💬'
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with tutors and stay updated on your children's progress</p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Messages Yet</h3>
            <p className="text-gray-600 mb-6">Add children and connect with tutors to start receiving messages</p>
            <button
              onClick={() => window.location.href = '/dashboard/parent/children'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Add Children
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📨</span>
                  Inbox
                </h3>

                {/* Filter Tabs */}
                <div className="flex flex-col space-y-2 mb-4">
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-left ${
                      selectedTab === 'all'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Messages ({messages.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('unread')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-left ${
                      selectedTab === 'unread'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Unread ({messages.filter(m => !m.read).length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('tutor')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-left ${
                      selectedTab === 'tutor'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    From Tutors ({messages.filter(m => m.type === 'tutor').length})
                  </button>
                </div>

                {/* Messages */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedMessage?.id === message.id
                          ? 'bg-blue-100 border-blue-300'
                          : 'hover:bg-gray-50 border-transparent'
                      } border ${!message.read ? 'font-semibold' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(message.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {message.sender_name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {message.subject}
                          </p>
                          {!message.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {selectedMessage ? (
                  <>
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{getTypeIcon(selectedMessage.type)}</div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {selectedMessage.subject}
                            </h3>
                            <p className="text-gray-600">
                              From: {selectedMessage.sender_name} • {new Date(selectedMessage.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="text-xl">⭐</span>
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <span className="text-xl">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.content}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                          Reply
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                          Forward
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📩</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Select a Message</h4>
                    <p className="text-gray-600">Choose a message from the inbox to view its content</p>
                  </div>
                )}
              </div>

              {/* Quick Compose */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">✉️</span>
                  Quick Message
                </h3>
                <div className="space-y-3">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Tutor</option>
                    <option value="ms-chen">Ms. Chen (Mathematics)</option>
                    <option value="dr-smith">Dr. Smith (Science)</option>
                    <option value="ms-johnson">Ms. Johnson (English)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Type your message..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors">
                    Send Message
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