import { supabase } from '@/lib/supabase'

export interface UserSettings {
  id?: string
  user_id?: string

  // Profile Settings
  full_name?: string
  phone?: string
  location?: string
  bio?: string
  timezone?: string
  language?: string

  // Notification Settings
  email_notifications?: boolean
  push_notifications?: boolean
  sms_notifications?: boolean
  lesson_reminders?: boolean
  payment_alerts?: boolean
  message_notifications?: boolean
  progress_reports?: boolean
  marketing_emails?: boolean
  student_requests?: boolean

  // Privacy Settings
  profile_visibility?: 'public' | 'private'
  show_contact_info?: boolean
  data_sharing?: boolean
  two_factor_auth?: boolean

  // Appearance Settings
  theme?: 'light' | 'dark' | 'system'
  compact_mode?: boolean

  // Tutor-specific Settings (optional)
  subjects?: string[]
  languages?: string[]
  qualifications?: string
  experience?: string
  hourly_rate?: number
  teaching_levels?: string[]
  availability?: { [key: string]: { morning: boolean; afternoon: boolean; evening: boolean } }
  verification_status?: string
  average_rating?: number

  // Metadata
  created_at?: string
  updated_at?: string
}

class SettingsService {
  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // No settings found, return default settings
        return this.getDefaultSettings(userId)
      }

      if (error) throw error

      // Parse JSON fields
      return {
        ...data,
        subjects: data.subjects || [],
        languages: data.languages || [],
        teaching_levels: data.teaching_levels || [],
        availability: data.availability || {}
      }
    } catch (error) {
      console.error('Error fetching user settings:', error)
      return this.getDefaultSettings(userId)
    }
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
    try {
      // Check if settings already exist
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single()

      const updateData = {
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      }

      let error

      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('user_settings')
          .update(updateData)
          .eq('user_id', userId)

        error = updateError
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert(updateData)

        error = insertError
      }

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user settings:', error)
      return false
    }
  }

  async updateProfileSettings(userId: string, profileData: {
    full_name?: string
    phone?: string
    location?: string
    bio?: string
    timezone?: string
    language?: string
  }): Promise<boolean> {
    return this.updateUserSettings(userId, profileData)
  }

  async updateNotificationSettings(userId: string, notificationData: {
    email_notifications?: boolean
    push_notifications?: boolean
    sms_notifications?: boolean
    lesson_reminders?: boolean
    payment_alerts?: boolean
    message_notifications?: boolean
    progress_reports?: boolean
    marketing_emails?: boolean
    student_requests?: boolean
  }): Promise<boolean> {
    return this.updateUserSettings(userId, notificationData)
  }

  async updatePrivacySettings(userId: string, privacyData: {
    profile_visibility?: 'public' | 'private'
    show_contact_info?: boolean
    data_sharing?: boolean
    two_factor_auth?: boolean
  }): Promise<boolean> {
    return this.updateUserSettings(userId, privacyData)
  }

  async updateAppearanceSettings(userId: string, appearanceData: {
    theme?: 'light' | 'dark' | 'system'
    compact_mode?: boolean
  }): Promise<boolean> {
    return this.updateUserSettings(userId, appearanceData)
  }

  async updateTutorSettings(userId: string, tutorData: {
    subjects?: string[]
    languages?: string[]
    qualifications?: string
    experience?: string
    hourly_rate?: number
    teaching_levels?: string[]
    availability?: { [key: string]: { morning: boolean; afternoon: boolean; evening: boolean } }
  }): Promise<boolean> {
    return this.updateUserSettings(userId, {
      subjects: tutorData.subjects || [],
      languages: tutorData.languages || [],
      qualifications: tutorData.qualifications,
      experience: tutorData.experience,
      hourly_rate: tutorData.hourly_rate,
      teaching_levels: tutorData.teaching_levels || [],
      availability: tutorData.availability || {}
    })
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword
      })

      if (signInError) {
        return { success: false, message: 'Current password is incorrect' }
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        return { success: false, message: updateError.message }
      }

      return { success: true, message: 'Password changed successfully' }
    } catch (error) {
      console.error('Error changing password:', error)
      return { success: false, message: 'An error occurred while changing password' }
    }
  }

  async updateAvatar(userId: string, avatarUrl: string | null): Promise<boolean> {
    try {
      // Update user metadata with avatar URL
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating avatar:', error)
      return false
    }
  }

  private getDefaultSettings(userId: string): UserSettings {
    return {
      user_id: userId,
      full_name: '',
      phone: '',
      location: '',
      bio: '',
      timezone: 'Asia/Kuala_Lumpur',
      language: 'English',

      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      lesson_reminders: true,
      payment_alerts: true,
      message_notifications: true,
      progress_reports: true,
      marketing_emails: false,
      student_requests: true,

      profile_visibility: 'private',
      show_contact_info: false,
      data_sharing: false,
      two_factor_auth: false,

      theme: 'light',
      compact_mode: false,

      subjects: [],
      languages: [],
      qualifications: '',
      experience: '',
      hourly_rate: 0,
      teaching_levels: [],
      availability: {},
      verification_status: 'pending',
      average_rating: 0.00
    }
  }

  // Helper method to get user's account information
  async getUserAccountInfo(userId: string) {
    try {
      // Get user from auth
      const { data: authUser } = await supabase.auth.getUser()

      // Get user's subscription info (this would need to be implemented based on your payment system)
      const subscriptionInfo = {
        account_status: 'Active',
        member_since: authUser.user?.created_at ? new Date(authUser.user.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }) : 'Unknown',
        subscription_plan: 'Premium', // This would come from your subscription table
        children_count: 0 // This would come from students table
      }

      // Get children count for parents
      if (authUser.user?.user_metadata?.role === 'parent') {
        const { data: children } = await supabase
          .from('students')
          .select('id')
          .eq('parent_id', userId)

        subscriptionInfo.children_count = children?.length || 0
      }

      // Get student count for tutors
      if (authUser.user?.user_metadata?.role === 'tutor') {
        const { data: students } = await supabase
          .from('sessions')
          .select('student_id')
          .eq('tutor_id', userId)

        const uniqueStudents = new Set(students?.map(s => s.student_id))
        subscriptionInfo.children_count = uniqueStudents.size || 0
      }

      return subscriptionInfo
    } catch (error) {
      console.error('Error fetching account info:', error)
      return {
        account_status: 'Active',
        member_since: 'Unknown',
        subscription_plan: 'Basic',
        children_count: 0
      }
    }
  }
}

export const settingsService = new SettingsService()