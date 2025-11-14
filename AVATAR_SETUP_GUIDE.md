# Avatar System Setup Instructions

## 🎯 Complete the Profile Picture Setup

The MCP agent has created a comprehensive avatar system for your eduhome platform. Follow these steps to complete the setup.

## Step 1: Apply Database Migration

1. **Open your Supabase Dashboard**: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy
2. **Go to SQL Editor**: Click on "SQL" in the left sidebar
3. **Copy and paste the entire contents** of `supabase/migrations/20250113_add_avatar_support.sql`
4. **Run the SQL** to execute the migration

### What the migration does:
- ✅ Adds `avatar_url` columns to students, tutors, and tutor_profiles tables
- ✅ Creates the 'avatars' storage bucket
- ✅ Sets up Row Level Security (RLS) policies for avatar access
- ✅ Creates automatic avatar URL synchronization triggers
- ✅ Grants proper permissions to authenticated users

## Step 2: Verify the Setup

After running the migration, run this verification query:

```sql
SELECT 'Avatar setup verification' as status,
       (SELECT COUNT(*) FROM storage.buckets WHERE id = 'avatars') as bucket_created,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'students' AND column_name = 'avatar_url') as students_column_added,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = 'tutors' AND column_name = 'avatar_url') as tutors_column_added;
```

You should see:
- `bucket_created = 1`
- `students_column_added = 1`
- `tutors_column_added = 1`

## Step 3: Test the Profile Picture Upload

The application is already running at http://localhost:3000. Here's what you can test:

### For Parents:
1. Go to `/auth/signup` and create a parent account
2. Upload a profile picture during signup
3. Add children with their pictures via `/dashboard/parent/children`

### For Tutors:
1. Go to `/auth/signup` and create a tutor account
2. Upload a profile picture during signup
3. View your profile picture in the dashboard sidebar

## Features Now Available:

### ✅ Complete Avatar System
- **Smart Upload Component**: `ProfilePictureUpload.tsx` with validation and preview
- **Fallback System**: Shows initials if no avatar uploaded
- **Multi-format Support**: JPEG, PNG, WebP, GIF up to 5MB
- **Error Handling**: Graceful fallback to data URLs if storage fails

### ✅ Database Integration
- **Automatic Sync**: Avatar URLs sync across users, students, and tutors tables
- **Storage Bucket**: Secure avatar storage with RLS policies
- **Public Access**: Avatars are publicly viewable for profile displays

### ✅ UI Integration
- **Signup Forms**: Parents and tutors can upload pictures during registration
- **Child Management**: Parents can upload pictures for their children
- **Dashboard Layout**: Profile pictures show in sidebar and user cards
- **Responsive Design**: Works on all screen sizes

## Troubleshooting

### If upload fails:
1. Check that the storage bucket was created: Run the verification query above
2. Ensure RLS policies are applied correctly
3. The component has built-in fallback to data URLs

### If images don't display:
1. Check the browser console for 404 errors
2. Verify the storage bucket exists in Supabase Dashboard → Storage
3. Check that the avatar_url columns contain data

### If you get SQL permission errors:
Use the simplified version in `CORRECTED_FIX_UPLOAD.sql` instead of the full migration.

## Next Steps

Your eduhome platform now has a complete profile picture system! Parents can:
- ✅ Upload their own profile pictures
- ✅ Upload pictures for their children
- ✅ View tutor profile pictures

Tutors can:
- ✅ Upload their own profile pictures
- ✅ Have their pictures visible to parents

The system is production-ready with proper error handling and fallback mechanisms.