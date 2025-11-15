import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export interface ChildData {
  id: string
  name: string
  user_id: string
  grade_level: string
  date_of_birth: string
  progress?: number
  subjects?: string[]
  next_lesson?: string
  avatar_url?: string | null
}

export interface ActivityData {
  id: string
  student_name: string
  activity: string
  time: string
  type: 'success' | 'info' | 'warning' | 'error'
  icon: string
}

export interface AchievementData {
  id: string
  title: string
  icon: string
  description: string
  earned?: boolean
}

export interface LessonData {
  id: string
  student_name: string
  subject: string
  tutor_name: string
  time: string
  duration: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface PaymentData {
  id: string
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  due_date: string
  paid_at?: string
}

// Enhanced Scheduling Interfaces
export interface ScheduleActivity {
  id: string
  child_id: string
  child_name: string
  title: string
  description?: string
  activity_type: ActivityType
  start_time: string
  end_time: string
  date: string
  is_recurring: boolean
  recurrence_pattern?: RecurrencePattern
  location?: string
  tutor_id?: string
  tutor_name?: string
  is_completed: boolean
  priority: 'low' | 'medium' | 'high'
  color?: string
  reminders: Reminder[]
  attachments?: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface ActivityType {
  id: string
  name: string
  category: 'academic' | 'extracurricular' | 'personal' | 'health' | 'social'
  icon: string
  default_duration: number // in minutes
  color: string
  description?: string
  is_active: boolean
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number // every X days/weeks/months
  days_of_week?: number[] // 0-6 (Sunday-Saturday) for weekly
  day_of_month?: number // 1-31 for monthly
  end_date?: string
  end_occurrences?: number
}

export interface Reminder {
  id: string
  type: 'notification' | 'email' | 'sms'
  minutes_before: number
  is_enabled: boolean
}

export interface ScheduleTemplate {
  id: string
  name: string
  description?: string
  activities: Omit<ScheduleActivity, 'id' | 'child_id' | 'child_name' | 'created_at' | 'updated_at'>[]
  is_public: boolean
  created_by: string
  created_at: string
}

class ParentService {
  // Fetch children for the current parent
  async getChildren(parentId: string): Promise<ChildData[]> {
    try {
      console.log('Fetching children for parent:', parentId)

      // Get students from students table with their details
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          user_id,
          parent_id,
          full_name,
          grade_level,
          date_of_birth,
          avatar_url,
          bio
        `)
        .eq('parent_id', parentId)

      if (studentsError) {
        console.error('Students query error:', studentsError)
        throw studentsError
      }

      console.log('Found students:', students)

      if (!students || students.length === 0) {
        return []
      }

      const childrenData: ChildData[] = []

      for (const student of students) {
        try {
          let childName = student.full_name || 'Unknown'
          let avatarUrl = student.avatar_url

          // If no full_name in students table, try to get it from users table
          if (!student.full_name) {
            const { data: user, error: userError } = await supabase
              .from('users')
              .select('full_name, avatar_url')
              .eq('id', student.user_id)
              .single()

            if (!userError && user) {
              childName = user.full_name || 'Unknown'
              // Use user avatar_url if student doesn't have one
              avatarUrl = student.avatar_url || user.avatar_url
              console.log('Found name from users table:', childName)
            } else {
              // Fallback: create name from email
              const { data: authUser } = await supabase.auth.admin.getUserById(student.user_id)
              if (authUser.user?.email) {
                childName = 'Student ' + authUser.user.email.split('@')[0]
                console.log('Created name from email:', childName)
              }
            }
          }

          childrenData.push({
            id: student.id,
            name: childName,
            user_id: student.user_id,
            grade_level: student.grade_level?.toString() || '',
            date_of_birth: student.date_of_birth || '',
            avatar_url: avatarUrl,
            progress: this.calculateProgress(student.id),
            subjects: ['Mathematics', 'Science', 'English'], // TODO: Get from actual data
            next_lesson: this.getNextLesson(student.id)
          })

          console.log('Processed child:', childName, 'with avatar:', avatarUrl)
        } catch (error) {
          console.error('Error processing student:', student.id, error)
          childrenData.push({
            id: student.id,
            name: student.full_name || 'Unknown',
            user_id: student.user_id,
            grade_level: student.grade_level?.toString() || '',
            date_of_birth: student.date_of_birth || '',
            avatar_url: student.avatar_url,
            progress: this.calculateProgress(student.id),
            subjects: ['Mathematics', 'Science', 'English'],
            next_lesson: this.getNextLesson(student.id)
          })
        }
      }

      return childrenData
    } catch (error) {
      console.error('Error fetching children:', error)
      return []
    }
  }

  // Update existing child information
  async updateChild(childId: string, childData: {
    name?: string
    grade_level?: string
    date_of_birth?: string
    subjects?: string[]
    avatar_url?: string | null
    bio?: string
  }) {
    try {
      // Update student record
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .update({
          full_name: childData.name,
          grade_level: childData.grade_level,
          date_of_birth: childData.date_of_birth,
          avatar_url: childData.avatar_url,
          bio: childData.bio
        })
        .eq('id', childId)
        .select()
        .single()

      if (studentError) {
        throw new Error(`Database error: ${studentError.message}`)
      }

      // Also update the user profile if name or avatar changed
      if (childData.name || childData.avatar_url) {
        // Get the user_id first
        const { data: student } = await supabase
          .from('students')
          .select('user_id')
          .eq('id', childId)
          .single()

        if (student?.user_id) {
          const { error: userError } = await supabase
            .from('users')
            .update({
              full_name: childData.name,
              avatar_url: childData.avatar_url
            })
            .eq('id', student.user_id)

          if (userError) {
            console.error('Failed to update user profile:', userError)
            // Don't throw here as student update was successful
          }
        }
      }

      return studentData
    } catch (error) {
      console.error('Error updating child:', error)
      throw error
    }
  }

  // Delete a child account
  async deleteChild(childId: string) {
    try {
      // First get the user_id to delete the auth account
      const { data: student } = await supabase
        .from('students')
        .select('user_id')
        .eq('id', childId)
        .single()

      // Delete student record
      const { error: studentError } = await supabase
        .from('students')
        .delete()
        .eq('id', childId)

      if (studentError) {
        throw new Error(`Database error: ${studentError.message}`)
      }

      // Also delete user profile
      if (student?.user_id) {
        const { error: userError } = await supabase
          .from('users')
          .delete()
          .eq('id', student.user_id)

        if (userError) {
          console.error('Failed to delete user profile:', userError)
        }

        // Note: Deleting the auth account requires admin privileges
        // This might need to be handled by a server function
      }

      return true
    } catch (error) {
      console.error('Error deleting child:', error)
      throw error
    }
  }

  // Add a new child (create student account)
  async addChild(parentId: string, childData: {
    name: string
    email: string
    password: string
    grade_level: string
    date_of_birth: string
    subjects?: string[]
    avatar_url?: string | null
  }) {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: childData.email,
        password: childData.password
      })

      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account - no user data returned')
      }

      // Create user profile manually
      console.log('Creating user profile with name:', childData.name)
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          full_name: childData.name,
          avatar_url: childData.avatar_url,
          role: 'student',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Profile might already exist, try to update it
        const { error: updateError } = await supabase
          .from('users')
          .update({
            full_name: childData.name,
            avatar_url: childData.avatar_url,
            role: 'student'
          })
          .eq('id', authData.user.id)

        if (updateError) {
          console.error('Profile update error:', updateError)
          throw new Error(`Failed to create/update user profile: ${updateError.message}`)
        } else {
          console.log('Profile updated successfully')
        }
      } else {
        console.log('Profile created successfully:', profileData)
      }

      // Then create the student record linking to the parent
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{
          user_id: authData.user.id,
          parent_id: parentId,
          full_name: childData.name,
          grade_level: childData.grade_level,
          date_of_birth: childData.date_of_birth,
          avatar_url: childData.avatar_url
        }])
        .select()
        .single()

      if (studentError) {
        throw new Error(`Database error: ${studentError.message}`)
      }

      return studentData
    } catch (error) {
      console.error('Error adding child:', error)
      throw error
    }
  }

  // Calculate student progress (mock implementation)
  private calculateProgress(studentId: string): number {
    // TODO: Calculate based on actual assignments and grades
    return Math.floor(Math.random() * 30) + 70 // Random between 70-100
  }

  // Get next lesson for student (mock implementation)
  private getNextLesson(studentId: string): string {
    // TODO: Get from actual sessions data
    return 'Today, 3:00 PM - Math with Ms. Chen'
  }

  // Fetch recent activities
  async getRecentActivities(parentId: string): Promise<ActivityData[]> {
    try {
      // Mock data for now - replace with actual database queries
      const mockActivities: ActivityData[] = [
        {
          id: '1',
          student_name: 'Sarah',
          activity: '📚 Completed Math Assignment',
          time: '2 hours ago',
          type: 'success',
          icon: '✅'
        },
        {
          id: '2',
          student_name: 'Tom',
          activity: '🔬 Science Lesson Scheduled',
          time: '4 hours ago',
          type: 'info',
          icon: '📅'
        },
        {
          id: '3',
          student_name: 'Sarah',
          activity: '💳 Payment Processed',
          time: '1 day ago',
          type: 'warning',
          icon: '💰'
        },
        {
          id: '4',
          student_name: 'Tom',
          activity: '📊 Progress Report Available',
          time: '2 days ago',
          type: 'success',
          icon: '🎉'
        }
      ]

      return mockActivities
    } catch (error) {
      console.error('Error fetching activities:', error)
      return []
    }
  }

  // Fetch achievements
  async getAchievements(parentId: string): Promise<AchievementData[]> {
    try {
      // Mock achievements - replace with actual data
      const mockAchievements: AchievementData[] = [
        { id: '1', title: 'Math Master', icon: '🏆', description: 'Complete 10 math lessons', earned: true },
        { id: '2', title: 'Science Explorer', icon: '🔬', description: 'Finish science module', earned: true },
        { id: '3', title: 'Reading Champion', icon: '📖', description: 'Read 5 books', earned: false }
      ]

      return mockAchievements
    } catch (error) {
      console.error('Error fetching achievements:', error)
      return []
    }
  }

  // Fetch upcoming lessons
  async getUpcomingLessons(parentId: string): Promise<LessonData[]> {
    try {
      // TODO: Replace with actual database query
      const mockLessons: LessonData[] = [
        {
          id: '1',
          student_name: 'Sarah Johnson',
          subject: 'Mathematics',
          tutor_name: 'Ms. Chen',
          time: 'Today, 3:00 PM',
          duration: '60 min',
          status: 'scheduled'
        },
        {
          id: '2',
          student_name: 'Tom Johnson',
          subject: 'Science',
          tutor_name: 'Dr. Smith',
          time: 'Tomorrow, 4:30 PM',
          duration: '45 min',
          status: 'scheduled'
        }
      ]

      return mockLessons
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return []
    }
  }

  // Fetch payment history
  async getPaymentHistory(parentId: string): Promise<PaymentData[]> {
    try {
      // TODO: Replace with actual database query
      const mockPayments: PaymentData[] = [
        {
          id: '1',
          amount: 120,
          description: 'Math Lessons - Sarah',
          status: 'completed',
          due_date: '2024-11-10',
          paid_at: '2024-11-09'
        },
        {
          id: '2',
          amount: 80,
          description: 'Science Lessons - Tom',
          status: 'pending',
          due_date: '2024-11-15'
        }
      ]

      return mockPayments
    } catch (error) {
      console.error('Error fetching payments:', error)
      return []
    }
  }

  // Enhanced Scheduling Methods

  // Get all activity types
  async getActivityTypes(): Promise<ActivityType[]> {
    try {
      const { data, error } = await supabase
        .from('activity_types')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })

      if (error) throw error

      // Return default activity types if none exist
      if (!data || data.length === 0) {
        return this.getDefaultActivityTypes()
      }

      return data as ActivityType[]
    } catch (error) {
      console.error('Error fetching activity types:', error)
      return this.getDefaultActivityTypes()
    }
  }

  // Get default activity types
  private getDefaultActivityTypes(): ActivityType[] {
    return [
      { id: '1', name: 'Tuition Class', category: 'academic', icon: '📚', default_duration: 60, color: '#3B82F6', description: 'Private or group tuition sessions', is_active: true },
      { id: '2', name: 'Homework Time', category: 'academic', icon: '✏️', default_duration: 45, color: '#10B981', description: 'Dedicated time for homework and assignments', is_active: true },
      { id: '3', name: 'Reading', category: 'academic', icon: '📖', default_duration: 30, color: '#8B5CF6', description: 'Reading books and literature', is_active: true },
      { id: '4', name: 'Math Practice', category: 'academic', icon: '🔢', default_duration: 45, color: '#F59E0B', description: 'Mathematics practice and problem solving', is_active: true },
      { id: '5', name: 'Science Lab', category: 'academic', icon: '🔬', default_duration: 60, color: '#EF4444', description: 'Science experiments and practical work', is_active: true },
      { id: '6', name: 'Sports', category: 'extracurricular', icon: '⚽', default_duration: 60, color: '#10B981', description: 'Physical activities and sports', is_active: true },
      { id: '7', name: 'Music Practice', category: 'extracurricular', icon: '🎵', default_duration: 30, color: '#EC4899', description: 'Musical instrument practice', is_active: true },
      { id: '8', name: 'Art & Craft', category: 'extracurricular', icon: '🎨', default_duration: 45, color: '#F97316', description: 'Creative arts and crafts', is_active: true },
      { id: '9', name: 'Meal Time', category: 'personal', icon: '🍽️', default_duration: 30, color: '#84CC16', description: 'Breakfast, lunch, or dinner', is_active: true },
      { id: '10', name: 'Free Play', category: 'personal', icon: '🎮', default_duration: 60, color: '#06B6D4', description: 'Unstructured play and recreation', is_active: true },
      { id: '11', name: 'Screen Time', category: 'personal', icon: '📱', default_duration: 30, color: '#6366F1', description: 'Educational or entertainment screen time', is_active: true },
      { id: '12', name: 'Exercise', category: 'health', icon: '💪', default_duration: 30, color: '#059669', description: 'Physical exercise and fitness', is_active: true },
      { id: '13', name: 'Meditation', category: 'health', icon: '🧘', default_duration: 15, color: '#7C3AED', description: 'Mindfulness and meditation', is_active: true },
      { id: '14', name: 'Sleep', category: 'health', icon: '😴', default_duration: 480, color: '#1F2937', description: 'Bedtime and sleep', is_active: true },
      { id: '15', name: 'Family Time', category: 'social', icon: '👨‍👩‍👧‍👦', default_duration: 60, color: '#DC2626', description: 'Quality time with family', is_active: true },
      { id: '16', name: 'Playdate', category: 'social', icon: '👫', default_duration: 120, color: '#7C2D12', description: 'Social interaction with friends', is_active: true }
    ]
  }

  // Get schedule for a specific child and date range
  async getChildSchedule(childId: string, startDate: string, endDate: string): Promise<ScheduleActivity[]> {
    try {
      const { data, error } = await supabase
        .from('schedule_activities')
        .select(`
          *,
          activity_type:activity_types(*)
        `)
        .eq('child_id', childId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) {
        // If schedule_activities table doesn't exist, use sessions table as fallback
        console.log('schedule_activities table not found, using sessions table as fallback')

        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .eq('student_id', childId)
          .gte('scheduled_time', `${startDate}T00:00:00Z`)
          .lte('scheduled_time', `${endDate}T23:59:59Z`)
          .order('scheduled_time', { ascending: true })

        if (sessionsError) throw sessionsError

        // Convert sessions to ScheduleActivity format
        const activities: ScheduleActivity[] = (sessionsData || []).map(session => {
          const sessionDate = session.scheduled_time.split('T')[0]
          const sessionTime = session.scheduled_time.split('T')[1].split(':').slice(0, 2).join(':')

          // Calculate end time based on duration
          const [hours, minutes] = sessionTime.split(':').map(Number)
          const totalMinutes = hours * 60 + minutes + (session.duration_minutes || 60)
          const endHours = Math.floor(totalMinutes / 60)
          const endMinutes = totalMinutes % 60
          const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

          return {
            id: session.id,
            child_id: session.student_id,
            child_name: '', // Will be filled by caller
            title: session.notes || session.subject || 'Activity',
            description: session.notes,
            activity_type: session.subject || 'custom',
            subject: session.subject,
            date: sessionDate,
            start_time: sessionTime,
            end_time: endTime,
            duration: session.duration_minutes || 60,
            location: null,
            status: session.status as any || 'scheduled',
            priority: 'medium',
            is_recurring: false,
            recurrence_pattern: null,
            reminders: null,
            notes: session.notes,
            color: '#106EBE',
            created_at: session.created_at,
            updated_at: session.updated_at
          }
        })

        return activities
      }

      return this.formatScheduleActivities(data || [])
    } catch (error) {
      console.error('Error fetching child schedule:', error)
      return []
    }
  }

  // Get schedule for all children in a date range
  async getFamilySchedule(parentId: string, startDate: string, endDate: string): Promise<ScheduleActivity[]> {
    try {
      // First get all children for this parent
      const children = await this.getChildren(parentId)

      if (children.length === 0) return []

      const childIds = children.map(child => child.id)

      const { data, error } = await supabase
        .from('schedule_activities')
        .select(`
          *,
          activity_type:activity_types(*)
        `)
        .in('child_id', childIds)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) {
        // If schedule_activities table doesn't exist, use sessions table as fallback
        console.log('schedule_activities table not found, using sessions table as fallback')

        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .in('student_id', childIds)
          .gte('scheduled_time', `${startDate}T00:00:00Z`)
          .lte('scheduled_time', `${endDate}T23:59:59Z`)
          .order('scheduled_time', { ascending: true })

        if (sessionsError) throw sessionsError

        // Convert sessions to ScheduleActivity format
        const activities: ScheduleActivity[] = (sessionsData || []).map(session => {
          const sessionDate = session.scheduled_time.split('T')[0]
          const sessionTime = session.scheduled_time.split('T')[1].split(':').slice(0, 2).join(':')
          const child = children.find(c => c.id === session.student_id)

          // Calculate end time based on duration
          const [hours, minutes] = sessionTime.split(':').map(Number)
          const totalMinutes = hours * 60 + minutes + (session.duration_minutes || 60)
          const endHours = Math.floor(totalMinutes / 60)
          const endMinutes = totalMinutes % 60
          const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

          return {
            id: session.id,
            child_id: session.student_id,
            child_name: child?.name || 'Unknown',
            title: session.notes || session.subject || 'Activity',
            description: session.notes,
            activity_type: session.subject || 'custom',
            subject: session.subject,
            date: sessionDate,
            start_time: sessionTime,
            end_time: endTime,
            duration: session.duration_minutes || 60,
            location: null,
            status: session.status as any || 'scheduled',
            priority: 'medium',
            is_recurring: false,
            recurrence_pattern: null,
            reminders: null,
            notes: session.notes,
            color: '#106EBE',
            created_at: session.created_at,
            updated_at: session.updated_at
          }
        })

        return activities
      }

      return this.formatScheduleActivities(data || [])
    } catch (error) {
      console.error('Error fetching family schedule:', error)
      return []
    }
  }

  // Format schedule activities from database response
  private formatScheduleActivities(data: any[]): ScheduleActivity[] {
    return data.map(item => ({
      id: item.id,
      child_id: item.child_id,
      child_name: item.child_name || 'Unknown',
      title: item.title,
      description: item.description,
      activity_type: item.activity_type || this.getDefaultActivityTypes()[0],
      start_time: item.start_time,
      end_time: item.end_time,
      date: item.date,
      is_recurring: item.is_recurring,
      recurrence_pattern: item.recurrence_pattern,
      location: item.location,
      tutor_id: item.tutor_id,
      tutor_name: item.tutor_name,
      is_completed: item.is_completed,
      priority: item.priority || 'medium',
      color: item.color,
      reminders: item.reminders || [],
      attachments: item.attachments || [],
      notes: item.notes,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))
  }

  // Create a new schedule activity
  async createScheduleActivity(activityData: Omit<ScheduleActivity, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleActivity> {
    try {
      // First try to use the schedule_activities table
      const { data, error } = await supabase
        .from('schedule_activities')
        .insert([{
          ...activityData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        // If schedule_activities table doesn't exist, use sessions table as fallback
        console.log('schedule_activities table not found, using sessions table as fallback')

        const sessionData = {
          student_id: activityData.child_id,
          subject: activityData.subject || activityData.activity_type,
          tutor_id: null, // Set to null for general activities
          scheduled_time: `${activityData.date}T${activityData.start_time}:00Z`,
          duration_minutes: activityData.duration || 60,
          status: activityData.status || 'scheduled',
          notes: activityData.description || activityData.title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: sessionResult, error: sessionError } = await supabase
          .from('sessions')
          .insert([sessionData])
          .select()
          .single()

        if (sessionError) throw sessionError

        // Convert session result back to ScheduleActivity format
        const formattedActivity: ScheduleActivity = {
          id: sessionResult.id,
          child_id: sessionResult.student_id,
          child_name: activityData.child_name,
          title: activityData.title,
          description: activityData.description,
          activity_type: activityData.activity_type,
          subject: sessionResult.subject,
          date: activityData.date,
          start_time: activityData.start_time,
          end_time: activityData.end_time,
          duration: sessionResult.duration_minutes,
          location: activityData.location,
          status: sessionResult.status as any,
          priority: activityData.priority,
          is_recurring: activityData.is_recurring,
          recurrence_pattern: activityData.recurrence_pattern,
          reminders: activityData.reminders,
          notes: sessionResult.notes,
          color: activityData.color,
          created_at: sessionResult.created_at,
          updated_at: sessionResult.updated_at
        }

        return formattedActivity
      }

      return this.formatScheduleActivities([data])[0]
    } catch (error) {
      console.error('Error creating schedule activity:', error)
      throw error
    }
  }

  // Update an existing schedule activity
  async updateScheduleActivity(activityId: string, updates: Partial<ScheduleActivity>): Promise<ScheduleActivity> {
    try {
      const { data, error } = await supabase
        .from('schedule_activities')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId)
        .select()
        .single()

      if (error) throw error

      return this.formatScheduleActivities([data])[0]
    } catch (error) {
      console.error('Error updating schedule activity:', error)
      throw error
    }
  }

  // Delete a schedule activity
  async deleteScheduleActivity(activityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('schedule_activities')
        .delete()
        .eq('id', activityId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error deleting schedule activity:', error)
      throw error
    }
  }

  // Create recurring activities
  async createRecurringActivity(baseActivity: Omit<ScheduleActivity, 'id' | 'created_at' | 'updated_at'>): Promise<ScheduleActivity[]> {
    if (!baseActivity.is_recurring || !baseActivity.recurrence_pattern) {
      throw new Error('Activity must be recurring with a valid pattern')
    }

    const activities: ScheduleActivity[] = []
    const { type, interval, days_of_week, end_date, end_occurrences } = baseActivity.recurrence_pattern
    let currentDate = new Date(baseActivity.date)
    let occurrenceCount = 0
    const maxOccurrences = end_occurrences || 100 // Prevent infinite loops

    while (occurrenceCount < maxOccurrences) {
      // Check if we should stop based on end date or occurrences
      if (end_date && currentDate > new Date(end_date)) break
      if (end_occurrences && occurrenceCount >= end_occurrences) break

      // Check if this date matches the recurrence pattern
      if (this.doesDateMatchPattern(currentDate, baseActivity.recurrence_pattern)) {
        const activity: ScheduleActivity = {
          ...baseActivity,
          date: currentDate.toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        activities.push(activity)
        occurrenceCount++
      }

      // Move to next potential date
      currentDate = this.getNextRecurrenceDate(currentDate, baseActivity.recurrence_pattern)
    }

    // Batch insert all activities
    try {
      const { data, error } = await supabase
        .from('schedule_activities')
        .insert(activities)
        .select()

      if (error) throw error

      return this.formatScheduleActivities(data || [])
    } catch (error) {
      console.error('Error creating recurring activities:', error)
      throw error
    }
  }

  // Check if a date matches the recurrence pattern
  private doesDateMatchPattern(date: Date, pattern: RecurrencePattern): boolean {
    switch (pattern.type) {
      case 'daily':
        return true
      case 'weekly':
        return pattern.days_of_week?.includes(date.getDay()) ?? true
      case 'monthly':
        return date.getDate() === (pattern.day_of_month || date.getDate())
      case 'yearly':
        return date.getDate() === new Date(pattern.end_date || '').getDate() &&
               date.getMonth() === new Date(pattern.end_date || '').getMonth()
      default:
        return false
    }
  }

  // Get the next date for recurrence
  private getNextRecurrenceDate(date: Date, pattern: RecurrencePattern): Date {
    const nextDate = new Date(date)

    switch (pattern.type) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + (pattern.interval || 1))
        break
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + (7 * (pattern.interval || 1)))
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + (pattern.interval || 1))
        break
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + (pattern.interval || 1))
        break
    }

    return nextDate
  }

  // Schedule a new lesson (legacy method)
  async scheduleLesson(lessonData: {
    student_id: string
    subject: string
    tutor_id: string
    scheduled_time: string
    duration_minutes: number
  }) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{
          ...lessonData,
          status: 'scheduled'
        }])
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error scheduling lesson:', error)
      throw error
    }
  }

  // Send message to tutor
  async sendMessage(messageData: {
    receiver_id: string
    content: string
    session_id?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Get dashboard statistics
  async getDashboardStats(parentId: string) {
    try {
      // TODO: Calculate actual stats from database
      const stats = {
        activeLessons: 12,
        childrenEnrolled: 2,
        totalSpent: 1240,
        upcomingSessions: 5
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        activeLessons: 0,
        childrenEnrolled: 0,
        totalSpent: 0,
        upcomingSessions: 0
      }
    }
  }

  // Get schedule statistics for a parent
  async getScheduleStatistics(parentId: string): Promise<{
    totalActivities: number
    thisWeek: number
    upcomingLessons: number
    completedToday: number
  }> {
    try {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      endOfWeek.setHours(23, 59, 59, 999)

      const todayString = today.toISOString().split('T')[0]
      const tomorrowString = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      // Get family schedule for all children
      const activities = await this.getFamilySchedule(
        parentId,
        startOfWeek.toISOString().split('T')[0],
        tomorrowString
      )

      const totalActivities = activities.length
      const thisWeek = activities.filter(activity => {
        const activityDate = new Date(activity.date)
        return activityDate >= startOfWeek && activityDate <= endOfWeek
      }).length
      const upcomingLessons = activities.filter(activity =>
        activity.date >= todayString &&
        activity.activity_type === 'lesson' &&
        activity.status === 'scheduled'
      ).length
      const completedToday = activities.filter(activity =>
        activity.date === todayString &&
        activity.status === 'completed'
      ).length

      return {
        totalActivities,
        thisWeek,
        upcomingLessons,
        completedToday
      }
    } catch (error) {
      console.error('Error getting schedule statistics:', error)
      // Return default values on error
      return {
        totalActivities: 0,
        thisWeek: 0,
        upcomingLessons: 0,
        completedToday: 0
      }
    }
  }

  // Get learning insights for a parent
  async getLearningInsights(parentId: string): Promise<{
    mostActiveSubject: string
    mostActiveSubjectProgress: number
    weeklyGoalProgress: {
      current: number
      target: number
    }
    recommendation: string
  }> {
    try {
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      endOfWeek.setHours(23, 59, 59, 999)

      // Get family schedule for this week
      const activities = await this.getFamilySchedule(
        parentId,
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      )

      // Count subjects
      const subjectCounts: { [key: string]: number } = {}
      activities.forEach(activity => {
        const subject = activity.subject || 'General'
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
      })

      // Find most active subject
      const mostActiveSubject = Object.keys(subjectCounts).reduce((a, b) =>
        subjectCounts[a] > subjectCounts[b] ? a : b
      , Object.keys(subjectCounts)[0] || 'Mathematics')

      const totalSessions = activities.length
      const mostActiveSubjectProgress = totalSessions > 0 ?
        Math.min(100, (subjectCounts[mostActiveSubject] / totalSessions) * 100) : 0

      // Calculate weekly goal progress (assuming goal is 15 hours/week)
      const weeklyMinutes = activities.reduce((total, activity) => {
        const duration = activity.duration || 60
        return total + duration
      }, 0)
      const weeklyHours = Math.round(weeklyMinutes / 60)
      const weeklyGoalTarget = 15

      // Generate recommendation
      let recommendation = "Keep up the great work!"
      const subjects = Object.keys(subjectCounts)
      if (subjects.length === 1) {
        recommendation = `Consider adding activities in different subject areas for a balanced approach`
      } else if (weeklyHours < weeklyGoalTarget) {
        recommendation = `Try to add ${weeklyGoalTarget - weeklyHours} more hours of activities this week`
      } else if (mostActiveSubjectProgress > 80) {
        const otherSubjects = subjects.filter(s => s !== mostActiveSubject)
        if (otherSubjects.length > 0) {
          recommendation = `Great progress in ${mostActiveSubject}! Consider exploring more ${otherSubjects[0]} activities`
        }
      }

      return {
        mostActiveSubject,
        mostActiveSubjectProgress: Math.round(mostActiveSubjectProgress),
        weeklyGoalProgress: {
          current: weeklyHours,
          target: weeklyGoalTarget
        },
        recommendation
      }
    } catch (error) {
      console.error('Error getting learning insights:', error)
      // Return default values on error
      return {
        mostActiveSubject: 'Mathematics',
        mostActiveSubjectProgress: 0,
        weeklyGoalProgress: {
          current: 0,
          target: 15
        },
        recommendation: 'Start adding activities to see personalized insights'
      }
    }
  }
}

export const parentService = new ParentService()