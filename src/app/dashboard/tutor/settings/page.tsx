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
  Bell,
  Shield,
  Globe,
  HelpCircle,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Lock,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Key,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Award,
  BookOpen,
  FileText,
  Users,
  BarChart
} from 'lucide-react'

interface TutorSettings {
  // Profile Settings
  full_name: string
  email: string
  phone: string
  location: string
  bio: string
  timezone: string
  language: string
  subjects: string[]
  languages: string[]
  qualifications: string
  experience: string
  hourly_rate: string
  teaching_levels: string[]

  // Availability Settings
  availability: {
    [key: string]: {
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }

  // Notification Settings
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  lesson_reminders: boolean
  payment_alerts: boolean
  message_notifications: boolean
  student_requests: boolean
  marketing_emails: boolean

  // Privacy Settings
  profile_visibility: 'public' | 'private'
  show_contact_info: boolean
  data_sharing: boolean
  two_factor_auth: boolean

  // Appearance Settings
  theme: 'light' | 'dark' | 'system'
  compact_mode: boolean

  // Account Settings
  account_status: string
  member_since: string
  verification_status: string
  average_rating: number
  total_students: number
  total_earnings: number
}

export default function TutorSettingsPage() {
  const { user } = useSupabase()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [settings, setSettings] = useState<TutorSettings>({
    // Profile Settings
    full_name: user?.user_metadata?.full_name || 'Tutor Name',
    email: user?.email || '',
    phone: '+60 12-345 6789',
    location: 'Kuala Lumpur, Malaysia',
    bio: 'Experienced educator dedicated to helping students achieve their academic goals through personalized learning approaches.',
    timezone: 'Asia/Kuala_Lumpur',
    language: 'English',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    languages: ['English', 'Mandarin', 'Malay'],
    qualifications: 'M.Sc. in Physics, University of Malaya',
    experience: '5 years of tutoring experience',
    hourly_rate: '80',
    teaching_levels: ['SPM', 'IGCSE', 'A-Levels'],

    // Availability Settings
    availability: {
      monday: { morning: true, afternoon: true, evening: false },
      tuesday: { morning: false, afternoon: true, evening: true },
      wednesday: { morning: true, afternoon: true, evening: false },
      thursday: { morning: false, afternoon: true, evening: true },
      friday: { morning: true, afternoon: false, evening: false },
      saturday: { morning: true, afternoon: true, evening: true },
      sunday: { morning: false, afternoon: true, evening: false },
    },

    // Notification Settings
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    lesson_reminders: true,
    payment_alerts: true,
    message_notifications: true,
    student_requests: true,
    marketing_emails: false,

    // Privacy Settings
    profile_visibility: 'public',
    show_contact_info: true,
    data_sharing: false,
    two_factor_auth: false,

    // Appearance Settings
    theme: 'light',
    compact_mode: false,

    // Account Settings
    account_status: 'Active',
    member_since: 'January 2024',
    verification_status: 'Verified',
    average_rating: 4.8,
    total_students: 45,
    total_earnings: 12800
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'availability', name: 'Availability', icon: Calendar },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Monitor },
    { id: 'earnings', name: 'Earnings', icon: DollarSign },
    { id: 'account', name: 'Account', icon: Key },
    { id: 'help', name: 'Help', icon: HelpCircle }
  ]

  useEffect(() => {
    // Load avatar URL from user metadata
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url)
    }
  }, [user])

  const handleAvatarChange = async (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl)
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

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // TODO: Save settings to database
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
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

  const handleInputChange = (field: keyof TutorSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <ProfilePictureUpload
                currentAvatarUrl={avatarUrl}
                onAvatarChange={handleAvatarChange}
                userType="tutor"
                userId={user?.id || ''}
                size="large"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Profile Picture</h3>
              <p className="text-sm text-gray-600">
                Upload a professional photo to build trust with parents and students.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={settings.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Contact support to change email</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell parents about your teaching philosophy, experience, and approach..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Teaching Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
              <input
                type="text"
                value={settings.subjects.join(', ')}
                onChange={(e) => handleInputChange('subjects', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mathematics, Physics, Chemistry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
              <input
                type="text"
                value={settings.languages.join(', ')}
                onChange={(e) => handleInputChange('languages', e.target.value.split(',').map(s => s.trim()))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., English, Mandarin, Malay"
              />
              <p className="text-xs text-gray-500 mt-1">Languages you're fluent in for teaching</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (RM)</label>
              <input
                type="number"
                value={settings.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
              <textarea
                value={settings.qualifications}
                onChange={(e) => handleInputChange('qualifications', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your educational background and certifications"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <textarea
                value={settings.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your teaching experience and specialties"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Levels</label>
            <input
              type="text"
              value={settings.teaching_levels.join(', ')}
              onChange={(e) => handleInputChange('teaching_levels', e.target.value.split(',').map(s => s.trim()))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., SPM, IGCSE, A-Levels, Primary"
            />
          </div>
        </CardContent>
      </Card>

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
              onClick={() => handleInputChange('two_factor_auth', !settings.two_factor_auth)}
              variant={settings.two_factor_auth ? "default" : "outline"}
              className={settings.two_factor_auth ? "bg-green-600 hover:bg-green-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}
            >
              {settings.two_factor_auth ? 'Enabled' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAvailabilitySettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Availability Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-6">
          Set your weekly availability to help parents know when you're available for lessons.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(settings.availability).map(([day, times]) => (
            <div key={day} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 capitalize mb-3">{day}</h4>
              <div className="space-y-2">
                {Object.entries(times).map(([timeSlot, available]) => (
                  <label key={timeSlot} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={available}
                      onChange={(e) => {
                        const newAvailability = { ...settings.availability }
                        newAvailability[day] = {
                          ...newAvailability[day],
                          [timeSlot]: e.target.checked
                        }
                        handleInputChange('availability', newAvailability)
                      }}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {timeSlot}
                    </span>
                    {available && (
                      <Check className="h-3 w-3 ml-1 text-green-500" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Time Zone</h4>
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Asia/Kuala_Lumpur">Malaysia Time (MYT)</option>
            <option value="Asia/Singapore">Singapore Time (SGT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Notification Channels</h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleInputChange('email_notifications', !settings.email_notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Browser and mobile app notifications</p>
              </div>
              <button
                onClick={() => handleInputChange('push_notifications', !settings.push_notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.push_notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.push_notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Important updates via text message</p>
              </div>
              <button
                onClick={() => handleInputChange('sms_notifications', !settings.sms_notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.sms_notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Lesson Reminders</p>
                <p className="text-sm text-gray-600">Upcoming lesson notifications</p>
              </div>
              <button
                onClick={() => handleInputChange('lesson_reminders', !settings.lesson_reminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.lesson_reminders ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.lesson_reminders ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Payment Alerts</p>
                <p className="text-sm text-gray-600">Payment confirmations and payouts</p>
              </div>
              <button
                onClick={() => handleInputChange('payment_alerts', !settings.payment_alerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.payment_alerts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.payment_alerts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Message Notifications</p>
                <p className="text-sm text-gray-600">New messages from parents</p>
              </div>
              <button
                onClick={() => handleInputChange('message_notifications', !settings.message_notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.message_notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.message_notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Student Requests</p>
                <p className="text-sm text-gray-600">New lesson booking requests</p>
              </div>
              <button
                onClick={() => handleInputChange('student_requests', !settings.student_requests)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.student_requests ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.student_requests ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Marketing Emails</p>
                <p className="text-sm text-gray-600">Promotional content and updates</p>
              </div>
              <button
                onClick={() => handleInputChange('marketing_emails', !settings.marketing_emails)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.marketing_emails ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.marketing_emails ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPrivacySettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Privacy & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Profile Privacy</h4>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Control who can see your profile</p>
            </div>
            <select
              value={settings.profile_visibility}
              onChange={(e) => handleInputChange('profile_visibility', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Contact Information</p>
              <p className="text-sm text-gray-600">Display phone and email to parents</p>
            </div>
            <button
              onClick={() => handleInputChange('show_contact_info', !settings.show_contact_info)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.show_contact_info ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.show_contact_info ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-600">Share anonymous data for platform improvement</p>
            </div>
            <button
              onClick={() => handleInputChange('data_sharing', !settings.data_sharing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.data_sharing ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.data_sharing ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderAppearanceSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="h-5 w-5 mr-2" />
          Appearance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Theme</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleInputChange('theme', 'light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.theme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium">Light</p>
              <p className="text-sm text-gray-600">Clean and bright</p>
            </button>

            <button
              onClick={() => handleInputChange('theme', 'dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Dark</p>
              <p className="text-sm text-gray-600">Easy on the eyes</p>
            </button>

            <button
              onClick={() => handleInputChange('theme', 'system')}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.theme === 'system'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-500" />
              <p className="font-medium">System</p>
              <p className="text-sm text-gray-600">Follow your device</p>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Display Options</h4>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Compact Mode</p>
              <p className="text-sm text-gray-600">Show more content with less spacing</p>
            </div>
            <button
              onClick={() => handleInputChange('compact_mode', !settings.compact_mode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.compact_mode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.compact_mode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderEarningsSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Earnings & Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-green-900">Total Earnings</h4>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900">RM{settings.total_earnings.toLocaleString()}</p>
            <p className="text-sm text-green-700 mt-1">All time earnings</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-900">Total Students</h4>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{settings.total_students}</p>
            <p className="text-sm text-blue-700 mt-1">Students taught</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-yellow-900">Average Rating</h4>
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-900">{settings.average_rating}</p>
            <p className="text-sm text-yellow-700 mt-1">Student satisfaction</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Payment Methods</h4>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-green-400 rounded flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Bank Account ****1234</p>
                  <p className="text-sm text-gray-600">Primary payout method</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700">
            + Add Payment Method
          </Button>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Payout History</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Payout - January 2024</p>
                <p className="text-sm text-gray-600">Processed on Jan 31, 2024</p>
              </div>
              <p className="font-semibold text-green-600">RM2,400.00</p>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Payout - December 2023</p>
                <p className="text-sm text-gray-600">Processed on Dec 31, 2023</p>
              </div>
              <p className="font-semibold text-green-600">RM2,150.00</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View Full History
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderAccountSettings = () => (
    <div className="space-y-6">
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
                {settings.account_status}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold text-gray-900 mt-1">{settings.member_since}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Verification Status</p>
              <p className="font-semibold text-green-600 flex items-center mt-1">
                <Award className="h-4 w-4 mr-1" />
                {settings.verification_status}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Profile Completion</p>
              <p className="font-semibold text-blue-600 mt-1">90% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHelpSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          Help & Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Tutor Guidelines</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Best practices and platform rules</p>
          </button>

          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Contact Support</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Get help from our team</p>
          </button>

          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Teaching Resources</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Teaching materials and tools</p>
          </button>

          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Community Forum</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Connect with other tutors</p>
          </button>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Quick Links</h4>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Terms of Service</a>
            <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Privacy Policy</a>
            <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Cookie Policy</a>
            <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">GDPR Compliance</a>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tutor Support</h4>
          <p className="text-sm text-blue-700 mb-3">
            Our tutor support team is available Monday-Friday, 9 AM - 6 PM MYT
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'availability':
        return renderAvailabilitySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'privacy':
        return renderPrivacySettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'earnings':
        return renderEarningsSettings()
      case 'account':
        return renderAccountSettings()
      case 'help':
        return renderHelpSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold">Tutor Settings</h1>
                  <p className="text-xs md:text-sm text-white opacity-90 hidden md:block">
                    Manage your profile, availability, and account preferences
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg md:text-2xl font-bold">RM{settings.hourly_rate}/hr</div>
                <div className="text-xs md:text-sm text-white opacity-90">Current Rate</div>
              </div>
            </div>
          </div>

          {/* Settings Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.name}
                      </button>
                    )
                  })}
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg">
                {renderTabContent()}

                {/* Save Button */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      {saving ? (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}