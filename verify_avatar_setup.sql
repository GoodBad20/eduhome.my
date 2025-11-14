-- Avatar Setup Verification Script
-- Run this script to verify that avatar support is properly configured

-- Check if the avatars bucket exists
SELECT
    id,
    name,
    public,
    created_at
FROM storage.buckets
WHERE id = 'avatars' OR name = 'avatars';

-- Check if avatar_url columns exist in user tables
SELECT
    'users' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'avatar_url'

UNION ALL

SELECT
    'students' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'students' AND column_name = 'avatar_url'

UNION ALL

SELECT
    'tutors' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'tutors' AND column_name = 'avatar_url'

UNION ALL

SELECT
    'tutor_profiles' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'tutor_profiles' AND column_name = 'avatar_url';

-- Check storage policies for avatars
SELECT
    policyname,
    tablename,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
AND (policyname LIKE '%avatar%' OR policyname LIKE '%users%');

-- Check if RLS is enabled on storage.objects
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check custom functions for avatar support
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND (routine_name LIKE '%avatar%' OR routine_name LIKE '%upload%');

-- Check triggers for avatar support
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_condition,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND (trigger_name LIKE '%avatar%' OR trigger_name LIKE '%upload%');

-- Show current storage objects (if any)
SELECT
    bucket_id,
    name,
    created_at,
    updated_at,
    last_accessed_at
FROM storage.objects
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC
LIMIT 10;

-- Show user counts with and without avatars
SELECT
    'users' as table_name,
    COUNT(*) as total_users,
    COUNT(avatar_url) as users_with_avatars,
    COUNT(*) - COUNT(avatar_url) as users_without_avatars
FROM users

UNION ALL

SELECT
    'students' as table_name,
    COUNT(*) as total_students,
    COUNT(avatar_url) as students_with_avatars,
    COUNT(*) - COUNT(avatar_url) as students_without_avatars
FROM students

UNION ALL

SELECT
    'tutors' as table_name,
    COUNT(*) as total_tutors,
    COUNT(avatar_url) as tutors_with_avatars,
    COUNT(*) - COUNT(avatar_url) as tutors_without_avatars
FROM tutors;

-- Test function permissions (run as authenticated user)
-- You can run these queries from your application to test permissions

-- Test get_avatar_url function
-- SELECT public.get_avatar_url('YOUR_USER_ID_HERE'::uuid);

-- Test if user can insert to storage.objects
-- This should work only for authenticated users trying to upload to their own folder
-- The test query would look like:
-- SELECT COUNT(*) FROM storage.objects
-- WHERE bucket_id = 'avatars'
-- AND auth.uid()::text = (storage.foldername(name))[1];