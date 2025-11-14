'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  Award,
  DollarSign,
  Check,
  X,
  Star,
  Briefcase,
  Bell,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Download
} from 'lucide-react'

export default function TutorProfilePage() {
  const { user } = useSupabase()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const tutorProfile = {
    full_name: user?.user_metadata?.full_name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+60 12-345 6789',
    location: 'Kuala Lumpur, Malaysia',
    bio: 'Passionate educator dedicated to helping students achieve their academic goals through personalized learning approaches.',
    timezone: 'Asia/Kuala_Lumpur',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    languages: ['English', 'Mandarin', 'Malay'],
    qualifications: 'B.Sc. in Mathematics, University of Malaya',
    experience: '5 years of tutoring experience',
    hourly_rate: '80',
    teaching_levels: ['SPM', 'IGCSE', 'A-Levels'],
    teaching_modes: ['online', 'in_person'],
    online_meeting_link: 'https://meet.google.com/xyz-abc-123',
    physical_address: '123 Education Street, Kuala Lumpur, 50200',
    google_maps_link: 'https://maps.google.com/?q=123+Education+Street+Kuala+Lumpur',
    waze_link: 'https://waze.com/ul?ll=3.1390,101.6869&navigate=yes',
    additional_notes: 'Free parking available. Please arrive 10 minutes early.',
    availability: {
      monday: { morning: true, afternoon: true, evening: false },
      tuesday: { morning: false, afternoon: true, evening: true },
      wednesday: { morning: true, afternoon: true, evening: false },
      thursday: { morning: false, afternoon: true, evening: true },
      friday: { morning: true, afternoon: false, evening: false },
      saturday: { morning: true, afternoon: true, evening: true },
      sunday: { morning: false, afternoon: true, evening: false },
    },
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    lesson_reminders: true,
    payment_alerts: true,
    message_notifications: true,
    student_requests: true,
    marketing_emails: false,
    profile_visibility: 'public',
    show_contact_info: true,
    data_sharing: false,
    two_factor_auth: false,
    account_status: 'Active',
    member_since: 'January 2024',
    verification_status: 'Verified',
    average_rating: 4.8,
    total_students: 45,
    total_earnings: 12800
  }

  const [formData, setFormData] = useState(tutorProfile)

  useEffect(() => {
    // Load avatar URL from user metadata
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url)
    }
  }, [user])

  const handleAvatarChange = async (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl)
    // TODO: Update user metadata in database
    try {
      if (user) {
        const { error } = await user.update({
          data: { avatar_url: newAvatarUrl }
        })
        if (error) {
          console.error('Error updating avatar:', error)
        }
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Update tutor profile in database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement password change logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Password changed successfully')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error changing password')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <User className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold">Tutor Profile</h1>
                  <p className="text-xs md:text-sm text-white opacity-90 hidden md:block">
                    Manage your professional profile and account settings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg md:text-2xl font-bold">RM{formData.hourly_rate}</div>
                <div className="text-xs md:text-sm text-white opacity-90">per hour</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </div>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    className={isEditing ? "border-gray-300" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <ProfilePictureUpload
                      currentAvatarUrl={avatarUrl}
                      onAvatarChange={handleAvatarChange}
                      userType="tutor"
                      userId={user?.id || ''}
                      size="large"
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.full_name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {formData.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {formData.phone}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {formData.location}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-blue-50 px-3 py-2 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">RM{formData.hourly_rate}</div>
                        <div className="text-xs text-gray-600">per hour</div>
                      </div>
                      <div className="bg-green-50 px-3 py-2 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{Array.isArray(formData.subjects) ? formData.subjects.length : formData.subjects.split(',').length}</div>
                        <div className="text-xs text-gray-600">subjects</div>
                      </div>
                      <div className="bg-purple-50 px-3 py-2 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">4.8★</div>
                        <div className="text-xs text-gray-600">rating</div>
                      </div>
                      <div className="bg-yellow-50 px-3 py-2 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">{formData.total_students}</div>
                        <div className="text-xs text-gray-600">students</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact support to change email</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Teaching Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Teaching Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                    <input
                      type="text"
                      name="subjects"
                      value={Array.isArray(formData.subjects) ? formData.subjects.join(', ') : formData.subjects}
                      onChange={(e) => handleFieldChange('subjects', e.target.value.split(',').map(s => s.trim()))}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                    <input
                      type="text"
                      name="languages"
                      value={Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages}
                      onChange={(e) => handleFieldChange('languages', e.target.value.split(',').map(s => s.trim()))}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (RM)</label>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Teaching Modes & Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Teaching Modes & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Modes</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.teaching_modes?.includes('online') || false}
                        onChange={(e) => {
                          const modes = formData.teaching_modes || []
                          if (e.target.checked) {
                            handleFieldChange('teaching_modes', [...modes, 'online'])
                          } else {
                            handleFieldChange('teaching_modes', modes.filter(m => m !== 'online'))
                          }
                        }}
                        disabled={!isEditing}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">Online Classes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.teaching_modes?.includes('in_person') || false}
                        onChange={(e) => {
                          const modes = formData.teaching_modes || []
                          if (e.target.checked) {
                            handleFieldChange('teaching_modes', [...modes, 'in_person'])
                          } else {
                            handleFieldChange('teaching_modes', modes.filter(m => m !== 'in_person'))
                          }
                        }}
                        disabled={!isEditing}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-700">In-Person Classes</span>
                    </label>
                  </div>
                </div>

                {(formData.teaching_modes?.includes('online')) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Meet Link
                    </label>
                    <input
                      type="url"
                      name="online_meeting_link"
                      value={formData.online_meeting_link || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="https://meet.google.com/xyz-abc-123"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This link will be used for all online classes. You can generate a permanent meeting link in Google Meet.
                    </p>
                  </div>
                )}

                {(formData.teaching_modes?.includes('in_person')) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Physical Address
                      </label>
                      <textarea
                        name="physical_address"
                        value={formData.physical_address || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={2}
                        placeholder="123 Education Street, Kuala Lumpur 50200"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Maps Link
                        </label>
                        <input
                          type="url"
                          name="google_maps_link"
                          value={formData.google_maps_link || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="https://maps.google.com/?q=your+address"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Waze Link
                        </label>
                        <input
                          type="url"
                          name="waze_link"
                          value={formData.waze_link || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="https://waze.com/ul?navigate=yes"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Class Information
                  </label>
                  <textarea
                    name="additional_notes"
                    value={formData.additional_notes || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Parking instructions, what to bring, arrival time, etc."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="about"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Change Password
                  </Button>
                </div>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleFieldChange('two_factor_auth', !formData.two_factor_auth)}
                    variant={formData.two_factor_auth ? "default" : "outline"}
                    className={formData.two_factor_auth ? "bg-green-600 hover:bg-green-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
                  >
                    {formData.two_factor_auth ? 'Enabled' : 'Enable'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-semibold text-green-600 flex items-center mt-1">
                      <Check className="h-4 w-4 mr-1" />
                      {formData.account_status}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold text-gray-900 mt-1">{formData.member_since}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Verification Status</p>
                    <p className="font-semibold text-green-600 flex items-center mt-1">
                      <Award className="h-4 w-4 mr-1" />
                      {formData.verification_status}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="font-semibold text-blue-900 mt-1">RM{formData.total_earnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}