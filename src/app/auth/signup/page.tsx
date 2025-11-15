'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function SignupPage() {
  const { t } = useLanguage()
  const {
    trackUserRegistration,
    trackFormStart,
    trackSuccessfulSubmission,
    trackAnalyticsError,
    trackUserInteraction
  } = useAnalytics()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'parent' as 'parent' | 'tutor',
    // Additional fields based on role
    qualification: '',
    experienceYears: '',
    hourlyRate: '',
    relationship: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [tempUserId, setTempUserId] = useState<string | null>(null)

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Track form start
    trackFormStart('Signup Form')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      trackAnalyticsError('Passwords do not match', 'Signup Form')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      trackAnalyticsError('Password too short', 'Signup Form')
      setLoading(false)
      return
    }

    // Include role-specific metadata
    const metadata: any = {
      full_name: formData.fullName,
      role: formData.role,
      avatar_url: profilePicture,
    }

    // Add role-specific fields to metadata
    if (formData.role === 'tutor') {
      metadata.qualification = formData.qualification
      metadata.experience_years = formData.experienceYears
      metadata.hourly_rate = formData.hourlyRate
    } else if (formData.role === 'parent') {
      metadata.relationship = formData.relationship
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/login`,
          // Disable email confirmation for development
        },
      })

      if (error) {
        setError(error.message)
        trackAnalyticsError(error, 'Signup Form')
      } else if (data.user) {
        setTempUserId(data.user.id)

        // Track successful registration
        trackUserRegistration('email')
        trackSuccessfulSubmission('Signup Form')

        // Create user profile with avatar
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            role: formData.role,
            avatar_url: profilePicture,
          } as any)

        if (profileError) {
          console.error('Profile creation error:', profileError)
          trackAnalyticsError(profileError, 'Profile Creation')
        }

        // If tutor, create tutor profile
        if (formData.role === 'tutor') {
          const { error: tutorError } = await supabase
            .from('tutor_profiles')
            .insert({
              user_id: data.user.id,
              qualification: formData.qualification,
              experience_years: parseInt(formData.experienceYears) || 0,
              hourly_rate: parseFloat(formData.hourlyRate) || 0,
              location: 'Malaysia', // Default location
              avatar_url: profilePicture,
            } as any)

          if (tutorError) {
            console.error('Tutor profile creation error:', tutorError)
            trackAnalyticsError(tutorError, 'Tutor Profile Creation')
          }
        }

        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (error) {
      setError('An unexpected error occurred')
      trackAnalyticsError(error, 'Signup Form')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Account Created!</h1>
          <p className="text-slate-600 mb-4">
            Your account has been successfully created. Redirecting to login page...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:py-12 sm:px-6 overflow-x-hidden">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <Link href="/" className="flex justify-center items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg"></div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EduHome.my</h1>
          </Link>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            {t('auth.signup')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="flex justify-center mb-6">
              <ProfilePictureUpload
                currentAvatar={profilePicture || undefined}
                userId={tempUserId || 'temp'}
                name={formData.fullName || 'User'}
                onAvatarChange={(url) => {
                  setProfilePicture(url)
                  trackUserInteraction('profile_picture_upload', 'Signup Form')
                }}
                size="xl"
                editable={true}
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                {t('auth.fullName')}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('auth.fullName')}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.role}
                onChange={(e) => {
                  handleChange(e)
                  trackUserInteraction(`role_selection_${e.target.value}`, 'Signup Form')
                }}
              >
                <option value="parent">Parent</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

                      {/* No student-specific fields needed - students are added by parents */}

            {formData.role === 'tutor' && (
              <>
                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                    Highest Qualification
                  </label>
                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Bachelor's Degree in Education"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="3"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate (RM)
                  </label>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="50.00"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {formData.role === 'parent' && (
              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                  Relationship to Student
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.relationship}
                  onChange={handleChange}
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}