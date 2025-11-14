'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Upload, X } from 'lucide-react'

interface ProfilePictureUploadProps {
  currentAvatar?: string
  userId?: string
  name: string
  onAvatarChange: (avatarUrl: string | null) => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showUploadButton?: boolean
  editable?: boolean
}

export default function ProfilePictureUpload({
  currentAvatar,
  userId,
  name,
  onAvatarChange,
  size = 'md',
  className = '',
  showUploadButton = true,
  editable = true
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8'
      case 'md':
        return 'h-12 w-12'
      case 'lg':
        return 'h-16 w-16'
      case 'xl':
        return 'h-24 w-24'
      default:
        return 'h-12 w-12'
    }
  }

  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return 'U'
    }
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return

    const file = event.target.files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    try {
      setUploading(true)

      // Create a preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewDataUrl = e.target?.result as string
        setPreviewUrl(previewDataUrl)

        // If no userId is available yet (during signup), just return the preview
        if (!userId || userId === 'temp' || userId.startsWith('temp-')) {
          onAvatarChange(previewDataUrl)
          setUploading(false)
          return
        }

        // Otherwise, upload to Supabase Storage
        uploadToSupabase(file, previewDataUrl)
      }
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('Error processing avatar:', error)
      alert('Failed to process image. Please try again.')
      setPreviewUrl(currentAvatar || null)
    } finally {
      setUploading(false)
    }
  }

  const uploadToSupabase = async (file: File, fallbackDataUrl?: string) => {
    if (!userId || userId === 'temp' || userId.startsWith('temp-')) {
      // If still no real userId, use the fallback
      if (fallbackDataUrl) {
        onAvatarChange(fallbackDataUrl)
      }
      return
    }

    try {
      // First check if the bucket exists
      const { data: buckets, error: bucketError } = await supabase.storage
        .getBucket('avatars')

      if (bucketError || !buckets) {
        console.log('Avatars bucket does not exist, using fallback')
        if (fallbackDataUrl) {
          onAvatarChange(fallbackDataUrl)
        }
        return
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      console.log('Uploading file:', fileName, 'for user:', userId)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        console.log('Falling back to data URL due to upload error:', uploadError.message)
        // If upload fails, fall back to data URL
        if (fallbackDataUrl) {
          onAvatarChange(fallbackDataUrl)
        } else {
          alert(`Failed to upload image: ${uploadError.message}`)
          setPreviewUrl(currentAvatar || null)
        }
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      console.log('Upload successful, public URL:', publicUrl)
      onAvatarChange(publicUrl)

    } catch (error) {
      console.error('Error uploading avatar:', error)
      console.log('Falling back to data URL due to general error:', error.message)
      if (fallbackDataUrl) {
        onAvatarChange(fallbackDataUrl)
      } else {
        alert('Failed to upload image. Using local preview instead.')
        setPreviewUrl(currentAvatar || null)
      }
    }
  }

  const handleRemoveAvatar = () => {
    setPreviewUrl(null)
    onAvatarChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFallbackGradient = () => {
    const colors = [
      'from-blue-400 to-purple-600',
      'from-green-400 to-emerald-600',
      'from-purple-400 to-pink-600',
      'from-orange-400 to-red-600',
      'from-teal-400 to-cyan-600'
    ]

    const nameToUse = (name && typeof name === 'string') ? name : 'User'
    const colorIndex = nameToUse.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[colorIndex]
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative group">
        <Avatar className={`${getSizeClasses()} border-4 border-white shadow-lg transition-all duration-300 group-hover:shadow-xl`}>
          <AvatarImage
            src={previewUrl || undefined}
            alt={`${name || 'User'}'s profile`}
            className="object-cover"
          />
          <AvatarFallback className={`bg-gradient-to-br ${getFallbackGradient()} text-white font-semibold`}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {editable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
               onClick={() => fileInputRef.current?.click()}>
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={!editable || uploading}
      />

      {showUploadButton && editable && (
        <div className="mt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs"
          >
            <Upload className="h-3 w-3 mr-1" />
            {previewUrl ? 'Change' : 'Upload'}
          </Button>

          {previewUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={uploading}
              className="text-xs text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3 mr-1" />
              Remove
            </Button>
          )}
        </div>
      )}

      {uploading && (
        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
      )}
    </div>
  )
}