# Avatar Implementation Guide

This guide provides comprehensive instructions for implementing avatar upload functionality in your Eduhome.my educational platform.

## Overview

The avatar system has been set up with the following components:

1. **Storage Bucket**: `avatars` bucket for storing profile images
2. **Database Columns**: `avatar_url` columns in `users`, `students`, and `tutors`/`tutor_profiles` tables
3. **RLS Policies**: Secure access controls for avatar storage
4. **TypeScript Types**: Updated type definitions
5. **Service Class**: `AvatarService` for easy avatar management
6. **Verification Scripts**: Tools to test the setup

## Database Setup

### Migration Files

- `supabase/migrations/20250113_add_avatar_support.sql`: Main avatar support migration
- `supabase/migrations/20241112_create_core_tables.sql`: Core table definitions (users table already has avatar_url)

### Database Schema

```sql
-- Users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('parent', 'tutor', 'student')),
    avatar_url TEXT, -- Already exists
    -- ... other columns
);

-- Students table (avatar_url added via migration)
ALTER TABLE public.students ADD COLUMN avatar_url TEXT;

-- Tutors table (avatar_url added via migration)
ALTER TABLE public.tutors ADD COLUMN avatar_url TEXT;

-- Tutor_profiles table (avatar_url added via migration, if exists)
ALTER TABLE public.tutor_profiles ADD COLUMN avatar_url TEXT;
```

## Storage Configuration

### Bucket Setup

- **Bucket Name**: `avatars`
- **Access**: Private (controlled by RLS policies)
- **File Structure**: `{userId}/avatar.{ext}`

### RLS Policies

1. **Users can upload their own avatar**: Authenticated users can upload files to their own folder
2. **Users can view their own avatar**: Users can access their own uploaded avatars
3. **Public can view avatars**: Anyone can view avatar files (for profile display)
4. **Users can update their own avatar**: Users can replace their avatar

## Frontend Implementation

### 1. Avatar Upload Component

```typescript
import { AvatarService } from '@/lib/services/avatar.service';

const AvatarUpload = ({ userId, currentAvatar, userName, onAvatarChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const avatarUrl = await AvatarService.uploadAvatar(userId, file);
      onAvatarChange(avatarUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <img
        src={currentAvatar || AvatarService.getDefaultAvatar(userName)}
        alt={`${userName}'s avatar`}
        className="w-24 h-24 rounded-full object-cover"
      />
      <label className="upload-button">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        {uploading ? 'Uploading...' : 'Change Avatar'}
      </label>
    </div>
  );
};
```

### 2. Display Avatar with Fallback

```typescript
import { AvatarService } from '@/lib/services/avatar.service';

const UserAvatar = ({ userId, userName, className = "" }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const url = await AvatarService.getAvatarOrDefault(userId, userName);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Failed to load avatar:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAvatar();
  }, [userId, userName]);

  if (loading) {
    return <div className={`avatar-placeholder ${className}`} />;
  }

  return (
    <img
      src={avatarUrl}
      alt={`${userName}'s avatar`}
      className={`rounded-full object-cover ${className}`}
    />
  );
};
```

### 3. Profile Page Integration

```typescript
// Example for parent profile page
const ParentProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>Parent Profile</h1>

      <div className="profile-header">
        <AvatarUpload
          userId={user.id}
          currentAvatar={profile?.avatar_url}
          userName={profile?.full_name}
          onAvatarChange={handleAvatarChange}
        />

        <div className="profile-info">
          <h2>{profile?.full_name}</h2>
          <p>{profile?.email}</p>
        </div>
      </div>

      {/* Rest of profile form */}
    </div>
  );
};
```

## File Upload Specifications

### Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### File Size Limit

- Maximum: 5MB per file

### Recommended Dimensions

- Square aspect ratio (1:1)
- Minimum: 128x128 pixels
- Recommended: 512x512 pixels

## Error Handling

### Common Errors and Solutions

1. **"Invalid file type"**
   - Ensure file is one of the supported formats
   - Check file extension matches the actual file type

2. **"File size too large"**
   - Compress the image before uploading
   - Use image optimization tools

3. **"Permission denied"**
   - Ensure user is authenticated
   - Check RLS policies are properly configured

4. **"Upload failed"**
   - Check network connection
   - Verify storage bucket exists
   - Check Supabase credentials

## Testing the Setup

### 1. Run Verification Script

```sql
-- Execute the verification script
\i verify_avatar_setup.sql
```

### 2. Test Upload via Supabase Dashboard

1. Go to Supabase Dashboard
2. Navigate to Storage > avatars
3. Try uploading a test file
4. Verify the public URL works

### 3. Test via Application

1. Log in as a test user
2. Navigate to profile page
3. Try uploading an avatar
4. Verify it appears correctly

### 4. Check Database

```sql
-- Verify avatar_url was updated
SELECT id, full_name, avatar_url
FROM users
WHERE id = 'YOUR_TEST_USER_ID';
```

## Maintenance

### Cleanup Old Files

```sql
-- Find orphaned files (files without corresponding users)
WITH user_folders AS (
  SELECT id::text as folder_name FROM auth.users
)
SELECT * FROM storage.objects
WHERE bucket_id = 'avatars'
AND storage.foldername(name)[1] NOT IN (SELECT folder_name FROM user_folders);
```

### Monitor Storage Usage

```sql
-- Check storage usage by user
SELECT
  storage.foldername(name)[1] as user_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_size_bytes
FROM storage.objects
WHERE bucket_id = 'avatars'
GROUP BY storage.foldername(name)[1]
ORDER BY total_size_bytes DESC;
```

## Security Considerations

1. **File Type Validation**: Server-side validation is enforced
2. **File Size Limits**: 5MB maximum file size
3. **Access Control**: RLS policies ensure users can only access their own files
4. **Public Access**: Files are publicly viewable but uploads are controlled
5. **Automatic Updates**: Database triggers keep avatar_url fields in sync

## Troubleshooting

### Common Issues

1. **Avatar not displaying**
   - Check if file exists in storage
   - Verify public URL is correct
   - Check CORS settings if loading from different domains

2. **Upload failing**
   - Verify user authentication
   - Check storage bucket permissions
   - Review browser console for errors

3. **Database not updating**
   - Check if triggers are active
   - Verify RLS policies aren't blocking updates
   - Check storage logs for errors

For additional support, check the Supabase documentation or consult the error logs in your Supabase dashboard.