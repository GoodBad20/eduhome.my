'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { messagingService, ConversationWithDetails, Message } from '@/lib/services/messagingService'

export default function TutorMessagesPage() {
  const { user } = useSupabase()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)

  // Load conversations on component mount
  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const userConversations = await messagingService.getConversations(user?.id || '', 'tutor')
      setConversations(userConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const conversationMessages = await messagingService.getMessages(conversationId)
      setMessages(conversationMessages)

      // Mark messages as read
      await messagingService.markMessagesAsRead(conversationId, user?.id || '')

      // Update unread count in conversations list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !user) return

    try {
      setSendingMessage(true)
      const selectedConv = conversations.find(c => c.id === selectedConversation)
      if (!selectedConv) return

      const newMessage = await messagingService.sendMessage(
        selectedConversation,
        user.id,
        selectedConv.other_participant.id,
        messageInput.trim()
      )

      if (newMessage) {
        // Add message to local state
        setMessages(prev => [...prev, {
          ...newMessage,
          sender_name: user.user_metadata?.full_name || 'You',
          sender_role: 'tutor'
        }])

        // Update conversation's last message
        setConversations(prev =>
          prev.map(conv =>
            conv.id === selectedConversation
              ? {
                  ...conv,
                  last_message_content: messageInput.trim(),
                  updated_at: new Date().toISOString()
                }
                : conv
          )
        )

        setMessageInput('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleQuickAction = async (action: string, studentName?: string) => {
    if (!user) return

    const selectedConv = conversations.find(c => c.id === selectedConversation)
    if (!selectedConv) return

    let message = ''

    switch (action) {
      case 'progress':
        message = `📊 **Progress Update**\n\n${studentName || 'Your child'} has been making excellent progress in our recent lessons. Key improvements include:\n\n• Better understanding of core concepts\n• Improved problem-solving skills\n• Increased confidence in the subject\n\nLet's continue this momentum in our next session!`
        break
      case 'assignment':
        message = `📝 **New Assignment**\n\nI've prepared a new assignment for ${studentName || 'your child'} to reinforce what we've covered:\n\n• Focus areas: [To be specified]\n• Due date: [To be discussed]\n• Estimated time: 30-45 minutes\n\nPlease let me know if you have any questions!`
        break
      case 'schedule':
        message = `📅 **Scheduling**\n\nI'd like to schedule our next lesson for ${studentName || 'your child'}. Please let me know your preferred:\n\n• Days of the week\n• Time slots\n• Any schedule conflicts\n\nLooking forward to continuing our learning journey!`
        break
      case 'report':
        message = `📈 **Monthly Progress Report**\n\nHere's ${studentName || 'your child'}'s progress summary:\n\n**Strengths:**\n• [List key strengths]\n\n**Areas for Improvement:**\n• [List areas to work on]\n\n**Recommendations:**\n• [Provide suggestions]\n\nLet's discuss this in detail during our next session!`
        break
    }

    if (message) {
      setMessageInput(message)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="p-6 h-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with parents about their children's progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">💬</div>
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-500 mt-1">Start messaging parents from your student list</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{conversation.other_participant.name}</p>
                        <p className="text-sm text-gray-500">
                          {conversation.other_participant.role === 'parent' ? 'Parent' : 'Tutor'}
                          {conversation.student_name && ` • ${conversation.student_name}`}
                        </p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.last_message_content || 'No messages yet'}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(conversation.updated_at)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            {selectedConversation && conversations.find(c => c.id === selectedConversation) ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.other_participant.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {conversations.find(c => c.id === selectedConversation)?.other_participant.role === 'parent' ? 'Parent' : 'Tutor'}
                        {conversations.find(c => c.id === selectedConversation)?.student_name &&
                          ` • ${conversations.find(c => c.id === selectedConversation)?.student_name}`
                        }
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm font-medium mb-1">{message.sender_name}</p>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? 'text-white opacity-75' : 'text-gray-500'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={sendingMessage}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !messageInput.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                      {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <p className="text-gray-500 text-lg font-medium">Select a conversation to start messaging</p>
                  <p className="text-gray-500 text-sm mt-2">Choose a parent from the list to view and send messages</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickAction('progress', conversations.find(c => c.id === selectedConversation)?.student_name)}
              disabled={!selectedConversation}
              className="p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm font-medium text-gray-900">Send Progress Update</p>
            </button>
            <button
              onClick={() => handleQuickAction('assignment', conversations.find(c => c.id === selectedConversation)?.student_name)}
              disabled={!selectedConversation}
              className="p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm font-medium text-gray-900">Send Assignment</p>
            </button>
            <button
              onClick={() => handleQuickAction('schedule', conversations.find(c => c.id === selectedConversation)?.student_name)}
              disabled={!selectedConversation}
              className="p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">📅</div>
              <p className="text-sm font-medium text-gray-900">Schedule Lesson</p>
            </button>
            <button
              onClick={() => handleQuickAction('report', conversations.find(c => c.id === selectedConversation)?.student_name)}
              disabled={!selectedConversation}
              className="p-4 text-center bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm font-medium text-gray-900">Progress Report</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}