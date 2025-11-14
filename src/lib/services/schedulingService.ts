import { supabase } from '@/lib/supabase'

export interface ScheduleSlot {
  id: string
  tutor_id: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string // HH:MM format
  end_time: string // HH:MM format
  is_available: boolean
  recurring: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  tutor_id: string
  student_id: string
  subject: string
  title: string
  description?: string
  scheduled_time: string
  duration_minutes: number
  location?: string
  type: 'online' | 'in_person'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  meeting_link?: string
  notes?: string
  materials?: string[]
  rate?: number
  is_paid: boolean
  created_at: string
  updated_at: string
  student_name?: string
  parent_name?: string
  tutor_name?: string
}

export interface RecurringLesson {
  id: string
  tutor_id: string
  student_id: string
  subject: string
  title: string
  day_of_week: number // 0-6 (Sunday-Saturday)
  start_time: string
  duration_minutes: number
  location?: string
  type: 'online' | 'in_person'
  rate?: number
  start_date: string
  end_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
  student_name?: string
  parent_name?: string
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
  lesson?: Lesson
}

class SchedulingService {
  // Get tutor's schedule slots
  async getTutorScheduleSlots(tutorId: string): Promise<ScheduleSlot[]> {
    try {
      const { data: slots, error } = await supabase
        .from('schedule_slots')
        .select('*')
        .eq('tutor_id', tutorId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error

      return slots
    } catch (error) {
      console.error('Error fetching schedule slots:', error)
      return []
    }
  }

  // Create or update schedule slot
  async upsertScheduleSlot(slotData: {
    tutor_id: string
    day_of_week: number
    start_time: string
    end_time: string
    is_available: boolean
    recurring: boolean
  }): Promise<ScheduleSlot | null> {
    try {
      const { data: slot, error } = await supabase
        .from('schedule_slots')
        .upsert([{
          ...slotData,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      return slot
    } catch (error) {
      console.error('Error upserting schedule slot:', error)
      return null
    }
  }

  // Delete schedule slot
  async deleteScheduleSlot(slotId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('schedule_slots')
        .delete()
        .eq('id', slotId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error deleting schedule slot:', error)
      return false
    }
  }

  // Get tutor's lessons
  async getTutorLessons(tutorId: string, startDate?: string, endDate?: string): Promise<Lesson[]> {
    try {
      let query = supabase
        .from('lessons')
        .select(`
          *,
          student:students(
            id,
            full_name,
            parent_id,
            users!students_parent_id_fkey(full_name)
          ),
          tutor:users!lessons_tutor_id_fkey(full_name)
        `)
        .eq('tutor_id', tutorId)

      if (startDate) {
        query = query.gte('scheduled_time', startDate)
      }
      if (endDate) {
        query = query.lte('scheduled_time', endDate)
      }

      const { data: lessons, error } = await query
        .order('scheduled_time', { ascending: true })

      if (error) throw error

      return lessons.map(lesson => ({
        ...lesson,
        student_name: lesson.student?.full_name || 'Unknown Student',
        parent_name: lesson.student?.users?.full_name || 'Unknown Parent',
        tutor_name: lesson.tutor?.full_name || 'Unknown Tutor'
      }))
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return []
    }
  }

  // Create new lesson
  async createLesson(lessonData: {
    tutor_id: string
    student_id: string
    subject: string
    title: string
    description?: string
    scheduled_time: string
    duration_minutes: number
    location?: string
    type: 'online' | 'in_person'
    notes?: string
    materials?: string[]
    rate?: number
  }): Promise<Lesson | null> {
    try {
      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert([{
          ...lessonData,
          status: 'scheduled',
          is_paid: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Generate meeting link for online lessons
      if (lessonData.type === 'online') {
        await this.generateMeetingLink(lesson.id)
      }

      // Send notifications
      await this.notifyLessonScheduled(lesson)

      return lesson
    } catch (error) {
      console.error('Error creating lesson:', error)
      return null
    }
  }

  // Update lesson
  async updateLesson(
    lessonId: string,
    updates: Partial<Lesson>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error updating lesson:', error)
      return false
    }
  }

  // Update lesson status
  async updateLessonStatus(
    lessonId: string,
    status: Lesson['status'],
    notes?: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (notes) updateData.notes = notes

      const { error } = await supabase
        .from('lessons')
        .update(updateData)
        .eq('id', lessonId)

      if (error) throw error

      // Send notifications for status changes
      if (status === 'cancelled' || status === 'completed') {
        await this.notifyLessonStatusChange(lessonId, status)
      }

      return true
    } catch (error) {
      console.error('Error updating lesson status:', error)
      return false
    }
  }

  // Delete lesson
  async deleteLesson(lessonId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error deleting lesson:', error)
      return false
    }
  }

  // Get recurring lessons
  async getRecurringLessons(tutorId: string): Promise<RecurringLesson[]> {
    try {
      const { data: lessons, error } = await supabase
        .from('recurring_lessons')
        .select(`
          *,
          student:students(
            id,
            full_name,
            parent_id,
            users!students_parent_id_fkey(full_name)
          )
        `)
        .eq('tutor_id', tutorId)
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error

      return lessons.map(lesson => ({
        ...lesson,
        student_name: lesson.student?.full_name || 'Unknown Student',
        parent_name: lesson.student?.users?.full_name || 'Unknown Parent'
      }))
    } catch (error) {
      console.error('Error fetching recurring lessons:', error)
      return []
    }
  }

  // Create recurring lesson
  async createRecurringLesson(lessonData: {
    tutor_id: string
    student_id: string
    subject: string
    title: string
    day_of_week: number
    start_time: string
    duration_minutes: number
    location?: string
    type: 'online' | 'in_person'
    rate?: number
    start_date: string
    end_date?: string
  }): Promise<RecurringLesson | null> {
    try {
      const { data: lesson, error } = await supabase
        .from('recurring_lessons')
        .insert([{
          ...lessonData,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      return lesson
    } catch (error) {
      console.error('Error creating recurring lesson:', error)
      return null
    }
  }

  // Get available time slots for a specific date
  async getAvailableTimeSlots(
    tutorId: string,
    date: string
  ): Promise<TimeSlot[]> {
    try {
      const dayOfWeek = new Date(date).getDay()

      // Get tutor's schedule slots for this day
      const scheduleSlots = await this.getTutorScheduleSlots(tutorId)
      const daySlots = scheduleSlots.filter(slot => slot.day_of_week === dayOfWeek && slot.is_available)

      // Get existing lessons for this date
      const lessons = await this.getTutorLessons(tutorId, date, date)

      // Convert schedule slots to available time slots
      const timeSlots: TimeSlot[] = []
      for (const slot of daySlots) {
        // Check if this time slot conflicts with any existing lesson
        const hasConflict = lessons.some(lesson => {
          const lessonStart = new Date(lesson.scheduled_time)
          const lessonEnd = new Date(lessonStart.getTime() + lesson.duration_minutes * 60000)
          const slotStart = new Date(`${date} ${slot.start_time}`)
          const slotEnd = new Date(`${date} ${slot.end_time}`)

          return (
            (lessonStart >= slotStart && lessonStart < slotEnd) ||
            (lessonEnd > slotStart && lessonEnd <= slotEnd) ||
            (lessonStart <= slotStart && lessonEnd >= slotEnd)
          )
        })

        timeSlots.push({
          start: slot.start_time,
          end: slot.end_time,
          available: !hasConflict
        })
      }

      return timeSlots
    } catch (error) {
      console.error('Error getting available time slots:', error)
      return []
    }
  }

  // Get weekly schedule
  async getWeeklySchedule(tutorId: string, weekStart: string): Promise<Lesson[]> {
    try {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const lessons = await this.getTutorLessons(tutorId, weekStart, weekEnd.toISOString())
      return lessons
    } catch (error) {
      console.error('Error getting weekly schedule:', error)
      return []
    }
  }

  // Get upcoming lessons
  async getUpcomingLessons(tutorId: string, limit: number = 10): Promise<Lesson[]> {
    try {
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select(`
          *,
          student:students(
            id,
            full_name,
            parent_id,
            users!students_parent_id_fkey(full_name)
          )
        `)
        .eq('tutor_id', tutorId)
        .in('status', ['scheduled', 'confirmed'])
        .gte('scheduled_time', new Date().toISOString())
        .order('scheduled_time', { ascending: true })
        .limit(limit)

      if (error) throw error

      return lessons.map(lesson => ({
        ...lesson,
        student_name: lesson.student?.full_name || 'Unknown Student',
        parent_name: lesson.student?.users?.full_name || 'Unknown Parent'
      }))
    } catch (error) {
      console.error('Error fetching upcoming lessons:', error)
      return []
    }
  }

  // Get lesson statistics
  async getLessonStats(tutorId: string): Promise<{
    total: number
    this_week: number
    this_month: number
    completed: number
    cancelled: number
    upcoming: number
    total_hours: number
    total_earnings: number
  }> {
    try {
      const now = new Date()
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const allLessons = await this.getTutorLessons(tutorId)
      const thisWeekLessons = allLessons.filter(lesson =>
        new Date(lesson.scheduled_time) >= weekStart
      )
      const thisMonthLessons = allLessons.filter(lesson =>
        new Date(lesson.scheduled_time) >= monthStart
      )
      const completedLessons = allLessons.filter(lesson => lesson.status === 'completed')
      const upcomingLessons = allLessons.filter(lesson =>
        ['scheduled', 'confirmed'].includes(lesson.status)
      )

      const totalHours = completedLessons.reduce((sum, lesson) => sum + lesson.duration_minutes / 60, 0)
      const totalEarnings = completedLessons.reduce((sum, lesson) => sum + (lesson.rate || 0), 0)

      return {
        total: allLessons.length,
        this_week: thisWeekLessons.length,
        this_month: thisMonthLessons.length,
        completed: completedLessons.length,
        cancelled: allLessons.filter(lesson => lesson.status === 'cancelled').length,
        upcoming: upcomingLessons.length,
        total_hours: Math.round(totalHours * 100) / 100,
        total_earnings: Math.round(totalEarnings * 100) / 100
      }
    } catch (error) {
      console.error('Error getting lesson stats:', error)
      return {
        total: 0,
        this_week: 0,
        this_month: 0,
        completed: 0,
        cancelled: 0,
        upcoming: 0,
        total_hours: 0,
        total_earnings: 0
      }
    }
  }

  // Private methods
  private async generateMeetingLink(lessonId: string): Promise<void> {
    try {
      // This would integrate with a video conferencing service
      // For now, generate a placeholder link
      const meetingLink = `https://meet.jit.si/eduhomemy-lesson-${lessonId}`

      await supabase
        .from('lessons')
        .update({ meeting_link: meetingLink })
        .eq('id', lessonId)
    } catch (error) {
      console.error('Error generating meeting link:', error)
    }
  }

  private async notifyLessonScheduled(lesson: Lesson): Promise<void> {
    try {
      // This would integrate with the messaging service
      console.log('Lesson scheduled notification sent:', lesson.id)
    } catch (error) {
      console.error('Error sending lesson notification:', error)
    }
  }

  private async notifyLessonStatusChange(lessonId: string, status: string): Promise<void> {
    try {
      // This would integrate with the messaging service
      console.log(`Lesson ${status} notification sent:`, lessonId)
    } catch (error) {
      console.error('Error sending lesson status notification:', error)
    }
  }
}

export const schedulingService = new SchedulingService()