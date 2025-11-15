import { supabase } from '@/lib/supabase'

export interface Assignment {
  id: string
  tutor_id: string
  student_id: string
  title: string
  description: string
  subject: string
  due_date: string
  status: 'draft' | 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'completed'
  max_score: number
  created_at: string
  updated_at: string
  student_name?: string
  parent_name?: string
  submission_date?: string
  score?: number
  feedback?: string
  materials?: string[]
}

export interface AssignmentSubmission {
  id: string
  assignment_id: string
  student_id: string
  content: string
  attachments?: string[]
  submitted_at: string
  score?: number
  feedback?: string
  status: 'submitted' | 'graded'
  graded_at?: string
  graded_by?: string
}

export interface AssignmentTemplate {
  id: string
  tutor_id: string
  title: string
  description: string
  subject: string
  default_max_score: number
  estimated_duration: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  is_public: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

class AssignmentService {
  // Get all assignments for a tutor
  async getTutorAssignments(tutorId: string): Promise<Assignment[]> {
    try {
      const { data: assignments, error } = await supabase
        .from('assignments')
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
        .order('created_at', { ascending: false })

      if (error) throw error

      return assignments.map(assignment => ({
        ...assignment,
        student_name: assignment.student?.full_name || 'Unknown Student',
        parent_name: assignment.student?.users?.full_name || 'Unknown Parent'
      }))
    } catch (error) {
      console.error('Error fetching tutor assignments:', error)
      return []
    }
  }

  // Create a new assignment
  async createAssignment(assignmentData: {
    tutor_id: string
    student_id: string
    title: string
    description: string
    subject: string
    due_date: string
    max_score: number
    materials?: string[]
  }): Promise<Assignment | null> {
    try {
      const { data: assignment, error } = await supabase
        .from('assignments')
        .insert([{
          ...assignmentData,
          status: 'assigned',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Send notification to parent
      await this.notifyParentAssignment(assignment)

      return assignment
    } catch (error) {
      console.error('Error creating assignment:', error)
      return null
    }
  }

  // Update assignment status
  async updateAssignmentStatus(
    assignmentId: string,
    status: Assignment['status'],
    score?: number,
    feedback?: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (score !== undefined) updateData.score = score
      if (feedback) updateData.feedback = feedback

      const { error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', assignmentId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error updating assignment:', error)
      return false
    }
  }

  // Get assignment submissions
  async getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    try {
      const { data: submissions, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      return submissions
    } catch (error) {
      console.error('Error fetching submissions:', error)
      return []
    }
  }

  // Submit assignment (for students)
  async submitAssignment(
    assignmentId: string,
    studentId: string,
    content: string,
    attachments?: string[]
  ): Promise<AssignmentSubmission | null> {
    try {
      const { data: submission, error } = await supabase
        .from('assignment_submissions')
        .insert([{
          assignment_id: assignmentId,
          student_id: studentId,
          content,
          attachments: attachments || [],
          submitted_at: new Date().toISOString(),
          status: 'submitted'
        }])
        .select()
        .single()

      if (error) throw error

      // Update assignment status
      await this.updateAssignmentStatus(assignmentId, 'submitted')

      return submission
    } catch (error) {
      console.error('Error submitting assignment:', error)
      return null
    }
  }

  // Grade assignment submission
  async gradeSubmission(
    submissionId: string,
    score: number,
    feedback: string,
    tutorId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('assignment_submissions')
        .update({
          score,
          feedback,
          status: 'graded',
          graded_at: new Date().toISOString(),
          graded_by: tutorId
        })
        .eq('id', submissionId)

      if (error) throw error

      // Get assignment to update its status
      const { data: submission } = await supabase
        .from('assignment_submissions')
        .select('assignment_id')
        .eq('id', submissionId)
        .single()

      if (submission) {
        await this.updateAssignmentStatus(submission.assignment_id, 'reviewed', score, feedback)
      }

      return true
    } catch (error) {
      console.error('Error grading submission:', error)
      return false
    }
  }

  // Get assignment templates
  async getAssignmentTemplates(tutorId: string): Promise<AssignmentTemplate[]> {
    try {
      const { data: templates, error } = await supabase
        .from('assignment_templates')
        .select('*')
        .eq('tutor_id', tutorId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return templates
    } catch (error) {
      console.error('Error fetching templates:', error)
      return []
    }
  }

  // Create assignment template
  async createAssignmentTemplate(templateData: {
    tutor_id: string
    title: string
    description: string
    subject: string
    default_max_score: number
    estimated_duration: number
    difficulty_level: 'beginner' | 'intermediate' | 'advanced'
    tags?: string[]
    is_public?: boolean
  }): Promise<AssignmentTemplate | null> {
    try {
      const { data: template, error } = await supabase
        .from('assignment_templates')
        .insert([{
          ...templateData,
          tags: templateData.tags || [],
          is_public: templateData.is_public || false,
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      return template
    } catch (error) {
      console.error('Error creating template:', error)
      return null
    }
  }

  // Create assignment from template
  async createAssignmentFromTemplate(
    templateId: string,
    studentId: string,
    dueDate: string,
    tutorId: string
  ): Promise<Assignment | null> {
    try {
      // Get template
      const { data: template, error: templateError } = await supabase
        .from('assignment_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError || !template) throw templateError

      // Create assignment
      const assignment = await this.createAssignment({
        tutor_id: tutorId,
        student_id: studentId,
        title: template.title,
        description: template.description,
        subject: template.subject,
        due_date: dueDate,
        max_score: template.default_max_score
      })

      if (assignment) {
        // Increment template usage count
        await supabase
          .from('assignment_templates')
          .update({ usage_count: template.usage_count + 1 })
          .eq('id', templateId)
      }

      return assignment
    } catch (error) {
      console.error('Error creating assignment from template:', error)
      return null
    }
  }

  // Get assignments by status
  async getAssignmentsByStatus(
    tutorId: string,
    status: Assignment['status']
  ): Promise<Assignment[]> {
    try {
      const assignments = await this.getTutorAssignments(tutorId)
      return assignments.filter(assignment => assignment.status === status)
    } catch (error) {
      console.error('Error fetching assignments by status:', error)
      return []
    }
  }

  // Get overdue assignments
  async getOverdueAssignments(tutorId: string): Promise<Assignment[]> {
    try {
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select(`
          *,
          student:students(full_name, users!students_parent_id_fkey(full_name))
        `)
        .eq('tutor_id', tutorId)
        .lt('due_date', new Date().toISOString())
        .in('status', ['assigned', 'in_progress'])
        .order('due_date', { ascending: true })

      if (error) throw error

      return assignments.map(assignment => ({
        ...assignment,
        student_name: assignment.student?.full_name || 'Unknown Student',
        parent_name: assignment.student?.users?.full_name || 'Unknown Parent'
      }))
    } catch (error) {
      console.error('Error fetching overdue assignments:', error)
      return []
    }
  }

  // Delete assignment
  async deleteAssignment(assignmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error deleting assignment:', error)
      return false
    }
  }

  // Get assignments for a parent (for their children)
  async getParentAssignments(parentId: string): Promise<Assignment[]> {
    try {
      // Get all children for this parent
      const { data: children, error: childrenError } = await supabase
        .from('students')
        .select('id, full_name')
        .eq('parent_id', parentId)

      if (childrenError) throw childrenError

      if (children.length === 0) return []

      const childIds = children.map(child => child.id)

      // Get assignments for all children
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select(`
          *,
          tutor:tutors(
            id,
            full_name
          )
        `)
        .in('student_id', childIds)
        .order('created_at', { ascending: false })

      if (error) throw error

      return assignments.map(assignment => {
        const child = children.find(c => c.id === assignment.student_id)
        return {
          ...assignment,
          student_name: child?.full_name || 'Unknown Student',
          parent_name: 'Current Parent'
        }
      })
    } catch (error) {
      console.error('Error fetching parent assignments:', error)
      return []
    }
  }

  // Get assignments for a specific child
  async getChildAssignments(childId: string): Promise<Assignment[]> {
    try {
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select(`
          *,
          tutor:tutors(
            id,
            full_name
          ),
          student:students(
            id,
            full_name
          )
        `)
        .eq('student_id', childId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return assignments.map(assignment => ({
        ...assignment,
        student_name: assignment.student?.full_name || 'Unknown Student'
      }))
    } catch (error) {
      console.error('Error fetching child assignments:', error)
      return []
    }
  }

  // Get assignment statistics
  async getAssignmentStats(tutorId: string): Promise<{
    total: number
    draft: number
    assigned: number
    in_progress: number
    submitted: number
    reviewed: number
    completed: number
    overdue: number
  }> {
    try {
      const assignments = await this.getTutorAssignments(tutorId)
      const overdue = await this.getOverdueAssignments(tutorId)

      return {
        total: assignments.length,
        draft: assignments.filter(a => a.status === 'draft').length,
        assigned: assignments.filter(a => a.status === 'assigned').length,
        in_progress: assignments.filter(a => a.status === 'in_progress').length,
        submitted: assignments.filter(a => a.status === 'submitted').length,
        reviewed: assignments.filter(a => a.status === 'reviewed').length,
        completed: assignments.filter(a => a.status === 'completed').length,
        overdue: overdue.length
      }
    } catch (error) {
      console.error('Error getting assignment stats:', error)
      return {
        total: 0,
        draft: 0,
        assigned: 0,
        in_progress: 0,
        submitted: 0,
        reviewed: 0,
        completed: 0,
        overdue: 0
      }
    }
  }

  // Get parent assignment statistics
  async getParentAssignmentStats(parentId: string): Promise<{
    total: number
    pending: number
    in_progress: number
    submitted: number
    completed: number
    overdue: number
    average_score: number
  }> {
    try {
      const assignments = await this.getParentAssignments(parentId)
      const today = new Date()

      const overdue = assignments.filter(assignment =>
        new Date(assignment.due_date) < today &&
        ['assigned', 'in_progress'].includes(assignment.status)
      )

      const completedAssignments = assignments.filter(a => a.status === 'reviewed' && a.score !== null)
      const averageScore = completedAssignments.length > 0
        ? completedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssignments.length
        : 0

      return {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'assigned').length,
        in_progress: assignments.filter(a => a.status === 'in_progress').length,
        submitted: assignments.filter(a => a.status === 'submitted').length,
        completed: assignments.filter(a => a.status === 'reviewed').length,
        overdue: overdue.length,
        average_score: Math.round(averageScore)
      }
    } catch (error) {
      console.error('Error getting parent assignment stats:', error)
      return {
        total: 0,
        pending: 0,
        in_progress: 0,
        submitted: 0,
        completed: 0,
        overdue: 0,
        average_score: 0
      }
    }
  }

  // Private method to notify parent about new assignment
  private async notifyParentAssignment(assignment: Assignment): Promise<void> {
    try {
      // This would integrate with the messaging service
      // For now, it's a placeholder for the notification logic
      console.log('Assignment notification sent to parent:', assignment.id)
    } catch (error) {
      console.error('Error sending assignment notification:', error)
    }
  }
}

export const assignmentService = new AssignmentService()