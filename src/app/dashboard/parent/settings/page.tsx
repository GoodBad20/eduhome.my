'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { settingsService, UserSettings } from '@/lib/services/settingsService'
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
  Key
} from 'lucide-react'

interface AccountInfo {
  account_status: string
  member_since: string
  subscription_plan: string
  children_count: number
}

export default function ParentSettingsPage() {
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

  const [settings, setSettings] = useState<UserSettings>({
    // Profile Settings
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    timezone: 'Asia/Kuala_Lumpur',
    language: 'English',

    // Notification Settings
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    lesson_reminders: true,
    payment_alerts: true,
    message_notifications: true,
    progress_reports: true,
    marketing_emails: false,

    // Privacy Settings
    profile_visibility: 'private',
    show_contact_info: false,
    data_sharing: false,
    two_factor_auth: false,

    // Appearance Settings
    theme: 'light',
    compact_mode: false
  })

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    account_status: 'Active',
    member_since: '',
    subscription_plan: 'Premium',
    children_count: 0
  })

  const [initialSettings, setInitialSettings] = useState<UserSettings | null>(null)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Monitor },
    { id: 'account', name: 'Account', icon: Key },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'help', name: 'Help', icon: HelpCircle }
  ]

  useEffect(() => {
    if (user?.id) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      // Load user settings and account info in parallel
      const [userSettings, accountData] = await Promise.all([
        settingsService.getUserSettings(user.id),
        settingsService.getUserAccountInfo(user.id)
      ])

      setSettings(userSettings)
      setInitialSettings(userSettings)
      setAccountInfo(accountData)

      // Load avatar URL from user metadata
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl)
    try {
      if (user) {
        const { error } = await supabase.auth.updateUser({
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
    if (!user?.id) return

    setSaving(true)
    try {
      const success = await settingsService.updateUserSettings(user.id, settings)
      if (success) {
        setInitialSettings({ ...settings })
        // Show success message
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings. Please try again.')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('An error occurred while saving settings')
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

    if (!user?.id) return

    setLoading(true)
    try {
      const result = await settingsService.changePassword(user.id, currentPassword, newPassword)
      if (result.success) {
        setShowPasswordForm(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        alert('Password changed successfully')
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('An error occurred while changing password')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UserSettings, value: any) => {
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
                currentAvatar={avatarUrl || undefined}
                onAvatarChange={handleAvatarChange}
                name={user?.user_metadata?.full_name || 'User'}
                userId={user?.id || ''}
                size="lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h3>
              <p className="text-sm text-gray-600">
                Upload a profile picture to help tutors recognize you. Recommended size is at least 200x200px.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell tutors about yourself and your educational goals for your children..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Malay">Bahasa Melayu</option>
                <option value="Chinese">中文</option>
                <option value="Tamil">தமிழ்</option>
              </select>
            </div>
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
                <p className="text-sm text-gray-600">Billing and payment notifications</p>
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
                <p className="text-sm text-gray-600">New messages from tutors</p>
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
                <p className="font-medium text-gray-900">Progress Reports</p>
                <p className="text-sm text-gray-600">Weekly progress updates</p>
              </div>
              <button
                onClick={() => handleInputChange('progress_reports', !settings.progress_reports)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.progress_reports ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.progress_reports ? 'translate-x-6' : 'translate-x-1'
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
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Show Contact Information</p>
              <p className="text-sm text-gray-600">Display phone and email to tutors</p>
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
                {accountInfo.account_status}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold text-gray-900 mt-1">{accountInfo.member_since}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Subscription Plan</p>
              <p className="font-semibold text-blue-600 mt-1">{accountInfo.subscription_plan}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Children</p>
              <p className="font-semibold text-gray-900 mt-1">{accountInfo.children_count} registered</p>
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

  const renderBillingSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Billing & Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">{accountInfo.subscription_plan} Plan</h4>
              <p className="text-sm text-blue-700">RM99/month • Renews monthly</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
              Active
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Payment Methods</h4>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">•••• 4242</p>
                  <p className="text-sm text-gray-600">Expires 12/25</p>
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
          <h4 className="font-medium text-gray-900">Billing History</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Premium Plan - Jan 2024</p>
                <p className="text-sm text-gray-600">Jan 15, 2024</p>
              </div>
              <p className="font-semibold">RM99.00</p>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Premium Plan - Dec 2023</p>
                <p className="text-sm text-gray-600">Dec 15, 2023</p>
              </div>
              <p className="font-semibold">RM99.00</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View Full History
          </Button>
        </div>
      </CardContent>
    </Card>
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
              <h4 className="font-medium text-gray-900">Help Center</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Browse FAQs and guides</p>
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
              <h4 className="font-medium text-gray-900">Video Tutorials</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Learn how to use the platform</p>
          </button>

          <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Community Forum</h4>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Connect with other parents</p>
          </button>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Quick Links</h4>
          <div className="space-y-2">
            <a href="/terms" className="block text-sm text-blue-600 hover:text-blue-800">Terms of Service</a>
            <a href="/privacy" className="block text-sm text-blue-600 hover:text-blue-800">Privacy Policy</a>
            <a href="/cookie-policy" className="block text-sm text-blue-600 hover:text-blue-800">Cookie Policy</a>
            <a href="/cookie-policy" className="block text-sm text-blue-600 hover:text-blue-800">GDPR Compliance</a>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
          <p className="text-sm text-blue-700 mb-3">
            Our support team is available Monday-Friday, 9 AM - 6 PM MYT
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
      case 'notifications':
        return renderNotificationSettings()
      case 'privacy':
        return renderPrivacySettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'account':
        return renderAccountSettings()
      case 'billing':
        return renderBillingSettings()
      case 'help':
        return renderHelpSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <DashboardLayout userRole="parent">
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
                  <h1 className="text-xl md:text-3xl font-bold">Settings</h1>
                  <p className="text-xs md:text-sm text-white opacity-90 hidden md:block">
                    Manage your account preferences and privacy settings
                  </p>
                </div>
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