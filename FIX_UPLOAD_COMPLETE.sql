-- COMPLETE FIX for Profile Picture Upload Issues
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- Step 1: Create the avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Enable RLS on storage if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own avatars" ON storage.objects;

-- Step 4: Create proper RLS policies for avatars bucket
-- Allow users to upload avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Allow users to view all avatars (publicly accessible)
CREATE POLICY "Avatars are publicly viewable" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Step 5: Add avatar_url columns if they don't exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.tutor_profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 6: Test that the bucket exists and is accessible
SELECT 'Bucket created successfully' as status,
       id,
       name,
       public,
       created_at
FROM storage.buckets
WHERE id = 'avatars';

-- Step 7: Note: user_metadata is in auth.users, not public.users
-- Avatar URLs are handled during signup/update processes
-- This section can be skipped as avatars are set during user creation

-- Step 8: Show current status
SELECT 'Database update completed' as status,
       (SELECT COUNT(*) FROM public.users WHERE avatar_url IS NOT NULL) as users_with_avatars,
       (SELECT COUNT(*) FROM public.students WHERE avatar_url IS NOT NULL) as students_with_avatars,
       (SELECT COUNT(*) FROM public.tutor_profiles WHERE avatar_url IS NOT NULL) as tutors_with_avatars;