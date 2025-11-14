// Database types for Eduhome platform
export interface User {
  id: string
  email: string
  full_name: string
  role: 'parent' | 'tutor' | 'student'
  avatar_url?: string
  phone_number?: string
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  user_id: string
  parent_id: string
  grade_level: string
  date_of_birth: string
  created_at: string
  updated_at: string
}

export interface Tutor {
  id: string
  user_id: string
  specialization: string[]
  qualification: string
  experience_years: number
  hourly_rate: number
  bio?: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Parent {
  id: string
  user_id: string
  relationship_to_student: string
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  description?: string
  grade_level: string
  created_at: string
}

export interface Lesson {
  id: string
  tutor_id: string
  subject_id: string
  title: string
  description: string
  content: string
  attachments?: string[]
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  lesson_id: string
  student_id: string
  status: 'pending' | 'submitted' | 'reviewed' | 'late'
  submission_url?: string
  submission_text?: string
  grade?: number
  feedback?: string
  submitted_at?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  tutor_id: string
  student_id: string
  subject_id: string
  scheduled_time: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  session_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  student_id: string
  subject_id: string
  current_level: number
  target_level: number
  progress_percentage: number
  last_updated: string
  updated_by_tutor_id: string
  remarks?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  parent_id: string
  tutor_id: string
  student_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  description: string
  due_date: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  session_id?: string
  content: string
  attachment_url?: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// UI component types
export interface DashboardCard {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  color?: string
}

export interface ProgressData {
  subject: string
  current: number
  target: number
  date: string
}

export interface LessonPlan {
  id: string
  title: string
  subject: string
  grade: string
  duration: number
  objectives: string[]
  materials: string[]
  activities: string[]
  assessment: string
}