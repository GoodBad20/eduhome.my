// Generated database types for Eduhome.my
// This is a simplified version to fix TypeScript errors

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'parent' | 'tutor'
          avatar_url: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role: 'parent' | 'tutor'
          avatar_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'parent' | 'tutor'
          avatar_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          parent_id: string
          user_id: string
          full_name: string | null
          grade: string | null
          school: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          user_id: string
          full_name?: string | null
          grade?: string | null
          school?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          user_id?: string
          full_name?: string | null
          grade?: string | null
          school?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tutor_profiles: {
        Row: {
          id: string
          user_id: string
          qualification: string
          experience_years: number
          hourly_rate: number
          location: string
          about: string | null
          availability: any
          languages: string[]
          teaching_levels: string[]
          rating: number
          reviews_count: number
          students_count: number
          is_verified: boolean
          is_active: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          qualification: string
          experience_years?: number
          hourly_rate?: number
          location: string
          about?: string | null
          availability?: any
          languages?: string[]
          teaching_levels?: string[]
          rating?: number
          reviews_count?: number
          students_count?: number
          is_verified?: boolean
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          qualification?: string
          experience_years?: number
          hourly_rate?: number
          location?: string
          about?: string | null
          availability?: any
          languages?: string[]
          teaching_levels?: string[]
          rating?: number
          reviews_count?: number
          students_count?: number
          is_verified?: boolean
          is_active?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant_1_id: string
          participant_2_id: string
          last_message: string | null
          last_message_time: string | null
          related_student_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_1_id: string
          participant_2_id: string
          last_message?: string | null
          last_message_time?: string | null
          related_student_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_1_id?: string
          participant_2_id?: string
          last_message?: string | null
          last_message_time?: string | null
          related_student_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          receiver_id: string
          content: string
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          receiver_id: string
          content: string
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          tutor_id: string
          student_id: string
          title: string
          description: string
          subject: string
          due_date: string
          status: 'draft' | 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'completed'
          max_score: number
          materials: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          student_id: string
          title: string
          description: string
          subject: string
          due_date: string
          status?: 'draft' | 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'completed'
          max_score: number
          materials?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          student_id?: string
          title?: string
          description?: string
          subject?: string
          due_date?: string
          status?: 'draft' | 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'completed'
          max_score?: number
          materials?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      assignment_submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          content: string
          attachments: string[] | null
          score: number | null
          feedback: string | null
          status: 'submitted' | 'graded'
          graded_at: string | null
          graded_by: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          content: string
          attachments?: string[] | null
          score?: number | null
          feedback?: string | null
          status?: 'submitted' | 'graded'
          graded_at?: string | null
          graded_by?: string | null
          submitted_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          content?: string
          attachments?: string[] | null
          score?: number | null
          feedback?: string | null
          status?: 'submitted' | 'graded'
          graded_at?: string | null
          graded_by?: string | null
          submitted_at?: string
        }
      }
      assignment_templates: {
        Row: {
          id: string
          tutor_id: string
          title: string
          description: string
          subject: string
          default_max_score: number
          estimated_duration: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          tags: string[] | null
          is_public: boolean
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          title: string
          description: string
          subject: string
          default_max_score: number
          estimated_duration: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          tags?: string[] | null
          is_public?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          title?: string
          description?: string
          subject?: string
          default_max_score?: number
          estimated_duration?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          tags?: string[] | null
          is_public?: boolean
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      schedule_slots: {
        Row: {
          id: string
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          recurring?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          tutor_id: string
          student_id: string
          subject: string
          title: string
          description: string | null
          scheduled_time: string
          duration_minutes: number
          location: string | null
          type: 'online' | 'in_person'
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link: string | null
          notes: string | null
          materials: string[] | null
          rate: number | null
          is_paid: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          student_id: string
          subject: string
          title: string
          description?: string | null
          scheduled_time: string
          duration_minutes?: number
          location?: string | null
          type?: 'online' | 'in_person'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link?: string | null
          notes?: string | null
          materials?: string[] | null
          rate?: number | null
          is_paid?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          student_id?: string
          subject?: string
          title?: string
          description?: string | null
          scheduled_time?: string
          duration_minutes?: number
          location?: string | null
          type?: 'online' | 'in_person'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          meeting_link?: string | null
          notes?: string | null
          materials?: string[] | null
          rate?: number | null
          is_paid?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      recurring_lessons: {
        Row: {
          id: string
          tutor_id: string
          student_id: string
          subject: string
          title: string
          day_of_week: number
          start_time: string
          duration_minutes: number
          location: string | null
          type: 'online' | 'in_person'
          rate: number | null
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tutor_id: string
          student_id: string
          subject: string
          title: string
          day_of_week: number
          start_time: string
          duration_minutes?: number
          location?: string | null
          type?: 'online' | 'in_person'
          rate?: number | null
          start_date: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tutor_id?: string
          student_id?: string
          subject?: string
          title?: string
          day_of_week?: number
          start_time?: string
          duration_minutes?: number
          location?: string | null
          type?: 'online' | 'in_person'
          rate?: number | null
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]