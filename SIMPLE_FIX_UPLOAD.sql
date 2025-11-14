-- SIMPLE FIX for Profile Picture Upload Issues
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/upaocsnwqbncntpvlqdy/sql

-- Step 1: Create the avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Add avatar_url columns if they don't exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.tutor_profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 3: Show verification status
SELECT 'Database fix completed successfully' as status,
       (SELECT COUNT(*) FROM storage.buckets WHERE id = 'avatars') as bucket_created,
       (SELECT COUNT(*) FROM public.users) as total_users,
       (SELECT COUNT(*) FROM public.users WHERE avatar_url IS NOT NULL) as users_with_avatars;

-- Step 4: Instructions for manually setting up RLS policies
/*
After running this SQL, you may need to manually set up RLS policies:

1. Go to Supabase Dashboard → Storage
2. Click on the "avatars" bucket
3. Click "Settings" (gear icon)
4. Set up policies in the "Policies" section
5. Or run this in the SQL editor if you have superuser permissions:
*/

-- Manual RLS policies (run only if you have admin permissions)
-- These may not work with regular user permissions
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their avatars" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

  CREATE POLICY "Avatars are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

  CREATE POLICY "Users can update their avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars');
END;
$$;