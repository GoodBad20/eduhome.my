-- CORRECTED FIX for Profile Picture Upload Issues
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
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Avatars are publicly viewable" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars'
);

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

-- Step 6: Test that everything is working
SELECT 'Upload fix completed successfully' as status,
       (SELECT COUNT(*) FROM storage.buckets WHERE id = 'avatars') as bucket_created,
       (SELECT COUNT(*) FROM public.users) as total_users,
       (SELECT COUNT(*) FROM public.users WHERE avatar_url IS NOT NULL) as users_with_avatars;