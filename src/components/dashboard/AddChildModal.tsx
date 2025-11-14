'use client'

import { useState } from 'react'
import { parentService } from '@/lib/services/parentService'
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload'

interface AddChildModalProps {
  isOpen: boolean
  onClose: () => void
  parentId: string
  onChildAdded: () => void
}

export default function AddChildModal({ isOpen, onClose, parentId, onChildAdded }: AddChildModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade_level: '',
    date_of_birth: '',
    subjects: [] as string[]
  })
  const [error, setError] = useState<string | null>(null)
  const [childProfilePicture, setChildProfilePicture] = useState<string | null>(null)
  const [tempChildUserId, setTempChildUserId] = useState<string | null>(null)

  const availableSubjects = [
    'Mathematics', 'Science', 'English', 'History',
    'Physics', 'Chemistry', 'Biology', 'Art', 'Music'
  ]

  const gradeLevels = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // First create the child account with profile picture metadata
      const { supabase } = await import('@/lib/supabase')

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: 'student',
            avatar_url: childProfilePicture,
          },
        },
      })

      if (authError) {
        throw new Error(`Authentication error: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('Failed to create child account - no user data returned')
      }

      setTempChildUserId(authData.user.id)

      // Create user profile with avatar
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          full_name: formData.name,
          role: 'student',
          avatar_url: childProfilePicture,
        }])
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }

      // Then create the student record linking to the parent
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{
          user_id: authData.user.id,
          parent_id: parentId,
          grade_level: formData.grade_level,
          date_of_birth: formData.date_of_birth,
          full_name: formData.name,
          avatar_url: childProfilePicture,
        }])
        .select()
        .single()

      if (studentError) {
        throw new Error(`Database error: ${studentError.message}`)
      }

      onChildAdded()
      onClose()
      resetForm()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add child. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      grade_level: '',
      date_of_birth: '',
      subjects: []
    })
    setError(null)
    setChildProfilePicture(null)
    setTempChildUserId(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0 p-4">
      <div className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[95vh] overflow-y-auto my-4 md:my-auto">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-4 md:p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold flex items-center">
              <span className="text-2xl md:text-3xl mr-2 md:mr-3">👶</span>
              <span className="hidden sm:inline">Add Your Child</span>
              <span className="sm:hidden">Add Child</span>
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl md:text-2xl transition-colors p-1"
            >
              ×
            </button>
          </div>
          <p className="text-xs md:text-sm opacity-90 mt-2">Create a student account for your child to start their learning journey</p>
        </div>

        {/* Form content */}
        <div className="p-4 md:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Child Basic Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-100">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span className="text-xl md:text-2xl mr-2">👤</span> Child Information
              </h3>

              {/* Child Profile Picture */}
              <div className="flex justify-center mb-6">
                <ProfilePictureUpload
                  currentAvatar={childProfilePicture}
                  userId={tempChildUserId || 'temp-child'}
                  name={formData.name || 'Child'}
                  onAvatarChange={setChildProfilePicture}
                  size="xl"
                  editable={true}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm md:text-base text-black"
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm md:text-base text-black"
                    placeholder="child@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <select
                    name="grade_level"
                    value={formData.grade_level}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base text-black"
                  >
                    <option value="">Select Grade</option>
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base text-black"
                  />
                </div>
              </div>
            </div>

            {/* Login Credentials */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-100">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span className="text-xl md:text-2xl mr-2">🔐</span> Login Credentials
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm md:text-base text-black"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm md:text-base text-black"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span> Subjects (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">Select subjects your child needs help with:</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSubjects.map(subject => (
                  <label
                    key={subject}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                      formData.subjects.includes(subject)
                        ? 'border-purple-500 bg-gradient-to-r from-purple-100 to-pink-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className={`text-sm font-medium ${
                      formData.subjects.includes(subject) ? 'text-purple-700' : 'text-gray-700'
                    }`}>{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Child...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">👶</span> Add Child
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}