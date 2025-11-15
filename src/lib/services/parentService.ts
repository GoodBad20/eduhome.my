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

  // Schedule a new lesson
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
}

export const parentService = new ParentService()