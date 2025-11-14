'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit2, User, Mail, Calendar, Shield } from 'lucide-react'
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload'
import { useSupabase } from '@/components/providers/SupabaseProvider'

interface ProfileSectionProps {
  userRole: 'parent' | 'tutor'
  className?: string
}

export default function ProfileSection({ userRole, className = '' }: ProfileSectionProps) {
  const { user } = useSupabase()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null)

  const handleAvatarChange = async (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl)

    // Update user metadata
    if (user) {
      const { supabase } = await import('@/lib/supabase')

      // Update auth metadata
      await supabase.auth.updateUser({
        data: {
          avatar_url: newAvatarUrl
        }
      })

      // Update users table
      await supabase
        .from('users')
        .update({
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      // Update tutor profile if applicable
      if (userRole === 'tutor') {
        await supabase
          .from('tutor_profiles')
          .update({
            avatar_url: newAvatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
      }
    }
  }

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'parent':
        return 'bg-blue-100 text-blue-800'
      case 'tutor':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = () => {
    switch (userRole) {
      case 'parent':
        return 'Parent'
      case 'tutor':
        return 'Tutor'
      default:
        return 'User'
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  const getFallbackGradient = () => {
    const colors = [
      'from-blue-400 to-purple-600',
      'from-green-400 to-emerald-600',
      'from-purple-400 to-pink-600',
      'from-orange-400 to-red-600',
      'from-teal-400 to-cyan-600'
    ]

    const name = user?.user_metadata?.full_name || user?.email || 'User'
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[colorIndex]
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2" />
            My Profile
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            {isEditing ? 'Done' : 'Edit'}
          </Button>
        </div>

        {/* Profile Picture and Basic Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <ProfilePictureUpload
              currentAvatar={avatarUrl}
              userId={user?.id || ''}
              name={user?.user_metadata?.full_name || 'User'}
              onAvatarChange={handleAvatarChange}
              size="xl"
              editable={isEditing}
              showUploadButton={isEditing}
            />
            <Badge className={`mt-3 ${getRoleBadgeColor()}`}>
              {getRoleText()}
            </Badge>
          </div>

          {/* User Information */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900 font-medium">
                    {user?.user_metadata?.full_name || 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Account Type</label>
                <div className="flex items-center mt-1">
                  <Shield className="h-4 w-4 mr-2 text-gray-400" />
                  <Badge className={getRoleBadgeColor()}>
                    {getRoleText()}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900 font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Profile Information */}
      {userRole === 'tutor' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Qualification</label>
              <p className="text-gray-900 mt-1">
                {user?.user_metadata?.qualification || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Experience</label>
              <p className="text-gray-900 mt-1">
                {user?.user_metadata?.experience_years ? `${user.user_metadata.experience_years} years` : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
              <p className="text-gray-900 mt-1">
                {user?.user_metadata?.hourly_rate ? `RM ${user.user_metadata.hourly_rate}` : 'Not specified'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}