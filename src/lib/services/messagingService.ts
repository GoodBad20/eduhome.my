import { supabase } from '@/lib/supabase'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  updated_at: string
  read_at?: string
  sender_name?: string
  sender_role?: 'parent' | 'tutor'
}

export interface Conversation {
  id: string
  participant_1_id: string
  participant_2_id: string
  last_message?: string
  last_message_time?: string
  created_at: string
  updated_at: string
  participant_1_name?: string
  participant_2_name?: string
  participant_1_role?: 'parent' | 'tutor'
  participant_2_role?: 'parent' | 'tutor'
  unread_count?: number
  related_student_id?: string
  student_name?: string
}

export interface ConversationWithDetails extends Conversation {
  other_participant: {
    id: string
    name: string
    role: 'parent' | 'tutor'
    email?: string
  }
  last_message_content?: string
  unread_count: number
}

class MessagingService {
  // Get all conversations for the current user
  async getConversations(userId: string, userRole: 'parent' | 'tutor'): Promise<ConversationWithDetails[]> {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:users!conversations_participant_1_id_fkey(
            id,
            full_name,
            role,
            email
          ),
          participant_2:users!conversations_participant_2_id_fkey(
            id,
            full_name,
            role,
            email
          ),
          related_student:students(
            id,
            full_name
          )
        `)
        .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Transform conversations to include other participant details
      const conversationsWithDetails = conversations.map(conv => {
        const isParticipant1 = conv.participant_1_id === userId
        const otherParticipant = isParticipant1 ? conv.participant_2 : conv.participant_1

        return {
          ...conv,
          other_participant: {
            id: otherParticipant.id,
            name: otherParticipant.full_name || 'Unknown User',
            role: otherParticipant.role as 'parent' | 'tutor',
            email: otherParticipant.email
          },
          student_name: conv.related_student?.full_name,
          last_message_content: conv.last_message,
          unread_count: 0 // Will be calculated separately
        }
      })

      // Get unread count for each conversation
      for (const conv of conversationsWithDetails) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('receiver_id', userId)
          .is('read_at', null)

        conv.unread_count = count || 0
      }

      return conversationsWithDetails
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  // Get messages for a specific conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(
            full_name,
            role
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return messages.map(msg => ({
        ...msg,
        sender_name: msg.sender?.full_name || 'Unknown User',
        sender_role: msg.sender?.role as 'parent' | 'tutor'
      }))
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  // Send a message
  async sendMessage(conversationId: string, senderId: string, receiverId: string, content: string): Promise<Message | null> {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: senderId,
          receiver_id: receiverId,
          content: content.trim()
        }])
        .select()
        .single()

      if (error) throw error

      // Update conversation's last message and timestamp
      await supabase
        .from('conversations')
        .update({
          last_message: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      return message
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  // Create a new conversation
  async createConversation(
    participant1Id: string,
    participant2Id: string,
    relatedStudentId?: string
  ): Promise<string | null> {
    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1_id.eq.${participant1Id},participant_2_id.eq.${participant2Id}),and(participant_1_id.eq.${participant2Id},participant_2_id.eq.${participant1Id})`)
        .single()

      if (existingConv) {
        return existingConv.id
      }

      // Create new conversation
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert([{
          participant_1_id: participant1Id,
          participant_2_id: participant2Id,
          related_student_id: relatedStudentId
        }])
        .select('id')
        .single()

      if (error) throw error

      return conversation.id
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', userId)
        .is('read_at', null)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // Get conversations with a specific student's parents (for tutors)
  async getStudentParentConversations(tutorId: string, studentId: string): Promise<ConversationWithDetails[]> {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('parent_id, users!students_parent_id_fkey(full_name, email)')
        .eq('id', studentId)
        .single()

      if (error || !students) return []

      const parentId = students.parent_id
      const parentName = students.users?.full_name || 'Unknown Parent'

      // Check if conversation exists with this parent
      const { data: conversation } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:users!conversations_participant_1_id_fkey(full_name, role),
          participant_2:users!conversations_participant_2_id_fkey(full_name, role)
        `)
        .or(`and(participant_1_id.eq.${tutorId},participant_2_id.eq.${parentId}),and(participant_1_id.eq.${parentId},participant_2_id.eq.${tutorId})`)
        .single()

      if (!conversation) return []

      const isParticipant1 = conversation.participant_1_id === tutorId
      const otherParticipant = isParticipant1 ? conversation.participant_2 : conversation.participant_1

      return [{
        ...conversation,
        other_participant: {
          id: otherParticipant.id,
          name: otherParticipant.full_name || 'Unknown User',
          role: otherParticipant.role as 'parent' | 'tutor'
        },
        student_name: students.related_student?.full_name,
        last_message_content: conversation.last_message,
        unread_count: 0
      }]
    } catch (error) {
      console.error('Error getting student parent conversations:', error)
      return []
    }
  }

  // Send progress update to parent
  async sendProgressUpdate(
    tutorId: string,
    parentId: string,
    studentId: string,
    subject: string,
    progress: string,
    notes?: string
  ): Promise<boolean> {
    try {
      // Create or get conversation
      const conversationId = await this.createConversation(tutorId, parentId, studentId)
      if (!conversationId) return false

      // Create progress update message
      const progressMessage = `📊 **Progress Update - ${subject}**\n\n${progress}${notes ? `\n\n**Notes:** ${notes}` : ''}`

      const message = await this.sendMessage(conversationId, tutorId, parentId, progressMessage)
      return !!message
    } catch (error) {
      console.error('Error sending progress update:', error)
      return false
    }
  }

  // Schedule lesson reminder
  async sendLessonReminder(
    tutorId: string,
    parentId: string,
    studentId: string,
    lessonDetails: {
      subject: string
      date: string
      time: string
      duration: string
      type: 'online' | 'in_person'
    }
  ): Promise<boolean> {
    try {
      // Create or get conversation
      const conversationId = await this.createConversation(tutorId, parentId, studentId)
      if (!conversationId) return false

      const reminderMessage = `📅 **Lesson Reminder**\n\n**Subject:** ${lessonDetails.subject}\n**Date:** ${lessonDetails.date}\n**Time:** ${lessonDetails.time}\n**Duration:** ${lessonDetails.duration}\n**Type:** ${lessonDetails.type === 'online' ? 'Online Lesson' : 'In-Person Lesson'}\n\nLooking forward to the session!`

      const message = await this.sendMessage(conversationId, tutorId, parentId, reminderMessage)
      return !!message
    } catch (error) {
      console.error('Error sending lesson reminder:', error)
      return false
    }
  }
}

export const messagingService = new MessagingService()